import {logMessage} from "~contents/utils/Logging";
import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface"

export class HomeHandler implements RouteHandlerInterface{

    readonly routeRegex = /^\/home/;
    isDetected(): boolean {
        return this.routeRegex.test(globalThis.location.pathname);
    }

    async handler() {
        const page = document.querySelector<HTMLElement>(".learningSection__scrollableList .learningSection__scrollableList__content .MuiButtonBase-root")
        if(page == null){
            logMessage("🤔 Lesson not found")
            return
        }
        logMessage("🧠 Starting lesson...")
        page.click()
    }
}


