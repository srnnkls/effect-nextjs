import { Effect } from "effect";
import type * as ManagedRuntime from "effect/ManagedRuntime";
/**
 * @since 0.5.0
 * @category utils
 */
export declare const executeWithRuntime: <A>(runtime: ManagedRuntime.ManagedRuntime<any, any> | undefined, effect: Effect.Effect<A, any, never>) => Promise<A>;
//# sourceMappingURL=executor.d.ts.map