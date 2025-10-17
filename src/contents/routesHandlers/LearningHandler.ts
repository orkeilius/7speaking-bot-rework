import {Selector} from "../utils/SelectorConstant";
import {TimeUtils} from "../utils/TImeUtils";



export class LearningHandler implements RouteHandlerInterfaces {

    readonly routeRegex = /^workshop.*vocabulary/;

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
        console.log(document.querySelectorAll(Selector.VocabularyQuizSelector))
        if (QuizButton != null) {
            console.log("Quiz button found, clicking...")
            QuizButton?.click()
        }

    }

}




