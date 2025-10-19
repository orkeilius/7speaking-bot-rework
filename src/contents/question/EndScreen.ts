import {QuestionInterface} from "~contents/question/QuestionInterface";

export class EndScreen extends QuestionInterface<void> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".result-container button.back") !== null;
    }

    protected getGoodText(): string {
        return "🏁 Quiz ended, returning to home...";
    }
    protected getBadText(): string {
        return "🏁 Quiz ended, returning to home...";
    }


    async getGoodAnswer(): Promise<void> {return}
    async getBadAnswer(): Promise<void> {return}

    async executeAnswer(answer: void): Promise<void> {return}
    async executeSubmit(): Promise<void> {
        document.querySelector<HTMLButtonElement>(".result-container button.back")?.click()
    }

}