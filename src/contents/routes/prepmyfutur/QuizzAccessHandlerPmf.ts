import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface"
import { logMessage } from "~contents/utils/Logging"

export class QuizzAccessHandlerPmf implements RouteHandlerInterface {
  readonly routeRegex = /^\/platform\/.*\/access_.*/
  isDetected(): boolean {
    return this.routeRegex.test(globalThis.location.pathname)
  }

  async handler() {
    const isQuizzCompleted =
      document.querySelector(".activity_statut_completed") != null

    if (isQuizzCompleted) {
      const skipButton = document.querySelector<HTMLButtonElement>(
        "#study-plan-unit-header .btn.btn-primary"
      )

      if (skipButton == null) {
        await logMessage("😓 already done ...")
        return
      }

      await logMessage("⏩ Skipping")
      skipButton.click()
      return
    }

    await logMessage("☝️🤓 quiz time!")
    document
      .querySelector<HTMLButtonElement>(".main_activity .btn.btn-primary")
      .click()
  }
}
