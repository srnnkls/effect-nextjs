/**
 * @since 0.30.0
 */
import { Effect } from "effect";
import { notFound, permanentRedirect, redirect } from "next/navigation.js";
/**
 * Redirect to another route. This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export const Redirect = (...args) => Effect.sync(() => redirect(...args));
/**
 * Permanent redirect (308). This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export const PermanentRedirect = (...args) => Effect.sync(() => permanentRedirect(...args));
/**
 * Render the 404 page. This never returns.
 *
 * @since 0.30.0
 * @category navigation
 */
export const NotFound = /*#__PURE__*/Effect.sync(() => notFound());
//# sourceMappingURL=Navigation.js.map