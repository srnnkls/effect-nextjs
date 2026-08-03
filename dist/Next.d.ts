/**
 * @since 0.5.0
 */
import { Effect } from "effect";
import * as Context_ from "effect/Context";
import type * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import type { Pipeable } from "effect/Pipeable";
import type * as Schema from "effect/Schema";
import type * as NextMiddleware from "./NextMiddleware.js";
/**
 * @since 0.5.0
 * @category type ids
 */
export declare const TypeId: unique symbol;
/**
 * @since 0.5.0
 * @category type ids
 */
export type TypeId = typeof TypeId;
interface Any extends Pipeable {
    readonly [TypeId]: TypeId;
    readonly _tag: string;
    readonly key: string;
}
/**
 * Extracts the provided environment from a `Layer`.
 */
type LayerSuccess<L> = L extends Layer.Layer<infer ROut, any, any> ? ROut : never;
/**
 * @since 0.5.0
 * @category models
 */
export interface Next<in out Tag extends string, out L extends Layer.Layer<any, any, any> | undefined, out Middleware extends NextMiddleware.TagClassAny = never> extends Pipeable {
    new (_: never): object;
    readonly [TypeId]: TypeId;
    readonly _tag: Tag;
    readonly key: string;
    readonly middlewares: ReadonlyArray<Middleware>;
    readonly runtime?: ManagedRuntime.ManagedRuntime<any, any>;
    /**
     * Adds a middleware tag to this handler. The middleware must be satisfied by
     * the environment provided by `L`.
     */
    middleware<M extends NextMiddleware.TagClassAny>(middleware: Context_.Service.Identifier<M> extends LayerSuccess<L> ? M : never): Next<Tag, L, Middleware | M>;
    /**
     * Finalizes the handler by supplying an Effect-based implementation and
     * returns an async function compatible with Next.js.
     */
    build<A extends Array<any>, O>(handler: BuildHandler<Next<Tag, L, Middleware>, A, O>): (...args: A) => Promise<ReturnType<BuildHandler<Next<Tag, L, Middleware>, A, O>> extends Effect.Effect<infer _A, any, any> ? _A | WrappedReturns<Middleware> : never>;
}
/**
 * @since 0.5.0
 * @category constructors
 */
export declare function make<const Tag extends string, const R, const E>(tag: Tag, layer: Layer.Layer<R, E, never>): Next<Tag, Layer.Layer<R, E, never>>;
/**
 * @since 0.5.0
 * @category constructors
 */
export declare function makeWithRuntime<const Tag extends string, R, E>(tag: Tag, runtime: ManagedRuntime.ManagedRuntime<R, E>): Next<Tag, Layer.Layer<R, E, never>>;
/**
 * Computes the environment required by a `Next` handler: the environment
 * provided by its `Layer` plus any environments declared by middleware tags.
 */
type ExtractProvides<R extends Any> = R extends Next<infer _Tag, infer _Layer, infer _Middleware> ? LayerSuccess<_Layer> | (_Middleware extends {
    readonly provides: Context_.Key<infer _I, any>;
} ? _I : never) : never;
/**
 * Signature of the effectful handler accepted by `build`.
 */
type BuildHandler<P extends Any, A extends Array<any>, O> = P extends Next<infer _Tag, infer _Layer, infer _Middleware> ? (...args: A) => Effect.Effect<O, CatchesFromMiddleware<_Middleware>, ExtractProvides<P>> : never;
/**
 * Computes the wrapped return type produced by middleware implementing the
 * `wrap` protocol. When no wrapper is present, yields `never`.
 */
type WrappedReturns<M> = M extends {
    readonly wrap: true;
} ? (M extends {
    readonly returns: infer S extends Schema.Top;
} ? S["Type"] : never) : never;
/** Extracts the union of error types that middleware can catch. */
type CatchesFromMiddleware<M> = M extends {
    readonly catches: infer S extends Schema.Top;
} ? S["Type"] : never;
export {};
//# sourceMappingURL=Next.d.ts.map