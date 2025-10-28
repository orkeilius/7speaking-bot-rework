import {QuestionInterface} from "~contents/question/QuestionInterface";
import {storageService} from "~contents/services/StorageService";

export class EndScreen extends QuestionInterface<void> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".result-container button.back") !== null;
    }

    protected getGoodText(): string {
        return "🏁 Quiz ended, returning to home...";
    }
    protected getBadText(): string {
        return "🏁 Quiz ended, returning to home...";
    }


    async getGoodAnswer(): Promise<void> {
        // Not a quizz
    }
    async getBadAnswer(): Promise<void> {
        // Not a quizz
    }
    async executeAnswer(answer: void): Promise<void> {
        // Not a quizz
    }

    async executeSubmit(): Promise<void> {
        document.querySelector<HTMLButtonElement>(".result-container button.back")?.click()
        await storageService.addStatQuizDone()
        await storageService.setLastQuizCompleted(await storageService.getTimerUrl())
    }

}