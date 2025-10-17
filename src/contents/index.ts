import {HomeHandler} from "./routesHandlers/HomeHandler";
import {BegginerWorkshopHandler} from "./routesHandlers/BegginerWorkshopHandler";
import {LearningHandler} from "./routesHandlers/LearningHandler";
import {QuizzHandler} from "./routesHandlers/QuizzHandler";
import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    all_frames: true
}

const routesHandler: RouteHandlerInterfaces[] = [new HomeHandler(), new BegginerWorkshopHandler(),new LearningHandler()];
const storage = new Storage()

class Bot {

    async loop() {
        const result = await storage.getMany(['active']);
        if (!result.active) {
            console.log("Bot inactive")
            return
        }

        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        routesHandler.find(handler => handler.routeRegex.test(url))?.handler()
        console.log(routesHandler[1].routeRegex.test(url))
    }

}

console.log("Bot started")
const bot = new Bot()
setInterval(bot.loop, 1000)