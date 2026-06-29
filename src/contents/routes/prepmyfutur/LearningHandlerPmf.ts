import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface";
import { StorageKeys, storageService } from "~contents/services/StorageService";
import { TimerType, timeService } from "~contents/services/TimerService"
import { logMessage } from "~contents/utils/Logging"

export class LearningHandlerPmf implements RouteHandlerInterface {

  readonly routeRegex = /^\/platform\/.*\/lesson_tab\/.*/;
  isDetected(): boolean {
    return this.routeRegex.test(globalThis.location.pathname);
  }

    async handler() {

        if(!await timeService.isWaitingEnded(TimerType.QUIZ)){
            return
        }
        logMessage("💡 In to the next one")
        await storageService.update(StorageKeys.STAT_QUIZ_DONE)
        document.querySelector<HTMLButtonElement>("a.btn.btn-primary").click();
    }

}
