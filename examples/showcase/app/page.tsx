import { Array as Arr, Effect } from "effect"
import { listUsers } from "../lib/domain"
import { BasePage, RequestId } from "../lib/runtime"

const demos = [
  { href: "/dashboard/ada?tab=activity&page=1", label: "Params + search params (Params)" },
  { href: "/request", label: "Headers, Cookies, DraftMode (Headers)" },
  { href: "/navigate?to=redirect", label: "Redirect / PermanentRedirect / NotFound (Navigation)" },
  { href: "/uptime", label: "makeWithRuntime with a stateful runtime" },
  { href: "/api/revalidate", label: "RevalidatePath / RevalidateTag (Cache, route handler)" },
  { href: "/api/session", label: "Cookie mutation in a route handler" }
]

const HomePage = Effect.fn("HomePage")(function*() {
  const requestId = yield* RequestId
  const users = listUsers()

  return (
    <main>
      <p>
        Request id: <code>{requestId.value}</code>
      </p>

      <h2>Demos</h2>
      <ul>
        {Arr.map(demos, (demo) => (
          <li key={demo.href}>
            <a href={demo.href}>{demo.label}</a>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      <ul>
        {Arr.map(users, (user) => (
          <li key={user.id}>
            <a href={`/dashboard/${user.id}`}>{user.name}</a> — {user.plan}
          </li>
        ))}
      </ul>
    </main>
  )
})

export default BasePage.build(HomePage)
