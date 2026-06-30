import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface";
import { logMessage } from "~contents/utils/Logging";

export class MultipleStepQuizAccessHandlerPmf implements RouteHandlerInterface {
  readonly routeRegex = /^\/platform\/.*\/continue_user_exam.*/
  isDetected(): boolean {
    return this.routeRegex.test(globalThis.location.pathname)
  }

  async handler() {
    logMessage("💡 In to the next one")

    const nextRow = document
      .querySelectorAll(".card-body > .row")
      .values()
      .filter((x) => x.querySelector("a.btn.btn-primary") != null) //  filter non-exercice row
      .find((x) => x.querySelector("a.btn:not(.btn-primary)") == null) // filter row with restart button

    nextRow.querySelector<HTMLButtonElement>("a.btn.btn-primary").click()
  }
}
