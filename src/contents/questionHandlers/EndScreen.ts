import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";
import {logMessage} from "~contents/utils/Logging";

export class EndScreen implements QuestionInterface {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".result-container button.back") !== null;
    }

    async handler(): Promise<void> {
        logMessage("🏁 Quiz ended, returning to home...");
        document.querySelector<HTMLButtonElement>(".result-container button.back")?.click()
    }
}