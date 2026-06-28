import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface";
import { logMessage } from "~contents/utils/Logging";

export class QuizzResultHandlerPmf implements RouteHandlerInterface {
  readonly routeRegex = /^\/platform\/.*exercise_results.*/
  isDetected(): boolean {
    return this.routeRegex.test(globalThis.location.pathname)
  }

  async handler() {
    logMessage("💡 In to the next one")
    document.querySelector<HTMLButtonElement>("a.btn.btn-primary").click()
  }
}
