/**
 * @since 0.30.0
 */
import { Effect } from "effect";
import { revalidatePath, revalidateTag } from "next/cache.js";
/**
 * Revalidate a specific path.
 *
 * @since 0.30.0
 * @category cache
 */
export const RevalidatePath = (...args) => Effect.sync(() => revalidatePath(...args));
/**
 * Revalidate a cache tag.
 *
 * @since 0.30.0
 * @category cache
 */
export const RevalidateTag = (...args) => Effect.sync(() => revalidateTag(...args));
//# sourceMappingURL=Cache.js.map