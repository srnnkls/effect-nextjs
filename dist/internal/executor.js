import { Cause, Effect, Exit } from "effect";
import { unstable_rethrow } from "next/dist/client/components/unstable-rethrow.server.js";
/**
 * @since 0.5.0
 * @category utils
 */
export const executeWithRuntime = async (runtime, effect) => {
  const result = runtime ? await runtime.runPromiseExit(effect) : await Effect.runPromiseExit(effect);
  if (Exit.isFailure(result)) {
    const defects = result.cause.reasons.filter(Cause.isDieReason).map(reason => reason.defect);
    if (defects.length === 1) {
      unstable_rethrow(defects[0]);
    }
    const errors = Cause.prettyErrors(result.cause);
    throw errors[0] ?? Cause.squash(result.cause);
  }
  return result.value;
};
//# sourceMappingURL=executor.js.map