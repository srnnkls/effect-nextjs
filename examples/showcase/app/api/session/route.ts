import { Cookies } from "@mcrovero/effect-nextjs/Headers"
import { Effect, Option } from "effect"
import { findUser } from "../../../lib/domain"
import { BaseRoute, RequestId } from "../../../lib/runtime"

const setSession = Effect.fn("SessionRoute")(function*(request: Request) {
  const requestId = yield* RequestId
  const cookies = yield* Cookies

  const requested = Option.fromNullishOr(new URL(request.url).searchParams.get("user"))
  const userId = Option.getOrElse(requested, () => "ada")

  return yield* Option.match(findUser(userId), {
    onNone: () => Effect.succeed(Response.json({ error: `No such user: ${userId}` }, { status: 404 })),
    onSome: (user) =>
      Effect.sync(() => {
        cookies.set("showcase-user", user.id, { httpOnly: true, path: "/" })
        return Response.json({ requestId: requestId.value, user: user.id })
      })
  })
})

export const GET = BaseRoute.build(setSession)
