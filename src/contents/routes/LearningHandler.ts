import {Constants} from "../utils/Constants";
import {TimeUtils} from "../utils/TimeUtils";
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";



export class LearningHandler implements RouteHandlerInterface {

    isDetected(): boolean {
        return this.getQuizButton() != null
    }

    async handler() {

        const PopupDialog = document.querySelector(Constants.PopUpDialogSelector)
        if (PopupDialog != null) {
            logMessage("🛑 Pop up found,closing...")
            PopupDialog.querySelector<HTMLElement>(Constants.ValidateButtonSelector)?.click()
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

        const quiz = this.getQuizButton()
        if (quiz != null) {
            logMessage("☝️🤓 quiz time!")
            quiz.click()
        }
    }

    getQuizButton(): HTMLElement | null {
        const quiz = [
            document.querySelector<HTMLElement>(Constants.VocabularyQuizSheetSelector),
            document.querySelector<HTMLElement>(Constants.QuizTabSelector),
            document.querySelector<HTMLElement>(Constants.VocabularyQuizSelector)
        ]
        return quiz.find(e=> e!=null) ?? null
    }

}




