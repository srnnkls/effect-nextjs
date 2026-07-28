import * as RequestState from "@mcrovero/effect-nextjs/Headers"
import * as Next from "@mcrovero/effect-nextjs/Next"
import * as NextMiddleware from "@mcrovero/effect-nextjs/NextMiddleware"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

export class RequestId extends Context.Service<RequestId, { value: string | null }>()("fixtures/next-app/RequestId") {}

export class RequestIdMiddleware extends NextMiddleware.Tag<RequestIdMiddleware>()(
  "fixtures/next-app/RequestIdMiddleware",
  { provides: RequestId }
) {}

const layerRequestId = Layer.succeed(
  RequestIdMiddleware,
  RequestIdMiddleware.of(() =>
    Effect.gen(function*() {
      const headers = yield* RequestState.Headers
      return { value: headers.get("x-request-id") }
    })
  )
)

const layerApp = Layer.mergeAll(layerRequestId)

export const BasePage = Next.make("fixtures/next-app/BasePage", layerApp)
export const BaseRoute = Next.make("fixtures/next-app/BaseRoute", layerApp)
