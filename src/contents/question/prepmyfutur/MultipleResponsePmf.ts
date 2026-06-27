import { QuestionInterface } from "~contents/question/QuestionInterface";
import { prepmyfuturAnwserService, type Answer } from "~contents/services/PrepmyfuturAnwserService";





export class MultipleResponsePmf extends QuestionInterface<string> {
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

  async getGoodAnswer(): Promise<string> {
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
    const buttons = Array.from(
      target.querySelectorAll<HTMLButtonElement>("span.answer-label")
    )

    const proposedAnswers = buttons.map((btn) => {
      const answerText = btn
        .querySelectorAll("span")
        .values()
        .filter((x) => !x.classList.contains("script"))
        .map((x) => x.textContent)
        .toArray()

      if (answerText.length != 2) {
        console.error(answerText)
        throw new Error("Error while parsing answer")
      }

      return { label: answerText[0], text: answerText[1] } as Answer
    })

    console.log(proposedAnswers)

    const goodAnswer = await prepmyfuturAnwserService.getAnwsers(
      proposedAnswers,
      activityId
    )
    if (!goodAnswer) {
      throw new Error("Could not find matching correct answer from solutions")
    }
    return goodAnswer
  }

  async getBadAnswer(): Promise<string> {
    const answer = await this.getGoodAnswer()
    return answer
  }

  async executeAnswer(answer: string): Promise<void> {
    document
      .querySelectorAll<HTMLButtonElement>("span.answer-label")
      .values()
      .find((x) => x.textContent.includes(answer))
      .click()
    //const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".answer-container > button"));
    //buttons.find(btn => btn.children.item(0).innerHTML.trim() === answer.trim())?.click();
  }
}
