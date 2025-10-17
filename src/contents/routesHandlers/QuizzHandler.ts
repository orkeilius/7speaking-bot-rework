import type {QuestionInterface} from "../questionHandlers/QuestionInterface";
import {TextInput} from "../questionHandlers/TextInput";
import {EndScreen} from "~contents/questionHandlers/EndScreen";
import {MultipleResponce} from "~contents/questionHandlers/MultipleResponce";
import {DragAndDrop} from "~contents/questionHandlers/DragAndDrop";


export class QuizzHandler implements RouteHandlerInterfaces {

    static readonly listQuestion: QuestionInterface[] = [new TextInput(), new MultipleResponce(), new DragAndDrop(),new EndScreen()]

    readonly routeRegex = /^quiz/;

    async handler() {
        await QuizzHandler.listQuestion.find(elem => elem.isDetected())?.handler()
    }

}

