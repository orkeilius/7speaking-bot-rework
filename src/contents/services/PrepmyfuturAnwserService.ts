import { Storage } from "@plasmohq/storage";





const StoragePrefix = "pmf-responce-cache-"
const ResponseUrl =
  "https://prepmyfuture.com/platform/exercises/load_user_exercise_solutions?"

class PrepmyfuturAnwserService {
  private readonly storage: Storage

  constructor() {
    this.storage = new Storage({ area: "local" })
  }

  public async getAnwsers(
    proposedAnwser: Answer[],
    activityId: number
  ): Promise<string | null> {
    const cacheKey = StoragePrefix + activityId
    let responsePage = await this.storage.get(cacheKey) as ResponsePage
    if (!responsePage) {
      await this.queryAnwsers(activityId)
      responsePage = await this.storage.get(cacheKey) as ResponsePage
    }

    return this.findAnwsersInResponcePage(responsePage, proposedAnwser)
  }

  public findAnwsersInResponcePage(
    responsePage: ResponsePage | undefined,
    proposedAnwser: Answer[]
  ): string | null {
    if (!responsePage?.questions) {
      return null
    }

    const matchingQuestion = responsePage.questions.find((question) => {
      if (question.answer.length !== proposedAnwser.length) {
        return false
      }
      return proposedAnwser.every((proposed) =>
        question.answer.some(
          (actual) => actual.text.trim().toLowerCase() === proposed.text.trim().toLowerCase()
        )
      )
    })

    return matchingQuestion?.correct ?? null
  }

  public async queryAnwsers(activityId: number): Promise<void> {
    const response = await fetch(ResponseUrl + "user_exercise_id=" + activityId, { credentials: "include" })
    if (!response.ok) {
      throw new Error(`Failed to fetch solutions for exercise ${activityId}`)
    }

    const doc = new DOMParser().parseFromString(await response.text(), 'text/html')

    const questions: ResponsePage["questions"] = []
    const containers = doc.querySelectorAll('[id^="container_solution_"]')

    containers.forEach((container) => {
      const answerEls = container.querySelectorAll('.question .answer')

      let correctText = ""
      const answers: Answer[] = []

      answerEls.forEach((answerEl) => {
        const textElem = answerEl.querySelector('.answer-text')
        const labelElem = answerEl.querySelector('.rep-checkbox.radio')

        let text = ""
        if (textElem) {
          const scriptEl = textElem.querySelector('.script')
          text = (scriptEl ? scriptEl.textContent : textElem.textContent)?.trim() || ""
        }

        if (!text) return

        const label = labelElem?.textContent?.trim() || ""

        answers.push({ text, label })

        if (answerEl.classList.contains("right")) {
          correctText = text
        }
      })

      questions.push({
        correct: correctText,
        answer: answers
      })
    })

    const responsePage: ResponsePage = {
      id: activityId,
      questions
    }

    const cacheKey = StoragePrefix + activityId
    console.log(responsePage)
    await this.storage.set(cacheKey, responsePage)
  }
}

type ResponsePage = {
  id: number
  questions: {
    correct: string
    answer: Answer[]
  }[]
}

export type Answer = {
  text: string
  label?: string
}

export const prepmyfuturAnwserService = new PrepmyfuturAnwserService()
