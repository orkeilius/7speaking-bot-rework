import {getReactAnswer} from "~contents/utils/ReactUtils";
import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";
import {Selector} from "~contents/utils/SelectorConstant";

export class MultipleResponce implements QuestionInterface {
     isDetected(): boolean {
        console.log("salut");
        return document.querySelector<HTMLInputElement>(".answer-container > button") !== null;
    }

    async handler(): Promise<void> {
        const answer = await getReactAnswer();
        console.log("answer:", answer);

        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"));
        buttons.find(btn => btn.children.item(0).innerHTML.trim() === answer.trim())?.click();

        const btnContainer = document.querySelector(Selector.QuizValidateSelector);
        btnContainer?.click();
    }
}