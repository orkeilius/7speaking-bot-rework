import {QuestionInterface} from "~contents/question/QuestionInterface";
import {StorageKeys, storageService} from "~contents/services/StorageService";


export class AdaptativeQuizPmf extends QuestionInterface<number> {
    isDetected(): boolean {

        const containQuiz = document.querySelector(
            "span.answer-label.qru span.rep-checkbox.radio"
        ) !== null

        const adaptativeResponse = document.querySelector("#explanations_box")
        const isAdaptiveQuiz = adaptativeResponse !== null
        const isResultPage = adaptativeResponse?.checkVisibility()

        return containQuiz && isAdaptiveQuiz && !isResultPage
    }

    protected getGoodText(): string {
        return "📝 Clicking button"
    }

    protected getBadText(): string {
        return "📝 Tapping on the screen"
    }

    async getGoodAnswer(): Promise<number> {
        const responseContainer = document.querySelector("[id^=container_solution_]")
        if (!responseContainer) {
            throw new Error("Could not find solution container for adaptive question")
        }

        const answers = responseContainer.querySelectorAll(".question .answer")
        const correctEntry = [...answers.entries()]
            .find(([_, answers]) => answers.className.includes("right"))

        if (!correctEntry) {
            throw new Error("Could not find correct answer in adaptive question solution")
        }

        return correctEntry[0] // return index
    }

    async getBadAnswer(): Promise<number> {
        const nbAnwser =
            this.getTargetedQuestion().querySelectorAll(".radio").length
        const goodAnswer = await this.getGoodAnswer()

        return [...new Array(nbAnwser - 1).keys()].filter((x) => x !== goodAnswer)[
            Math.floor(Math.random() * (nbAnwser - 2))
            ]
    }

    async executeAnswer(answer: number): Promise<void> {
        const target = this.getTargetedQuestion()
        if (target == null) {
            throw new Error("Could not find active question target to execute answer")
        }

        target
            .querySelector<HTMLButtonElement>(`[for$=-answer-${answer + 1}] .radio`)
            .click()
    }

    async executeSubmit(): Promise<void> {
        const isEveryQuestionIsAnwsered = this.getTargetedQuestion() == null
        if (!isEveryQuestionIsAnwsered) {
            return
        }

        await storageService.update(StorageKeys.STAT_QUIZ_DONE)
        document.querySelector<HTMLButtonElement>(
            "input[type='submit']"
        ).click()
    }

    private getTargetedQuestion() {
        const target = document
            .querySelectorAll("[id^=content_question_]")
            .values()
            .find((x) => x.querySelector(".checked") == null)
        if (!target) {
            return null
        }
        return target
    }
}
