import {QuestionInterface} from "~contents/question/QuestionInterface";
import GetAnswerToeic from "~contents/mainWorldClient/mainWorldFunction/GetAnswerToeic";

export class ToeicMultipleResponse extends QuestionInterface<string> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".ExamsAndTests__container .questions_variantsContainer input[type=radio]") !== null;
    }

    protected getGoodText(): string {
        return "📝 Clicking button"
    }

    protected getBadText(): string {
        return "📝 Tapping on the screen"
    }

    async getGoodAnswer(): Promise<string> {
        let errorResponse = await new GetAnswerToeic().callFunction();
        return errorResponse.split(" ").at(-1).trim()
    }

    async getBadAnswer(): Promise<string> {
        const answer = await this.getGoodAnswer();
        const buttons = this.getButtons();
        return buttons.filter(btn => !btn.label.includes(answer))
            [Math.floor(Math.random() * (buttons.length - 1))].label;
    }

    async executeAnswer(answer: string): Promise<void> {
        const buttons = this.getButtons()
        buttons.find(btn => btn.label.includes(answer))?.input.click();
    }

    async executeSubmit(): Promise<void> {
        const submitButton = document.querySelector<HTMLInputElement>("div.buttons_container button[class*='MuiButton-containedPrimary']");
        submitButton?.click();
        //small delay to allow react to re-render
        await new Promise(r => setTimeout(r, 500));

        const btnNext: HTMLElement = document.querySelector("div.buttons_container button[class*='MuiButton-containedPrimary']");
        btnNext?.click();

    }

    getButtons(): { label: string, input: HTMLElement }[] {
        return Array.from(document.querySelectorAll<HTMLElement>("div.choice_variant input[type=radio]")).map(
            (input) => {
                let label = input.closest("label.MuiFormControlLabel-root").querySelector(".MuiFormControlLabel-label").innerHTML
                return {label: label, input: input}
            }
        );
    }
}