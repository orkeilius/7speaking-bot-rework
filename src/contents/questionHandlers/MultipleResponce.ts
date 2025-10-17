import {getReactAnswer} from "~contents/utils/ReactUtils";
import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";
import {Selector} from "~contents/utils/SelectorConstant";
import {logMessage} from "~contents/utils/Logging";

export class MultipleResponce implements QuestionInterface {
     isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container > button") !== null;
    }

    async handler(): Promise<void> {
        const answer = await getReactAnswer();
        logMessage("📝 Multiple Responce");

        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"));
        buttons.find(btn => btn.children.item(0).innerHTML.trim() === answer.trim())?.click();

        const btnContainer = document.querySelector(Selector.QuizValidateSelector);
        btnContainer?.click();
    }
}