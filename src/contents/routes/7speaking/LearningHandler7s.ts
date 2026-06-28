import {Constants} from "../../utils/Constants";
import {TimerType, timeService} from "~contents/services/TimerService";
import {logMessage} from "~contents/utils/Logging";
import {StorageKeys, storageService} from "~contents/services/StorageService";
import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface"


export class LearningHandler7s implements RouteHandlerInterface {

    isDetected(): boolean {
        return this.getQuizButton() != null
    }

    async handler() {
        await storageService.set(StorageKeys.LAST_LESSON_WAITED,document.location.href)
        const PopupDialog = document.querySelector(Constants.PopUpDialogSelector)
        if (PopupDialog != null) {
            logMessage("🛑 Pop up found,closing...")
            PopupDialog.querySelector<HTMLElement>(Constants.ValidateButtonSelector)?.click()
        }

        if(await storageService.get<string>(StorageKeys.LAST_QUIZ_COMPLETED) == document.location.href){
            logMessage("⁉️ lesson already done going back")
            globalThis.location.replace("https://user.7speaking.com/home");
            return
        }

        if(!await timeService.isWaitingEnded(TimerType.QUIZ)){
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




