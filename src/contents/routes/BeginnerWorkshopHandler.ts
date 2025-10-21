import {Constants} from "../utils/Constants";
import {logMessage} from "~contents/utils/Logging";

export class BeginnerWorkshopHandler implements RouteHandlerInterface {

    readonly routeRegex = /^workshop.*beginners-workshop/;

    async handler() {
        const nextButton = document.querySelector<HTMLElement>(Constants.NextButtonSelector);
        console.log("next : ", nextButton)
        if (nextButton != null) {
            logMessage("➡️ Next button found, clicking...")
            nextButton.click()
            return
        }

        const validateButton = document.querySelector<HTMLElement>(Constants.ValidateButtonSelector);
        if(validateButton != null) {
            if (validateButton.hasAttribute("disabled")) {
                this.fillQuiz()
            }
            logMessage("✅ Validate button found, clicking...")
            validateButton.click()

            return

        }

        const backButton = document.querySelector<HTMLElement>(Constants.BackButtonSelector);
        if(backButton != null) {
            logMessage("⬅️ Back button found, clicking...")
            backButton.click()
        }

    }

    fillQuiz(){
        console.log("Handling beginner quiz...")
        const quiz = document.querySelector(".beginners_topic__content > .MuiCardContent-root")
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




