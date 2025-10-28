import {logMessage} from "~contents/utils/Logging";

export class HomeHandler implements RouteHandlerInterface{

    readonly routeRegex = /^\/home/;
    isDetected(): boolean {
        return this.routeRegex.test(globalThis.location.pathname);
    }

    async handler() {
        const page = document.querySelector(".scrollableList .scrollableList__content .MuiButtonBase-root")
        if(page == null){
            logMessage("🤔 Lesson not found")
            return
        }
        logMessage("🧠 Starting lesson...")
        page.click()
    }
}


