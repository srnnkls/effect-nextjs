/**
 * @since 0.30.0
 */
import { Effect } from "effect";
import { permanentRedirect, redirect } from "next/navigation.js";
/**
 * Redirect to another route. This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export declare const Redirect: (...args: Parameters<typeof redirect>) => Effect.Effect<never, never, never>;
/**
 * Permanent redirect (308). This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export declare const PermanentRedirect: (...args: Parameters<typeof permanentRedirect>) => Effect.Effect<never, never, never>;
/**
 * Render the 404 page. This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export declare const NotFound: Effect.Effect<never, never, never>;
//# sourceMappingURL=Navigation.d.ts.map