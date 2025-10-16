import {HomeHandler} from "./routesHandlers/HomeHandler";

const routesHandler: RouteHandlerInterfaces[] = [new HomeHandler()]

class Bot {

    async loop() {
        const url = globalThis.location.href.replace("https://user.7speaking.com/", "");
        routesHandler.find(handler => handler.routeRegex.test(url))?.handler()
        //console.log(routesHandler[0].routeRegex.test(url))
    }

}

console.log("Bot started")
const bot = new Bot()
setInterval(bot.loop, 1000)