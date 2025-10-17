import {HomeHandler} from "./routesHandlers/HomeHandler";
import {BegginerWorkshopHandler} from "./routesHandlers/BegginerWorkshopHandler";
import {LearningHandler} from "./routesHandlers/LearningHandler";
import {QuizzHandler} from "./routesHandlers/QuizzHandler";
import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
import {logMessage} from "~contents/utils/Logging";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    all_frames: true
}

const storage = new Storage({area: "local"})
const routesHandler: RouteHandlerInterfaces[] = [new HomeHandler(), new BegginerWorkshopHandler(),new LearningHandler(),new QuizzHandler()];

class Bot {

    async loop() {
        try {
            await this.main()
        } catch (e){
            logMessage("🚨 error in bot")
        }

        setTimeout(() => this.loop(), 1000);
    }
    async main() {
        const result = await storage.getMany(['active']);

        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        const route = routesHandler.find(handler => handler.routeRegex.test(url));

        if (route === undefined) {
            logMessage("🟡 page unknown")
            return
        }
        if (!result.active) {
            logMessage("🧠 ready to learn !")
            return
        }
        route.handler()
    }

}

console.log("Bot started")
const bot = new Bot()

bot.loop()