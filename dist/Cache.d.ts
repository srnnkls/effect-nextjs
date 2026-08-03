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
export declare const RevalidatePath: (...args: Parameters<typeof revalidatePath>) => Effect.Effect<void, never, never>;
/**
 * Revalidate a cache tag.
 *
 * @since 0.30.0
 * @category cache
 */
export declare const RevalidateTag: (...args: Parameters<typeof revalidateTag>) => Effect.Effect<void, never, never>;
//# sourceMappingURL=Cache.d.ts.map