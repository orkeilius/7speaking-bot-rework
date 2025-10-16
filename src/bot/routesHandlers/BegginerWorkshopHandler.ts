import {BeginnerQuiz} from "../quizHandler/BeginnerQuiz";
import {Selector} from "../utils/SelectorConstant";

export class BegginerWorkshopHandler implements RouteHandlerInterfaces {

    readonly routeRegex = /^workshop.*beginners-workshop/;

    async handler() {
        const nextButton = document.querySelector(Selector.NextButtonSelector);
        console.log("next : ", nextButton)
        if (nextButton != null) {
            console.log("Next button found, clicking...")
            nextButton.click()
            return
        }

        const validateButton = document.querySelector(Selector.ValidateButtonSelector);
        if(validateButton != null) {
            if (validateButton?.hasAttribute("disabled") != null) {
                new BeginnerQuiz().handle()
            }
            console.log("Validate button found, clicking...")
            validateButton.click()

            return

        }

        const backButton = document.querySelector(Selector.BackButtonSelector);
        if(backButton != null) {
            console.log("Back button found, clicking...")
            backButton.click()
        }

    }

}




