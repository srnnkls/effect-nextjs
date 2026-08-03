import { Cookies, DraftMode, Headers } from "@mcrovero/effect-nextjs/Headers"
import { Effect, Option } from "effect"
import { BasePage } from "../../lib/runtime"

const RequestPage = Effect.fn("RequestPage")(function*() {
  const headers = yield* Headers
  const cookies = yield* Cookies
  const draft = yield* DraftMode

  const userAgent = Option.fromNullishOr(headers.get("user-agent"))
  const session = Option.fromNullishOr(cookies.get("showcase-user")?.value)

  return (
    <main>
      <h1>Request state</h1>
      <dl>
        <dt>User agent</dt>
        <dd>
          <code>{Option.getOrElse(userAgent, () => "unknown")}</code>
        </dd>

        <dt>showcase-user cookie</dt>
        <dd>
          <code>{Option.getOrElse(session, () => "not set")}</code>
        </dd>

        <dt>Draft mode</dt>
        <dd>
          <code>{draft.isEnabled ? "enabled" : "disabled"}</code>
        </dd>
      </dl>
      <p>
        Set the cookie via <a href="/api/session?user=grace">/api/session?user=grace</a>, then reload.
      </p>
    </main>
  )
})

export default BasePage.build(RequestPage)
