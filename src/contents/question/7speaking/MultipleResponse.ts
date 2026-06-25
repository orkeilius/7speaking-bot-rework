import {QuestionInterface} from "~contents/question/QuestionInterface";
import GetAnswer from "~contents/mainWorldClient/mainWorldFunction/GetAnswer";

export class MultipleResponse extends QuestionInterface<string> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container > button") !== null;
    }

    protected getGoodText(): string {
       return "📝 Clicking button"
    }
    protected getBadText(): string {
            return "📝 Tapping on the screen"
    }

    async getGoodAnswer(): Promise<string> {
        return await new GetAnswer().callFunction();
    }

    async getBadAnswer(): Promise<string> {
        const answer = await this.getGoodAnswer();
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"))
        const randomIndex = Math.floor(Math.random() * (buttons.length - 1));
        return buttons.map(btn => btn.children.item(0).innerHTML.trim())
            .filter(text => text !== answer.trim())[randomIndex];
    }

    async executeAnswer(answer: string): Promise<void> {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"));
        buttons.find(btn => btn.children.item(0).innerHTML.trim() === answer.trim())?.click();
    }
}