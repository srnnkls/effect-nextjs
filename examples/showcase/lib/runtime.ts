import * as RequestState from "@mcrovero/effect-nextjs/Headers"
import * as Next from "@mcrovero/effect-nextjs/Next"
import * as NextMiddleware from "@mcrovero/effect-nextjs/NextMiddleware"
import { Context, DateTime, Duration, Effect, Layer, ManagedRuntime, Option, Schema } from "effect"
import { findUser, type User, UserNotFound } from "./domain"

export class RequestId extends Context.Service<RequestId, { readonly value: string }>()("showcase/RequestId") {}

export class CurrentUser extends Context.Service<CurrentUser, User>()("showcase/CurrentUser") {}

export class Clock extends Context.Service<Clock, { readonly startedAt: DateTime.Utc }>()("showcase/Clock", {
  make: Effect.map(DateTime.now, (startedAt) => ({ startedAt }))
}) {
  static readonly layer = Layer.effect(this, this.make)
}

export class RequestIdMiddleware extends NextMiddleware.Tag<RequestIdMiddleware>()(
  "showcase/RequestIdMiddleware",
  { provides: RequestId }
) {
  static readonly layer = Layer.succeed(
    RequestIdMiddleware,
    RequestIdMiddleware.of(() =>
      Effect.gen(function*() {
        const headers = yield* RequestState.Headers
        const fromHeader = Option.fromNullishOr(headers.get("x-request-id"))
        return { value: Option.getOrElse(fromHeader, () => "req-local") }
      })
    )
  )
}

export class AuthMiddleware extends NextMiddleware.Tag<AuthMiddleware>()(
  "showcase/AuthMiddleware",
  { provides: CurrentUser, failure: Schema.String }
) {
  static readonly layer = Layer.succeed(
    AuthMiddleware,
    AuthMiddleware.of(() =>
      Effect.gen(function*() {
        const cookies = yield* RequestState.Cookies
        const claimed = Option.fromNullishOr(cookies.get("showcase-user")?.value)
        const userId = Option.getOrElse(claimed, () => "ada")
        return yield* Option.match(findUser(userId), {
          onNone: () => Effect.fail(`No such user: ${userId}`),
          onSome: Effect.succeed
        })
      })
    )
  )
}

export class TimingMiddleware extends NextMiddleware.Tag<TimingMiddleware>()(
  "showcase/TimingMiddleware",
  {
    wrap: true,
    catches: Schema.String,
    returns: Schema.String
  }
) {
  static readonly layer = Layer.succeed(
    TimingMiddleware,
    TimingMiddleware.of(({ next }) =>
      Effect.gen(function*() {
        const started = yield* DateTime.now
        const result = yield* next.pipe(Effect.catch((error: string) => Effect.succeed(`Request failed: ${error}`)))
        const finished = yield* DateTime.now
        const elapsed = Duration.millis(DateTime.toEpochMillis(finished) - DateTime.toEpochMillis(started))
        yield* Effect.log(`handled in ${Duration.format(elapsed)}`)
        return result
      })
    )
  )
}

export const layerApp = Layer.mergeAll(RequestIdMiddleware.layer, AuthMiddleware.layer, TimingMiddleware.layer)

export const BasePage = Next.make("showcase/BasePage", layerApp)
  .middleware(RequestIdMiddleware)
  .middleware(TimingMiddleware)

export const AuthedPage = BasePage.middleware(AuthMiddleware)

export const BaseRoute = Next.make("showcase/BaseRoute", layerApp)
  .middleware(RequestIdMiddleware)

const clockKey = Symbol.for("showcase/clockRuntime")

const clockRuntime = ((globalThis as Record<symbol, unknown>)[clockKey] ??= ManagedRuntime.make(
  Clock.layer
)) as ManagedRuntime.ManagedRuntime<Clock, never>

export const UptimePage = Next.makeWithRuntime("showcase/UptimePage", clockRuntime)

export { UserNotFound }
