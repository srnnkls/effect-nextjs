import { Effect, Schema } from "effect";
/**
 * @since 0.30.0
 * @category params
 */
export const decodeParamsUnknown = schema => params => Effect.promise(() => params).pipe(Effect.flatMap(Schema.decodeUnknownEffect(schema)));
/**
 * @since 0.30.0
 * @category params
 */
export const decodeSearchParamsUnknown = schema => searchParams => Effect.promise(() => searchParams).pipe(Effect.flatMap(Schema.decodeUnknownEffect(schema)));
/**
 * @since 0.30.0
 * @category params
 */
export const decodeParams = schema => params => Effect.promise(() => params).pipe(Effect.flatMap(Schema.decodeEffect(schema)));
//# sourceMappingURL=Params.js.map