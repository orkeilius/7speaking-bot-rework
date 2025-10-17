import {getReactAnswer} from "~contents/utils/ReactUtils";
import {realistInput} from "~contents/utils/textInput";
import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";
import {Selector} from "~contents/utils/SelectorConstant";

export class TextInput implements QuestionInterface {
     isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".question__form input[type=text]") !== null;
    }

    async handler(): Promise<void> {
        const answer = await getReactAnswer();
        console.log("answer:", answer);
        const input = document.querySelector<HTMLInputElement>(".question__form input[type=text]");
        await realistInput(input, answer);

        const btnContainer = document.querySelector(Selector.QuizValidateSelector);
        btnContainer?.click();
    }
}