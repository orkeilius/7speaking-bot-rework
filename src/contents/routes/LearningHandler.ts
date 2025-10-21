import {Constants} from "../utils/Constants";
import {TimeUtils} from "../utils/TimeUtils";
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";



export class LearningHandler implements RouteHandlerInterface {

    readonly routeRegex = /^(?:workshop.*(?:vocabulary|linguistic-content)|document|professional-survival-kit).*$/;

    async handler() {

        const PopupDialog = document.querySelector(Constants.PopUpDialogSelector)
        if (PopupDialog != null) {
            logMessage("🛑 Pop up found,closing...")
            PopupDialog.querySelector(Constants.ValidateButtonSelector)?.click()
        }

        if(await storageService.getLastQuizCompleted() == document.location.href){
            logMessage("⁉️ lesson already done going back")
            await storageService.setLastQuizCompleted("")
            globalThis.location.replace("https://user.7speaking.com/home");

        }

        const isTimerEnded = await new TimeUtils().isWaitingEnded()
        if(!isTimerEnded){

            return
        }

        const QuizButton = document.querySelector(Constants.VocabularyQuizSelector)
        if (QuizButton != null) {
            logMessage("☝️🤓 quiz time!")
            QuizButton?.click()
        }
        const QuizTab = document.querySelector(Constants.QuizTabSelector)
        if (QuizTab != null) {
            logMessage("☝️🤓 quiz time!")
            QuizTab?.click()
        }

    }

}




