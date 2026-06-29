import {QuestionInterface} from "~contents/question/QuestionInterface";
import {prepmyfuturAnwserService} from "~contents/services/PrepmyfuturAnwserService";
import {StorageKeys, storageService} from "~contents/services/StorageService";


export class MultipleResponsePmf extends QuestionInterface<number> {
    isDetected(): boolean {

        const containQuiz = document.querySelector(
            "span.answer-label.qru span.rep-checkbox.radio"
        ) !== null

        const isAdaptiveQuizz = document.querySelector("#explanations_box") !== null

        return  containQuiz && !isAdaptiveQuizz
    }

    protected getGoodText(): string {
        return "📝 Clicking button"
    }

    protected getBadText(): string {
        return "📝 Tapping on the screen"
    }

    async getGoodAnswer(): Promise<number> {
        const params = new URLSearchParams(globalThis.location.search)
        const exerciseId = params.get("user_exercise_id") ?? params.get("id")
        if (!exerciseId) {
            throw new Error("Could not find exercise ID in URL")
        }
        const activityId = Number.parseInt(exerciseId, 10)

        const target = this.getTargetedQuestion()

        if (target == null) {
            throw new Error("Could not find active question target")
        }

        const questionId = target.id.replace("content_question_", "")

        return await prepmyfuturAnwserService.getAnwsers(questionId, activityId)
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
