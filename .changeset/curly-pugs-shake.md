---
"@mcrovero/effect-nextjs": minor
---

Migrate to Effect v4 (`effect@4.0.0-beta.102`).

This is a breaking change: the peer dependency moves from `effect >=3.20.0 <4` to `effect ^4.0.0-beta.102`, and the package is now ESM-only to match Effect v4. Consumers on the Effect v3 line should stay on `0.32.x`.

API surface changes that consumers will notice:

- Middleware tags are now built on `Context.Service` instead of `Context.Tag`. Define services as `class CurrentUser extends Context.Service<CurrentUser, Shape>()("CurrentUser") {}`.
- `Params` helpers accept a `Schema.Codec` and decode through `Schema.decodeUnknownEffect` / `Schema.decodeEffect`. Decoding now fails with `SchemaError` instead of `ParseError`.
- The CommonJS build has been removed. `dist/` is published directly with an ESM-only `exports` map; import specifiers such as `@mcrovero/effect-nextjs/Next` are unchanged.
- `Next.make` no longer sets an unhandled-error log level. Effect v4 does not auto-log unhandled fiber failures, so Next.js control-flow errors (`redirect`, `notFound`) no longer need suppression.
