import {QuestionInterface} from "~contents/question/QuestionInterface";

export class ToeicInterstitial extends QuestionInterface<void> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".ExamsAndTests__container div.questions_variantsContainer > div:empty") !== null;
    }

    protected getGoodText(): string {
       return "📕 reading..."
    }
    protected getBadText(): string {
        return this.getGoodText()
    }

    async getGoodAnswer(): Promise<void> {
        // Not a quizz
    }

    async getBadAnswer(): Promise<void> {
        // Not a quizz
    }

    async executeAnswer(answer: void): Promise<void> {
        // Not a quizz
    }

    async executeSubmit(): Promise<void> {
       const submitButton = document.querySelector<HTMLInputElement>("div.buttons_container button[class*='MuiButton-containedPrimary']");
       submitButton?.click();
    }
}