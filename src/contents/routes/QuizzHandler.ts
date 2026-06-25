import type {QuestionInterface} from "~contents/question/QuestionInterface";
import {TextInput} from "~contents/question/7speaking/TextInput";
import {EndScreen} from "~contents/question/7speaking/EndScreen";
import {MultipleResponse} from "~contents/question/7speaking/MultipleResponse";
import {DragAndDrop} from "~contents/question/7speaking/DragAndDrop";
import {ToeicMultipleResponse} from "~contents/question/7speaking/ToeicMultipleResponse";
import {ToeicInterstitial} from "~contents/question/7speaking/ToeicInterstitial";
import {TimerType, timeService} from "~contents/services/TimerService";
import {logMessage} from "~contents/utils/Logging";


export class QuizzHandler implements RouteHandlerInterface {

    static readonly listQuestion: QuestionInterface[] = [
        new TextInput(),
        new MultipleResponse(),
        new DragAndDrop(),
        new EndScreen(),
        new ToeicMultipleResponse(),
        new ToeicInterstitial()
    ];

    readonly routeRegex = /^\/quiz/;

    isDetected(): boolean {
        const quizDetected = (QuizzHandler.listQuestion.some(elem => elem.isDetected()))
        const pathDetected = this.routeRegex.test(globalThis.location.pathname);
        return quizDetected || pathDetected;
    }

    async handler() {
        const handler = QuizzHandler.listQuestion.find(elem => elem.isDetected())
        if (handler === undefined) {
            await logMessage("❓ Question type not found")
            return
        }
        if(!await timeService.isWaitingEnded(TimerType.QUESTION)){
            return
        }
        await handler.handler()
    }

}

