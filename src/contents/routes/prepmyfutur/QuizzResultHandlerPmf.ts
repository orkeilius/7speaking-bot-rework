import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface";
import { logMessage } from "~contents/utils/Logging";

export class QuizzResultHandlerPmf implements RouteHandlerInterface {
  readonly resultRouteRegex = /^\/platform\/.*exercise_results.*/
  readonly adaptativeRouteRegex = /^\/platform\/.*adaptive_exercises.*/

  isDetected(): boolean {
    const isQuizzResult = this.resultRouteRegex.test(globalThis.location.pathname)
    if (isQuizzResult) {
      return true
    }

    const isAdaptiveQuizz = this.adaptativeRouteRegex.test(globalThis.location.pathname)
    const isAdaptativeResult = document.querySelectorAll(
        "span.answer-label.qru span.rep-checkbox.radio"
    ).values().every((el) => !el.checkVisibility());

    if (isAdaptiveQuizz && isAdaptativeResult) {
      return true
    }

    return false
  }

  async handler() {
    logMessage("💡 In to the next one")
    document.querySelector<HTMLButtonElement>(".card a.btn.btn-primary").click()
  }
}
