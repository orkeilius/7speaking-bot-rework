import type {QuestionInterface} from "../questionHandlers/QuestionInterface";
import {TextInput} from "../questionHandlers/TextInput";
import {EndScreen} from "~contents/questionHandlers/EndScreen";



export class QuizzHandler implements RouteHandlerInterfaces {

    static readonly listQuestion :QuestionInterface[] = [new TextInput(),new EndScreen()]

    readonly routeRegex = /^quiz/;

    async handler() {
        await QuizzHandler.listQuestion.find(elem => elem.isDetected())?.handler()
    }

}

