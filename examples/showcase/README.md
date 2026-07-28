# effect-nextjs showcase

A runnable Next.js App Router application that exercises every wrapper this library exports, written with Effect data structures and combinators rather than plain JavaScript equivalents.

Note the distinction from the sibling `example/` directory at the repo root: that holds single-file snippets which exist to be typechecked, while this is a complete app you can start and click through.

## Running it

From the repository root:

```sh
pnpm install
pnpm build                      # the app links to the built dist/
pnpm --filter effect-nextjs-showcase dev
```

Then open <http://localhost:3000>.

## What each route demonstrates

| Route | Wrappers |
| --- | --- |
| `/` | `Next.make`, `.middleware`, `.build`, `RequestId` from a plain middleware |
| `/dashboard/[userId]` | `Params.decodeParamsUnknown`, `Params.decodeSearchParamsUnknown`, `Navigation.NotFound`, a `provides` middleware |
| `/request` | `Headers.Headers`, `Headers.Cookies`, `Headers.DraftMode` |
| `/navigate` | `Navigation.Redirect`, `Navigation.PermanentRedirect`, `Navigation.NotFound` |
| `/uptime` | `Next.makeWithRuntime` over a `ManagedRuntime` held across requests |
| `/api/revalidate` | `Cache.RevalidatePath`, `Cache.RevalidateTag`, `Params.decodeParams` |
| `/api/session` | `Headers.Cookies` mutation, which Next.js permits only in route handlers and server actions |

`lib/runtime.ts` defines all three middleware shapes: one that provides a service (`RequestIdMiddleware`), one that provides a service and can fail (`AuthMiddleware`), and one wrapping middleware that times the handler and catches failures (`TimingMiddleware`).

## Effect data structures in use

`lib/domain.ts` models the data with `HashMap` for the user table, `Order` combinators for sorting, `Array` for pagination, `Option` for absent values, `Data.TaggedError` for domain errors, and `Schema` for route and search-param validation. Pages consume these with `Effect.gen`, `Effect.all`, `Effect.fn`, and `Option.match` rather than unwrapping to plain values early.

## Layer naming and placement

Layers follow the Effect v4 convention of `layer` rather than v3's `Live` or `Default`, with descriptive suffixes for variants — `layerAuth`, `layerTiming`, `layerApp`. Services defined with a `make` option expose it as a static, as `Clock.layer` does.

Middleware layers are the exception: they are declared at module scope rather than as `static readonly layer` on the middleware class. A static makes the class type self-referential, and `.middleware(M)` then infers `M` as `TagClassAny` instead of the concrete class. Because `TagClassAny` declares `provides` as optional, the provided service silently disappears from the handler's requirements, and the page fails to compile with a confusing error pointing at the handler rather than the layer. Keeping middleware layers outside the class body avoids this.

## Two behaviors worth copying

A wrapping middleware's `returns` schema unions into the handler's return type. If the handler is a page, that type has to be renderable — `TimingMiddleware` returns `Schema.String` for this reason, since a `Schema.Struct` would make the page component fail Next.js' type validation.

`Schema.NumberFromString` accepts any string and yields `NaN` for non-numeric input, so `?page=abc` would decode successfully. `lib/domain.ts` uses `Schema.FiniteFromString` instead, which rejects it.

## Trying the failure paths

```sh
curl -s "localhost:3000/dashboard/ada?page=abc"        # caught by TimingMiddleware
curl -s -o /dev/null -w "%{http_code}\n" \
  "localhost:3000/dashboard/nobody"                    # 404 via Navigation.NotFound
curl -s -i "localhost:3000/api/session?user=grace"     # sets the auth cookie
curl -s "localhost:3000/dashboard/ada" -H "cookie: showcase-user=grace"
```
