import {mainWorldHostService} from "~contents/services/MainWorldHostService";
import {realistInput} from "~contents/utils/InputUtils";
import {QuestionInterface} from "~contents/question/QuestionInterface";

export class TextInput extends QuestionInterface<string> {
      isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".question__form input[type=text]") !== null;
    }

    async getGoodAnswer(): Promise<string> {
        return await mainWorldHostService.getReactAnswer();
    }

    async executeAnswer(answer: string): Promise<void> {
        const input = document.querySelector<HTMLInputElement>(".question__form input[type=text]");
        await realistInput(input, answer);
    }
}