import type DragAndDropRawAnswer from "~types/DragAndDropRawAnswer";

class MainWorldHostService {
   private async callFunction(functionName: string, detail: any = {}): Promise<any> {
        return new Promise(resolve => {
            const handler = (event: any) => {
                globalThis.removeEventListener(`${functionName}_RESPONSE`, handler);
                resolve(event.detail);
            };
            globalThis.addEventListener(`${functionName}_RESPONSE`, handler);
            globalThis.dispatchEvent(new CustomEvent(`${functionName}_REQUEST`, { detail }));
            setTimeout(() => {
                globalThis.removeEventListener(`${functionName}_RESPONSE`, handler);
                resolve(null);
            }, 3000);
        });
    }

    async getReactAnswer(): Promise<string> {
        return this.callFunction('GET_ANSWER').then((detail: any) => detail ? detail.answer : "");
    }

    async getReactAnswerDragDrop(): Promise<DragAndDropRawAnswer> {
        return this.callFunction('GET_ANSWER_DRAGDROP').then((detail: any) => detail ? detail.answer : null);
    }

    async executeDragAndDrop(draggableId: number, droppableId: number): Promise<{ success: boolean; error?: string }> {
        return this.callFunction('EXECUTE_DRAGDROP', { draggableId, droppableId }).then((detail: any) => detail || { success: false, error: 'Timeout' });
    }
}

export const mainWorldHostService = new MainWorldHostService();