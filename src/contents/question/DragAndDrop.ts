import {mainWorldHostService} from "~contents/services/MainWorldHostService";
import {logMessage} from "~contents/utils/Logging";
import {QuestionInterface} from "~contents/question/QuestionInterface";
import type DragAndDropRawAnswer from "~types/DragAndDropRawAnswer";

export class DragAndDrop extends QuestionInterface<DragAndDropRawAnswer> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container div.dropZone") !== null;
    }


    async getGoodAnswer(): Promise<DragAndDropRawAnswer> {
        logMessage("🖌️ Drag and Drop");
        return await mainWorldHostService.getReactAnswerDragDrop();
    }
    async executeAnswer(answer: DragAndDropRawAnswer): Promise<void> {
        for (const elem of answer.answers) {
            const answersId = elem.id;
            await mainWorldHostService.executeDragAndDrop(answersId, answersId);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}