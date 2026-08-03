import { Effect, Schema } from "effect";
type NextBaseParams = Promise<Record<string, string | Array<string> | undefined>>;
/**
 * @since 0.30.0
 * @category params
 */
export declare const decodeParamsUnknown: <S extends Schema.Codec<any, any, any, any>, P extends NextBaseParams>(schema: S) => (params: P) => Effect.Effect<S["Type"], Schema.SchemaError, S["DecodingServices"]>;
/**
 * @since 0.30.0
 * @category params
 */
export declare const decodeSearchParamsUnknown: <S extends Schema.Codec<any, any, any, any>, P extends NextBaseParams>(schema: S) => (searchParams: P) => Effect.Effect<S["Type"], Schema.SchemaError, S["DecodingServices"]>;
/**
 * @since 0.30.0
 * @category params
 */
export declare const decodeParams: <S extends Schema.Codec<any, any, any, any>>(schema: S) => (params: Promise<S["Encoded"]>) => Effect.Effect<S["Type"], Schema.SchemaError, S["DecodingServices"]>;
export {};
//# sourceMappingURL=Params.d.ts.map