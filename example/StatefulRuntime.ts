import { Context, Effect, Layer, ManagedRuntime } from "effect"
import * as Next from "../src/Next.js"

export class StatefulService extends Context.Service<StatefulService, object>()("app/StatefulService", {
  make: Effect.gen(function*() {
    yield* Effect.addFinalizer(() => Effect.log("StatefulService finalizer"))
    return {}
  })
}) {}

const statefulKey = Symbol.for("app/statefulRuntime")

export const statefulRuntime = ((globalThis as any)[statefulKey] ??= ManagedRuntime.make(
  Layer.effect(StatefulService, StatefulService.make)
)) as ManagedRuntime.ManagedRuntime<StatefulService, never>

export const BasePage = Next.makeWithRuntime("BasePage", statefulRuntime)

export const EphemeralLayer = Layer.effectContext(statefulRuntime.contextEffect)

export const EphemeralPage = Next.make("EphemeralPage", EphemeralLayer)
