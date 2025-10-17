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

