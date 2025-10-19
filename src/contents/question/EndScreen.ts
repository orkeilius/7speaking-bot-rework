import {logMessage} from "~contents/utils/Logging";
import {QuestionInterface} from "~contents/question/QuestionInterface";

export class EndScreen extends QuestionInterface<void> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".result-container button.back") !== null;
    }

    async getGoodAnswer(): Promise<void> {return}
    async getBadAnswer(): Promise<void> {return}

    async executeAnswer(answer: void): Promise<void> {
        logMessage("🏁 Quiz ended, returning to home...");
    }
    async executeSubmit(): Promise<void> {
        document.querySelector<HTMLButtonElement>(".result-container button.back")?.click()
    }

}