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
export const Cookies = /*#__PURE__*/Effect.promise(() => cookies());
/**
 * Access request headers.
 *
 * @since 0.30.0
 * @category request
 */
export const Headers = /*#__PURE__*/Effect.promise(() => headers());
/**
 * Access draft mode helpers.
 *
 * @since 0.30.0
 * @category request
 */
export const DraftMode = /*#__PURE__*/Effect.promise(() => draftMode());
//# sourceMappingURL=Headers.js.map