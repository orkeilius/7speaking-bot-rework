import {BeginnerQuiz} from "../quizHandler/BeginnerQuiz";
import {Selector} from "../utils/SelectorConstant";
import {logMessage} from "~contents/utils/Logging";

export class BegginerWorkshopHandler implements RouteHandlerInterfaces {

    readonly routeRegex = /^workshop.*beginners-workshop/;

    async handler() {
        const nextButton = document.querySelector<HTMLElement>(Selector.NextButtonSelector);
        console.log("next : ", nextButton)
        if (nextButton != null) {
            logMessage("➡️ Next button found, clicking...")
            nextButton.click()
            return
        }

        const validateButton = document.querySelector<HTMLElement>(Selector.ValidateButtonSelector);
        if(validateButton != null) {
            if (validateButton?.hasAttribute("disabled") != null) {
                new BeginnerQuiz().handle()
            }
            logMessage("✅ Validate button found, clicking...")
            validateButton.click()

            return

        }

        const backButton = document.querySelector<HTMLElement>(Selector.BackButtonSelector);
        if(backButton != null) {
            logMessage("⬅️ Back button found, clicking...")
            backButton.click()
        }

    }

}




