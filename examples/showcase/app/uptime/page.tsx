import { DateTime, Duration, Effect } from "effect"
import { Clock, UptimePage } from "../../lib/runtime"

export const dynamic = "force-dynamic"

const Uptime = Effect.fn("UptimePage")(function*() {
  const clock = yield* Clock
  const now = yield* DateTime.now
  const uptime = Duration.millis(DateTime.toEpochMillis(now) - DateTime.toEpochMillis(clock.startedAt))

  return (
    <main>
      <h1>Stateful runtime</h1>
      <p>
        This page is built with <code>Next.makeWithRuntime</code>, so the <code>Clock</code>{" "}
        service is constructed once and reused across requests.
      </p>
      <p>
        Runtime started at <code>{DateTime.formatIso(clock.startedAt)}</code>
      </p>
      <p>
        Uptime: <code>{Duration.format(uptime)}</code>
      </p>
    </main>
  )
})

export default UptimePage.build(Uptime)
