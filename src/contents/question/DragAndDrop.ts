import {mainWorldHostService} from "~contents/services/MainWorldHostService";
import {logMessage} from "~contents/utils/Logging";
import {QuestionInterface} from "~contents/question/QuestionInterface";
import type DragAndDropAnswer from "~types/DragAndDropAnswer";

export class DragAndDrop extends QuestionInterface<DragAndDropAnswer[]> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container div.dropZone") !== null;
    }


    async getGoodAnswer(): Promise<DragAndDropAnswer[]> {
        logMessage("🖌️ Drag and Drop");
        const raw = await mainWorldHostService.getReactAnswerDragDrop();
        return raw.options.map(rawItem => ({dragId: rawItem.id, dropzoneId: rawItem.id}));
    }
    async getBadAnswer(): Promise<DragAndDropAnswer[]> {
        const answers = await this.getGoodAnswer();

        const dropzoneIds = answers.map(ans => ans.dropzoneId);

        for (const [index, ans] of answers.entries()) {
            ans.dragId = dropzoneIds[index - 1];
        }

        return answers;
    }


    async executeAnswer(answers: DragAndDropAnswer[]): Promise<void> {
        for (const elem of answers) {
            await mainWorldHostService.executeDragAndDrop(elem.dragId, elem.dropzoneId);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}