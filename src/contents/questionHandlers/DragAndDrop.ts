import {getReactAnswerDragDrop, executeDragAndDrop} from "~contents/utils/ReactUtils";
import type {QuestionInterface} from "~contents/questionHandlers/QuestionInterface";
import {Selector} from "~contents/utils/SelectorConstant";

export class DragAndDrop implements QuestionInterface {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container div.dropZone") !== null;
    }

    async handler(): Promise<void> {
        const answer = await getReactAnswerDragDrop();

        for (const elem of answer.answers) {
            const answersId = elem.id;
            await executeDragAndDrop(answersId, answersId);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const btnContainer = document.querySelector(Selector.QuizValidateSelector);
        btnContainer?.click();
    }
}