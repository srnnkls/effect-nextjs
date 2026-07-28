import { NotFound } from "@mcrovero/effect-nextjs/Navigation"
import { decodeParamsUnknown, decodeSearchParamsUnknown } from "@mcrovero/effect-nextjs/Params"
import { Array as Arr, Effect, Option } from "effect"
import { activityFor, DashboardSearchParams, findUser, pageOf, RouteParams } from "../../../lib/domain"
import { AuthedPage, CurrentUser } from "../../../lib/runtime"

type Props = {
  params: Promise<Record<string, string | Array<string> | undefined>>
  searchParams: Promise<Record<string, string | Array<string> | undefined>>
}

const DashboardPage = Effect.fn("DashboardPage")(function*(props: Props) {
  const [params, search] = yield* Effect.all([
    decodeParamsUnknown(RouteParams)(props.params),
    decodeSearchParamsUnknown(DashboardSearchParams)(props.searchParams)
  ], { concurrency: 2 }).pipe(Effect.mapError((error) => `Invalid request: ${error}`))

  const viewer = yield* CurrentUser
  const user = yield* Option.match(findUser(params.userId), {
    onNone: () => NotFound,
    onSome: Effect.succeed
  })

  const tab = Option.getOrElse(Option.fromNullishOr(search.tab), () => "overview" as const)
  const activity = pageOf(activityFor(user.id), Option.fromNullishOr(search.page))

  return (
    <main>
      <h1>{user.name}</h1>
      <p>
        Plan: <strong>{user.plan}</strong> — viewing as <code>{viewer.name}</code>
      </p>

      <nav>
        <a href={`/dashboard/${user.id}?tab=overview`}>overview</a> {" · "}
        <a href={`/dashboard/${user.id}?tab=activity`}>activity</a>
      </nav>

      {tab === "activity"
        ? (
          <ul>
            {Arr.isReadonlyArrayNonEmpty(activity)
              ? Arr.map(activity, (entry) => <li key={`${entry.label}-${entry.at}`}>{entry.label}</li>)
              : <li>No activity on this page</li>}
          </ul>
        )
        : <p>Overview for {user.name}.</p>}
    </main>
  )
})

export default AuthedPage.build(DashboardPage)
