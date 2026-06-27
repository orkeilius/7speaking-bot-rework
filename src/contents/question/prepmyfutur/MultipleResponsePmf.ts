import { QuestionInterface } from "~contents/question/QuestionInterface";
import { prepmyfuturAnwserService } from "~contents/services/PrepmyfuturAnwserService";
import { Constants } from "~contents/utils/Constants";
import { waitForSelector } from "~contents/utils/InputUtils";





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

    const goodAnswer = await prepmyfuturAnwserService.getAnwsers(
      questionId,
      activityId
    )
    return goodAnswer
  }

  async getBadAnswer(): Promise<number> {
    const answer = await this.getGoodAnswer()
    //TODO : implement bad answer
    return answer
  }

  async executeAnswer(answer: number): Promise<void> {
    const questions = document.querySelectorAll("[id^=content_question_]")
    const target = questions
      .values()
      .find((x) => x.querySelector(".checked") == null)
    if (!target) {
      throw new Error("Could not find active question target to execute answer")
    }

    const button =
      target.querySelectorAll<HTMLButtonElement>("span.answer-label")

    if (button) {
      button[answer].click()
    } else {
      console.error(`Could not find answer button containing: ${answer}`)
    }
  }

  async executeSubmit(): Promise<void> {

    const questions = document.querySelectorAll("[id^=content_question_]")

    const isEveryQuestionIsAnwsered = questions
      .values()
      .every((x) => x.querySelector(".checked") != null)
    if (!isEveryQuestionIsAnwsered) {
      return;
    }

    const submitButton = document.querySelector<HTMLButtonElement>("input[type='submit']")
    submitButton.click()
  }
}
