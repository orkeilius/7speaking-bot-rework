import {HomeHandler} from "~contents/routes/HomeHandler";
import {BeginnerWorkshopHandler} from "~contents/routes/BeginnerWorkshopHandler";
import {LearningHandler} from "~contents/routes/LearningHandler";
import {QuizzHandler} from "~contents/routes/QuizzHandler";
import type { PlasmoCSConfig } from "plasmo"
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";
import {Constants} from "~contents/utils/Constants";
import {updateService} from "~contents/services/UpdateService";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    all_frames: true
}

const routesHandler: RouteHandlerInterface[] = [new HomeHandler(), new BeginnerWorkshopHandler(),new LearningHandler(),new QuizzHandler()];

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
        const active = await storageService.getActive();

        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        const route = routesHandler.find(handler => handler.routeRegex.test(url));

        if (route === undefined) {
            logMessage("🟡 page unknown")
            return
        }
        if (!active) {
            logMessage(await updateService.getUpdateAvailable() ? "🔁 Update available":"🧠 ready to learn !")
            return
        }
        await storageService.addStatTimeUse()
        await storageService.setLastTimeRun()
        await route.handler()
    }

    async updateLastTime() {
        const delai = Date.now() - await storageService.getLastTime()
        if (delai > Constants.maxTimeUseDiffTooLong)  {
            await storageService.setActive(false)
        }
        await storageService.setLastTime()
    }
}

console.log("Bot started")
const bot = new Bot()

bot.loop()