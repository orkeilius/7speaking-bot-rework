import type {QuestionInterface} from "~contents/question/QuestionInterface";
import {TextInput} from "~contents/question/TextInput";
import {EndScreen} from "~contents/question/EndScreen";
import {MultipleResponce} from "~contents/question/MultipleResponce";
import {DragAndDrop} from "~contents/question/DragAndDrop";


export class QuizzHandler implements RouteHandlerInterfaces {

    static readonly listQuestion: QuestionInterface[] = [new TextInput(), new MultipleResponce(), new DragAndDrop(),new EndScreen()]

    readonly routeRegex = /^quiz/;

    async handler() {
        const handler = QuizzHandler.listQuestion.find(elem => elem.isDetected())
        if(handler == undefined){
            console.log("❓ Question type not found")
            return
        }
        await handler.handler()
    }

}

