import {HomeHandler} from "~contents/routes/HomeHandler";
import {BeginnerWorkshopHandler} from "~contents/routes/BeginnerWorkshopHandler";
import {LearningHandler} from "~contents/routes/LearningHandler";
import {QuizzHandler} from "~contents/routes/QuizzHandler";
import type { PlasmoCSConfig } from "plasmo"
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";

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
        const active = await storageService.getActive();

        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        const route = routesHandler.find(handler => handler.routeRegex.test(url));

        if (route === undefined) {
            logMessage("🟡 page unknown")
            return
        }
        if (!active) {
            logMessage("🧠 ready to learn !")
            return
        }
        route.handler()
    }

}

console.log("Bot started")
const bot = new Bot()

bot.loop()