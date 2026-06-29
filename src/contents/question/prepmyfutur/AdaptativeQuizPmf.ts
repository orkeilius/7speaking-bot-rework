import {MultipleResponsePmf} from "~contents/question/prepmyfutur/MultipleResponsePmf";


export class AdaptativeQuizPmf extends MultipleResponsePmf {
    isDetected(): boolean {

        const containQuiz = document.querySelector(
            "span.answer-label.qru span.rep-checkbox.radio"
        ) !== null

        const adaptativeResponse = document.querySelector("#explanations_box")
        const isAdaptiveQuiz = adaptativeResponse !== null
        const isResultPage = adaptativeResponse?.checkVisibility()

        return containQuiz && isAdaptiveQuiz && !isResultPage
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
}
