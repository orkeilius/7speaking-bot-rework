import {mainWorldHostService} from "~contents/services/MainWorldHostService";
import {logMessage} from "~contents/utils/Logging";
import {QuestionInterface} from "~contents/question/QuestionInterface";

export class MultipleResponse extends QuestionInterface<string> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container > button") !== null;
    }

    async getGoodAnswer(): Promise<string> {
        logMessage("📝 Multiple Responce");
        return await mainWorldHostService.getReactAnswer();
    }

    async executeAnswer(answer: string): Promise<void> {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"));
        buttons.find(btn => btn.children.item(0).innerHTML.trim() === answer.trim())?.click();
    }
}