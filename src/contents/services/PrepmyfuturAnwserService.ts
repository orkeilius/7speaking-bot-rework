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
    questionId: string,
    activityId: number
  ): Promise<number> {

    const cacheKey = StoragePrefix + activityId
    let responsePage = (await this.storage.get(cacheKey)) as ResponsePage
    if (!responsePage || responsePage.questions.some((q) => !q.id)) {
      await this.queryAnwsers(activityId)
      responsePage = (await this.storage.get(cacheKey)) as ResponsePage
    }

    console.log(responsePage)

    return this.findAnwsersInResponcePage(responsePage, questionId)
  }

  public findAnwsersInResponcePage(
    responsePage: ResponsePage | undefined,
    questionId: string
  ): number {

    const matchingQuestion = responsePage.questions.find(
      (question) => question.id === questionId
    )
    if (!matchingQuestion) {
      console.error(questionId,responsePage)
      throw new Error("Match question id not found")
    }
    console.log("found")
    return matchingQuestion?.correct
  }

  public async queryAnwsers(activityId: number): Promise<void> {
    const response = await fetch(
      ResponseUrl + "user_exercise_id=" + activityId,
      { credentials: "include" }
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch solutions for exercise ${activityId}`)
    }

    const doc = new DOMParser().parseFromString(
      await response.text(),
      "text/html"
    )

    const questions: ResponsePage["questions"] = []
    const containers = doc.querySelectorAll('[id^="container_solution_"]')

    containers.forEach((container) => {
      const id = container.id.replace("container_solution_", "")
      const correctIndex: number = container
        .querySelectorAll(".question .answer")
        .entries()
        .find(x => x[1].className.includes("right"))[0]

      questions.push({
        id,
        correct: correctIndex
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
    id: string
    correct: number
  }[]
}
export const prepmyfuturAnwserService = new PrepmyfuturAnwserService()
