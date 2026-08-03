/**
 * @since 0.30.0
 */
import { Effect } from "effect";
import { cookies, draftMode, headers } from "next/headers.js";
/**
 * Access request cookies.
 *
 * @since 0.30.0
 * @category request
 */
export declare const Cookies: Effect.Effect<Awaited<ReturnType<typeof cookies>>, never, never>;
/**
 * Access request headers.
 *
 * @since 0.30.0
 * @category request
 */
export declare const Headers: Effect.Effect<Awaited<ReturnType<typeof headers>>, never, never>;
/**
 * Access draft mode helpers.
 *
 * @since 0.30.0
 * @category request
 */
export declare const DraftMode: Effect.Effect<Awaited<ReturnType<typeof draftMode>>, never, never>;
//# sourceMappingURL=Headers.d.ts.map