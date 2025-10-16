import {HomeHandler} from "./routesHandlers/HomeHandler";
import {BegginerWorkshopHandler} from "./routesHandlers/BegginerWorkshopHandler";
import browser from "webextension-polyfill";
import {LearningHandler} from "./routesHandlers/LearningHandler";

const routesHandler: RouteHandlerInterfaces[] = [new HomeHandler(), new BegginerWorkshopHandler(),new LearningHandler()];

class Bot {

    async loop() {
        const result = await browser.storage.sync.get(['active']);
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