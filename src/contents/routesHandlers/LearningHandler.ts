import {Selector} from "../utils/SelectorConstant";
import {TimeUtils} from "../utils/TImeUtils";



export class LearningHandler implements RouteHandlerInterfaces {

    readonly routeRegex = /^(?:workshop.*(?:vocabulary|linguistic-content)|document).*$/;

    async handler() {

        const PopupDialog = document.querySelector(Selector.PopUpDialogSelector)
        if (PopupDialog != null) {
            console.log("Pop up found, clicking...")
            PopupDialog.querySelector(Selector.ValidateButtonSelector)?.click()
        }

        const isTimerEnded = await new TimeUtils().isWaitingEnded()
        if(!isTimerEnded){
            return
        }

        const QuizButton = document.querySelector(Selector.VocabularyQuizSelector)
        if (QuizButton != null) {
            console.log("Quiz button found, clicking...")
            QuizButton?.click()
        }
        const QuizTab = document.querySelector(Selector.QuizTabSelector)
        if (QuizTab != null) {
            console.log("Quiz tab found, clicking...")
            QuizTab?.click()
        }

    }

}




