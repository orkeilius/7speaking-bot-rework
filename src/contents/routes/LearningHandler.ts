import {Selector} from "../utils/SelectorConstant";
import {TimeUtils} from "../utils/TimeUtils";
import {logMessage} from "~contents/utils/Logging";



export class LearningHandler implements RouteHandlerInterface {

    readonly routeRegex = /^(?:workshop.*(?:vocabulary|linguistic-content)|document|professional-survival-kit).*$/;

    async handler() {

        const PopupDialog = document.querySelector(Selector.PopUpDialogSelector)
        if (PopupDialog != null) {
            logMessage("🛑 Pop up found,closing...")
            PopupDialog.querySelector(Selector.ValidateButtonSelector)?.click()
        }

        const isTimerEnded = await new TimeUtils().isWaitingEnded()
        if(!isTimerEnded){

            return
        }

        const QuizButton = document.querySelector(Selector.VocabularyQuizSelector)
        if (QuizButton != null) {
            logMessage("☝️🤓 quiz time!")
            QuizButton?.click()
        }
        const QuizTab = document.querySelector(Selector.QuizTabSelector)
        if (QuizTab != null) {
            logMessage("☝️🤓 quiz time!")
            QuizTab?.click()
        }

    }

}




