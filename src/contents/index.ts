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

const storage = new Storage()
const routesHandler: RouteHandlerInterfaces[] = [new HomeHandler(), new BegginerWorkshopHandler(),new LearningHandler(),new QuizzHandler()];

class Bot {

    async loop() {
        try {
            await this.main()
        } catch (e){
            console.error("Error in bot loop",e)
        }

        setTimeout(() => this.loop(), 1000);
    }
    async main() {
        const result = await storage.getMany(['active']);
        if (!result.active) {
            console.log("Bot inactive")
            return
        }

        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        routesHandler.find(handler => handler.routeRegex.test(url))?.handler()
        console.log(routesHandler[3].routeRegex.test(url))
    }

}

console.log("Bot started")
const bot = new Bot()

bot.loop()