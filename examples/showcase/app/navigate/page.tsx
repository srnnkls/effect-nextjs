import { NotFound, PermanentRedirect, Redirect } from "@mcrovero/effect-nextjs/Navigation"
import { decodeSearchParamsUnknown } from "@mcrovero/effect-nextjs/Params"
import { Effect, Option, Schema } from "effect"
import { BasePage } from "../../lib/runtime"

const NavigateSearch = Schema.Struct({
  to: Schema.optional(Schema.Literals(["redirect", "permanent", "not-found"]))
})

type Props = { searchParams: Promise<Record<string, string | Array<string> | undefined>> }

const NavigatePage = Effect.fn("NavigatePage")(function*(props: Props) {
  const search = yield* decodeSearchParamsUnknown(NavigateSearch)(props.searchParams).pipe(
    Effect.mapError((error) => `Invalid request: ${error}`)
  )

  const target = Option.fromNullishOr(search.to)

  if (Option.isSome(target)) {
    switch (target.value) {
      case "redirect":
        return yield* Redirect("/request")
      case "permanent":
        return yield* PermanentRedirect("/request")
      case "not-found":
        return yield* NotFound
    }
  }

  return (
    <main>
      <h1>Navigation</h1>
      <ul>
        <li>
          <a href="/navigate?to=redirect">Redirect (307)</a>
        </li>
        <li>
          <a href="/navigate?to=permanent">PermanentRedirect (308)</a>
        </li>
        <li>
          <a href="/navigate?to=not-found">NotFound (404)</a>
        </li>
      </ul>
    </main>
  )
})

export default BasePage.build(NavigatePage)
