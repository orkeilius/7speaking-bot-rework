import { QuestionInterface } from "~contents/question/QuestionInterface";
import { prepmyfuturAnwserService } from "~contents/services/PrepmyfuturAnwserService";





export class MultipleResponsePmf extends QuestionInterface<number> {
  isDetected(): boolean {
    return (
      document.querySelector<HTMLInputElement>(
        "span.answer-label.qru span.rep-checkbox.radio"
      ) !== null
    )
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

    const questions = document.querySelectorAll("[id^=content_question_]")

    console.debug(questions)
    const target = questions
      .values()
      .find((x) => x.querySelector(".checked") == null)

    if (!target) {
      throw new Error("Could not find active question target")
    }

    const questionId = target.id.replace("content_question_", "")

    return await prepmyfuturAnwserService.getAnwsers(questionId, activityId)
  }

  async getBadAnswer(): Promise<number> {
    //TODO : implement bad answer
    return await this.getGoodAnswer()
  }

  async executeAnswer(answer: number): Promise<void> {
    const questions = document.querySelectorAll("[id^=content_question_]")
    const target = questions
      .values()
      .find((x) => x.querySelector(".checked") == null)
    if (!target) {
      throw new Error("Could not find active question target to execute answer")
    }

    target
      .querySelector<HTMLButtonElement>(`[for$=-answer-${answer + 1}] .radio`)
      .click()
  }

  async executeSubmit(): Promise<void> {
    const questions = document.querySelectorAll("[id^=content_question_]")

    const isEveryQuestionIsAnwsered = questions
      .values()
      .every((x) => x.querySelector(".checked") != null)
    if (!isEveryQuestionIsAnwsered) {
      return
    }

    const submitButton = document.querySelector<HTMLButtonElement>(
      "input[type='submit']"
    )
    submitButton.click()
  }
}
