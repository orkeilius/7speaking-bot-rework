import {QuestionInterface} from "~contents/question/QuestionInterface";
import type DragAndDropAnswer from "~types/DragAndDropAnswer";
import GetAnswerDragAndDrop from "~contents/mainWorldClient/mainWorldFunction/GetAnswerDragAndDrop";
import ExecuteDragAndDrop from "~contents/mainWorldClient/mainWorldFunction/ExecuteDragAndDrop";

export class DragAndDrop extends QuestionInterface<DragAndDropAnswer[]> {
    isDetected(): boolean {
        return document.querySelector<HTMLInputElement>(".answer-container div.dropZone") !== null;
    }

    protected getGoodText(): string {
       return "🖌️ Drag and Drop"
    }
    protected getBadText(): string {
          return "🖌️ Playing with the mouse"
    }


    async getGoodAnswer(): Promise<DragAndDropAnswer[]> {
        const raw = await new GetAnswerDragAndDrop().callFunction();
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
            await new ExecuteDragAndDrop().callFunction(elem);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}