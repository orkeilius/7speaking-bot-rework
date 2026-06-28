import {realistInput} from "~contents/utils/InputUtils";
import {QuestionInterface} from "~contents/question/QuestionInterface";
import GetAnswer from "~contents/mainWorldClient/mainWorldFunction/GetAnswer";

export class TextInput extends QuestionInterface<string> {
      isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".question__form input[type=text]") !== null;
    }

    protected getGoodText(): string {
       return "🖊️ Writting"
    }
    protected getBadText(): string {
          return "🖊️ Scribbling"
    }

    async getGoodAnswer(): Promise<string> {
        return await new GetAnswer().callFunction();
    }

    async getBadAnswer(): Promise<string> {
        const goodAnswer = await this.getGoodAnswer()
        const randomized = goodAnswer.toLowerCase().split('').sort(() => 0.5 - Math.random()).join('');
        return randomized.charAt(0).toUpperCase() + randomized.slice(1)
    }

    async executeAnswer(answer: string): Promise<void> {
        const input = document.querySelector<HTMLInputElement>(".question__form input[type=text]");
        await realistInput(input, answer);
    }
}