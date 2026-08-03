import type { Effect } from "effect/Effect";
import type * as NextMiddleware from "../NextMiddleware.js";
/**
 * @since 0.5.0
 * @category utils
 */
export declare const createMiddlewareChain: (tags: ReadonlyArray<NextMiddleware.TagClassAny>, resolve: (tag: NextMiddleware.TagClassAny) => any, base: Effect<any, any, any>, options: {
    props: unknown;
}) => Effect<any, any, any>;
//# sourceMappingURL=middleware-chain.d.ts.map