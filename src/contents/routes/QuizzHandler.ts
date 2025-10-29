import type {QuestionInterface} from "~contents/question/QuestionInterface";
import {TextInput} from "~contents/question/TextInput";
import {EndScreen} from "~contents/question/EndScreen";
import {MultipleResponse} from "~contents/question/MultipleResponse";
import {DragAndDrop} from "~contents/question/DragAndDrop";
import {ToeicMultipleResponse} from "~contents/question/ToeicMultipleResponse";
import {ToeicInterstitial} from "~contents/question/ToeicInterstitial";
import {TimerType, timeService} from "~contents/services/TimerService";


export class QuizzHandler implements RouteHandlerInterface {

    static readonly listQuestion: QuestionInterface<any>[] = [
        new TextInput(),
        new MultipleResponse(),
        new DragAndDrop(),
        new EndScreen(),
        new ToeicMultipleResponse(),
        new ToeicInterstitial()
    ];

    readonly routeRegex = /^\/quiz/;

    isDetected(): boolean {
        let quizDetected = (QuizzHandler.listQuestion.some(elem => elem.isDetected()))
        let pathDetected = this.routeRegex.test(globalThis.location.pathname);
        return quizDetected || pathDetected;
    }

    async handler() {
        const handler = QuizzHandler.listQuestion.find(elem => elem.isDetected())
        if (handler == undefined) {
            console.log("❓ Question type not found")
            return
        }
        if(!await timeService.isWaitingEnded(TimerType.QUESTION)){
            return
        }
        await handler.handler()
    }

}

