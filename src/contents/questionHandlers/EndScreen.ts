import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";

export class EndScreen implements QuestionInterface {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".result-container button.back") !== null;
    }

    async handler(): Promise<void> {
        console.log("EndScreen handler");
        document.querySelector<HTMLButtonElement>(".result-container button.back")?.click()
    }
}