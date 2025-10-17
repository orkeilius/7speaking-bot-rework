export function getReactAnswer(): Promise<string> {
    return new Promise(resolve => {
        const handler = (event: any) => {
            globalThis.removeEventListener('GET_ANSWER_RESPONSE', handler);
            resolve(event.detail.answer);
        };
        globalThis.addEventListener('GET_ANSWER_RESPONSE', handler);
        globalThis.dispatchEvent(new Event('GET_ANSWER_REQUEST'));
        // Sécurité : timeout si pas de réponse
        setTimeout(() => {
            globalThis.removeEventListener('GET_ANSWER_RESPONSE', handler);
            resolve("");
        }, 3000);
    });
}

export function getReactAnswerDragDrop(): Promise<any> {
    return new Promise(resolve => {
        const handler = (event: any) => {
            globalThis.removeEventListener('GET_ANSWER_DRAGDROP_RESPONSE', handler);
            resolve(event.detail.answer);
        };
        globalThis.addEventListener('GET_ANSWER_DRAGDROP_RESPONSE', handler);
        globalThis.dispatchEvent(new Event('GET_ANSWER_DRAGDROP_REQUEST'));
        // Sécurité : timeout si pas de réponse
        setTimeout(() => {
            globalThis.removeEventListener('GET_ANSWER_DRAGDROP_REQUEST', handler);
            resolve("");
        }, 3000);
    });
}

export function executeDragAndDrop(draggableId: string, droppableId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise(resolve => {
        const handler = (event: any) => {
            globalThis.removeEventListener('EXECUTE_DRAGDROP_RESPONSE', handler);
            resolve(event.detail);
        };
        globalThis.addEventListener('EXECUTE_DRAGDROP_RESPONSE', handler);
        globalThis.dispatchEvent(new CustomEvent('EXECUTE_DRAGDROP_REQUEST', {
            detail: { draggableId, droppableId }
        }));
        // Sécurité : timeout si pas de réponse
        setTimeout(() => {
            globalThis.removeEventListener('EXECUTE_DRAGDROP_RESPONSE', handler);
            resolve({ success: false, error: 'Timeout' });
        }, 3000);
    });
}
