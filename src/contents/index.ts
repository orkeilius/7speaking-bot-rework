import {HomeHandler} from "~contents/routes/HomeHandler";
import {BeginnerWorkshopHandler} from "~contents/routes/BeginnerWorkshopHandler";
import {LearningHandler} from "~contents/routes/LearningHandler";
import {QuizzHandler} from "~contents/routes/QuizzHandler";
import type { PlasmoCSConfig } from "plasmo"
import {logMessage} from "~contents/utils/Logging";
import {StorageKeys, storageService} from "~contents/services/StorageService";
import {Constants} from "~contents/utils/Constants";
import {updateService} from "~contents/services/UpdateService";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    all_frames: true
}

const routesHandler: RouteHandlerInterface[] = [new QuizzHandler(),new HomeHandler(), new BeginnerWorkshopHandler(),new LearningHandler()];

class Bot {

    async loop() {
        try {
            await this.main()
        } catch (e){
            await logMessage(`🚨 error in bot (${(e as Error).message})`)
        }

        setTimeout(() => this.loop(), 1000);
    }
    async main() {
        await this.updateLastTime()
        const active = await storageService.get(StorageKeys.ACTIVE);

        const route = routesHandler.find(handler => handler.isDetected());

        if (route === undefined) {
            logMessage("🟡 page unknown")
            return
        }
        if (!active) {
            logMessage(await updateService.getUpdateAvailable() ? "🔁 Update available":"🧠 ready to learn !")
            return
        }
        await storageService.update(StorageKeys.STAT_TIME_USE)
        await storageService.update(StorageKeys.LAST_TIME_RUN)
        await route.handler()
    }

    async updateLastTime() {
        const delai = Date.now() - await storageService.get<number>(StorageKeys.LAST_TIME)
        if (delai > Constants.maxTimeUseDiffTooLong)  {
            await storageService.set(StorageKeys.ACTIVE,false)
        }
        await storageService.update(StorageKeys.LAST_TIME)
    }
}

console.log("Bot started")
const bot = new Bot()

bot.loop()