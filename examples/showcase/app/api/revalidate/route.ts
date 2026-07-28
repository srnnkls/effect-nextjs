import { RevalidatePath, RevalidateTag } from "@mcrovero/effect-nextjs/Cache"
import { decodeParams } from "@mcrovero/effect-nextjs/Params"
import { Effect, Option } from "effect"
import { RevalidateBody } from "../../../lib/domain"
import { BaseRoute, RequestId } from "../../../lib/runtime"

const revalidate = Effect.fn("RevalidateRoute")(function*(request: Request) {
  const requestId = yield* RequestId

  const body = yield* decodeParams(RevalidateBody)(
    request.method === "POST"
      ? request.json() as Promise<{ path?: string; tag?: string }>
      : Promise.resolve({ path: "/" })
  ).pipe(Effect.orDie)

  const path = Option.fromNullishOr(body.path)
  const tag = Option.fromNullishOr(body.tag)

  yield* Option.match(path, {
    onNone: () => Effect.void,
    onSome: (value) => RevalidatePath(value)
  })

  yield* Option.match(tag, {
    onNone: () => Effect.void,
    onSome: (value) => RevalidateTag(value)
  })

  return Response.json({
    requestId: requestId.value,
    revalidated: {
      path: Option.getOrNull(path),
      tag: Option.getOrNull(tag)
    }
  })
})

export const GET = BaseRoute.build(revalidate)
export const POST = BaseRoute.build(revalidate)
