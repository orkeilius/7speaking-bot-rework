import type { PlasmoCSConfig } from "plasmo"

import { BeginnerWorkshopHandler } from "~contents/routes/7speaking/BeginnerWorkshopHandler"
import { HomeHandler } from "~contents/routes/7speaking/HomeHandler"
import { LearningHandler7s } from "~contents/routes/7speaking/LearningHandler7s"
import { QuizzHandler } from "~contents/routes/QuizzHandler"
import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface"
import { StorageKeys, storageService } from "~contents/services/StorageService"
import { updateService } from "~contents/services/UpdateService"
import { Constants } from "~contents/utils/Constants"
import { logMessage } from "~contents/utils/Logging"
import { LearningHandlerPmf } from "~contents/routes/prepmyfutur/LearningHandlerPmf"
import { QuizzAccessHandlerPmf } from "~contents/routes/prepmyfutur/QuizzAccessHandlerPmf"

export const config: PlasmoCSConfig = {
  matches: ["https://user.7speaking.com/*", "https://prepmyfuture.com/*"],
  all_frames: true
}

const routesHandler: RouteHandlerInterface[] = [
  new QuizzHandler(),
  new HomeHandler(),
  new BeginnerWorkshopHandler(),
  new LearningHandler7s(),
  new LearningHandlerPmf()
  new LearningHandlerPmf(),
  new QuizzAccessHandlerPmf(),
]

class Bot {
  uniqueContentScriptId: string = null

  async setup() {
    this.uniqueContentScriptId = crypto.randomUUID()
    const diff =
      Date.now() - (await storageService.get<number>(StorageKeys.LAST_TIME_RUN))
    if (diff >= Constants.maxTimeUseDiffTooLong) {
      await storageService.set(StorageKeys.ACTIVE, false)
    }
    await storageService.set(
      StorageKeys.LAST_CONTENT_SCRIPT_ID,
      this.uniqueContentScriptId
    )
  }

  async loop() {
    try {
      await this.main()
    } catch (e) {
      await logMessage(`🚨 error in bot (${(e as Error).message})`)
    }

    setTimeout(() => this.loop(), 1000)
  }

  async main() {
    await this.updateLastTime()
    const active = await storageService.get(StorageKeys.ACTIVE)

    if (
      (await storageService.get<string>(StorageKeys.LAST_CONTENT_SCRIPT_ID)) !==
      this.uniqueContentScriptId
    ) {
      const overtake = globalThis.confirm(
        "Another instance of the bot is running. Close this tab or take over the bot in this tab."
      )
      if (!overtake) {
        return
      }
      await storageService.set(
        StorageKeys.LAST_CONTENT_SCRIPT_ID,
        this.uniqueContentScriptId
      )
    }

    const route = routesHandler.find((handler) => handler.isDetected())
    if (route === undefined) {
      logMessage("🟡 page unknown")
      return
    }
    if (!active) {
      logMessage(
        updateService.getUpdateAvailable()
          ? "🔁 Update available"
          : "🧠 ready to learn !"
      )
      return
    }
    await storageService.update(StorageKeys.STAT_TIME_USE)
    await storageService.update(StorageKeys.LAST_TIME_RUN)
    await route.handler()
  }

  async updateLastTime() {
    await storageService.update(StorageKeys.LAST_TIME)
  }
}

console.log("Bot started")
const bot = new Bot()

bot.setup().then(() => bot.loop())
