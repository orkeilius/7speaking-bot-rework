
const quizSelector = ".beginners_topic__content > .MuiCardContent-root"

export class BeginnerQuiz{
    handle(){
        console.log("Handling beginner quiz...")
        const quiz = document.querySelector(quizSelector)
        if(quiz == null){
            console.warn("Quiz not found")
            return
        }

        let question = quiz.querySelectorAll(".beginners_lesson__element7Question")
        console.log(question)
        question.forEach(this.clickAny)
    }

    clickAny(e: Element){
        // Responce doesn't count on this type of test
        e.querySelector('input')?.click()
    }
}