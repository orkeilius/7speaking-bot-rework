import type {QuestionInterface} from "~contents/question/QuestionInterface";
import {TextInput} from "~contents/question/7speaking/TextInput";
import {EndScreen} from "~contents/question/7speaking/EndScreen";
import {MultipleResponse7s} from "~contents/question/7speaking/MultipleResponse7s";
import {DragAndDrop} from "~contents/question/7speaking/DragAndDrop";
import {ToeicMultipleResponse} from "~contents/question/7speaking/ToeicMultipleResponse";
import {ToeicInterstitial} from "~contents/question/7speaking/ToeicInterstitial";
import {TimerType, timeService} from "~contents/services/TimerService";
import {logMessage} from "~contents/utils/Logging";
import {MultipleResponsePmf} from "~contents/question/prepmyfutur/MultipleResponsePmf";
import type { RouteHandlerInterface } from "~contents/routes/RouteHandlerInterface"


export class QuizzHandler implements RouteHandlerInterface {

    static readonly listQuestion: QuestionInterface[] = [
        new TextInput(),
        new MultipleResponse7s(),
        new DragAndDrop(),
        new EndScreen(),
        new ToeicMultipleResponse(),
        new ToeicInterstitial(),
        new MultipleResponsePmf()
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

