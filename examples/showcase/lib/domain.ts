import { Array as Arr, Data, HashMap, Option, Order, Schema } from "effect"

export class UserNotFound extends Data.TaggedError("UserNotFound")<{ readonly userId: string }> {}

export const RouteParams = Schema.Struct({
  userId: Schema.NonEmptyString
})

export const DashboardSearchParams = Schema.Struct({
  tab: Schema.optional(Schema.Literals(["overview", "activity"])),
  page: Schema.optional(Schema.FiniteFromString)
})

export const RevalidateBody = Schema.Struct({
  path: Schema.optional(Schema.NonEmptyString),
  tag: Schema.optional(Schema.NonEmptyString)
})

export interface User {
  readonly id: string
  readonly name: string
  readonly plan: "free" | "pro"
}

export interface Activity {
  readonly userId: string
  readonly label: string
  readonly at: number
}

const users: HashMap.HashMap<string, User> = HashMap.fromIterable([
  ["ada", { id: "ada", name: "Ada Lovelace", plan: "pro" }],
  ["alan", { id: "alan", name: "Alan Turing", plan: "free" }],
  ["grace", { id: "grace", name: "Grace Hopper", plan: "pro" }]
])

const activities: ReadonlyArray<Activity> = [
  { userId: "ada", label: "Published a note", at: 3 },
  { userId: "ada", label: "Signed in", at: 1 },
  { userId: "alan", label: "Signed in", at: 2 },
  { userId: "ada", label: "Renamed workspace", at: 2 },
  { userId: "grace", label: "Invited a teammate", at: 5 }
]

const byRecency = Order.flip(Order.mapInput(Order.Number, (activity: Activity) => activity.at))

export const findUser = (userId: string): Option.Option<User> => HashMap.get(users, userId)

export const listUsers = (): ReadonlyArray<User> =>
  Arr.sortBy(Order.mapInput(Order.String, (user: User) => user.name))(HashMap.toValues(users))

export const activityFor = (userId: string): ReadonlyArray<Activity> =>
  Arr.sortBy(byRecency)(Arr.filter(activities, (activity) => activity.userId === userId))

export const pageOf = <A>(items: ReadonlyArray<A>, page: Option.Option<number>): ReadonlyArray<A> => {
  const size = 2
  const index = Math.max(0, Option.getOrElse(page, () => 1) - 1)
  return Arr.take(Arr.drop(items, index * size), size)
}
