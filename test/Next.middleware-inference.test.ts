import { describe, expect, it } from "@effect/vitest"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"
import type * as Next from "../src/Next.js"
import * as Next_ from "../src/Next.js"
import * as NextMiddleware from "../src/NextMiddleware.js"

class Svc extends Context.Service<Svc, { readonly v: string }>()("inference/Svc") {}
class Usr extends Context.Service<Usr, { readonly id: string }>()("inference/Usr") {}

class Provides extends NextMiddleware.Tag<Provides>()("inference/Provides", { provides: Svc }) {
  static readonly layer = Layer.succeed(Provides, Provides.of(() => Effect.succeed({ v: "x" })))
}

class ProvidesFailing extends NextMiddleware.Tag<ProvidesFailing>()("inference/ProvidesFailing", {
  provides: Usr,
  failure: Schema.String
}) {
  static readonly layer = Layer.succeed(ProvidesFailing, ProvidesFailing.of(() => Effect.succeed({ id: "u" })))
}

class Wrapping extends NextMiddleware.Tag<Wrapping>()("inference/Wrapping", {
  wrap: true,
  catches: Schema.String,
  returns: Schema.String
}) {
  static readonly layer = Layer.succeed(
    Wrapping,
    Wrapping.of(({ next }) => next.pipe(Effect.catch((e: string) => Effect.succeed(e))))
  )
}

class Stray extends NextMiddleware.Tag<Stray>()("inference/Stray", { provides: Svc }) {}

const layerApp = Layer.mergeAll(Provides.layer, ProvidesFailing.layer, Wrapping.layer)

const pageFromSelfReferentialTags = Next_.make("inference/Base", layerApp)
  .middleware(Provides)
  .middleware(ProvidesFailing)
  .middleware(Wrapping)

type MiddlewareOf<P> = P extends Next.Next<infer _T, infer _L, infer M> ? M : never
type Extends<A, B> = [A] extends [B] ? true : false

const middlewareDidNotWidenToTagClassAny: Extends<
  MiddlewareOf<typeof pageFromSelfReferentialTags>,
  typeof Provides | typeof ProvidesFailing | typeof Wrapping
> = true

const providedServicesReachHandler = pageFromSelfReferentialTags.build(() =>
  Effect.gen(function*() {
    const svc = yield* Svc
    const usr = yield* Usr
    yield* Effect.fail("boom")
    return `${svc.v}/${usr.id}`
  })
)

const partialPage = Next_.make("inference/Partial", Provides.layer)
type ArityFor<M extends NextMiddleware.TagClassAny> = Parameters<typeof partialPage.middleware<M>>["length"]

const providedMiddlewareNeedsNoExtraArgument: Extends<ArityFor<typeof Provides>, 1> = true
const unprovidedMiddlewareDemandsErrorArgument: Extends<ArityFor<typeof Stray>, 2> = true

describe("Next middleware inference", () => {
  it("keeps concrete middleware types and runs the wrapped chain", async () => {
    expect(middlewareDidNotWidenToTagClassAny).toBe(true)
    expect(Stray.key).toBe("inference/Stray")
    expect(typeof partialPage.middleware).toBe("function")
    expect(providedMiddlewareNeedsNoExtraArgument).toBe(true)
    expect(unprovidedMiddlewareDemandsErrorArgument).toBe(true)
    await expect(providedServicesReachHandler()).resolves.toBe("boom")
  })
})
