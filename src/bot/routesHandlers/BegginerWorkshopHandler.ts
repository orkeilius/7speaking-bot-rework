import {BeginnerQuiz} from "../quizHandler/BeginnerQuiz";

const NextButtonSelector = 'button.next__btn'
const ValidateButtonSelector = 'button.validate__btn'
const BackButtonSelector = 'button.back__btn'

export class BegginerWorkshopHandler implements RouteHandlerInterfaces {

    readonly routeRegex = /^workshop.*beginners-workshop/;

    async handler() {
        const nextButton = document.querySelector(NextButtonSelector);
        console.log("next : ", nextButton)
        if (nextButton != null) {
            console.log("Next button found, clicking...")
            nextButton.click()
            return
        }

        const validateButton = document.querySelector(ValidateButtonSelector);
        if(validateButton != null) {
            if (validateButton?.hasAttribute("disabled") != null) {
                new BeginnerQuiz().handle()
            }
            console.log("Validate button found, clicking...")
            validateButton.click()

            return

        }

        const backButton = document.querySelector(BackButtonSelector);
        if(backButton != null) {
            console.log("Back button found, clicking...")
            backButton.click()
        }

    }

}




