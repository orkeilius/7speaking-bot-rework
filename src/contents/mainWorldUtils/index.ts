import type {PlasmoCSConfig} from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    world: "MAIN",
    all_frames: true
}

function getReactElement(e: Element | null) {
    if (!e) {
        return null;
    }

    const keys = Object.keys(e);
    for (const key of keys) {
        if (key.startsWith("__reactFiber$")) {
            return (e as any)[key];
        }
    }
    return null;
}

function getAnswerObject() {
    const container = document.querySelector(".question-container");
    const reactElem = getReactElement(container);

    if (!reactElem) {
        return "";
    }

    if (reactElem.pendingProps?.children?.[5]?.props?.children?.[0]?.props?.children?.props?.answer) {
        return String(reactElem.pendingProps.children[5].props.children[0].props.children.props.answer);
    }
    if (reactElem.memoizedProps?.children?.[5]?.props?.children?.[0]?.props?.children?.props?.answerOptions?.answer?.[0]?.value) {
        return String(reactElem.memoizedProps.children[5].props.children[0].props.children.props.answerOptions.answer[0].value);
    }
    return "";
}

function getAnwserDragAndDrop() {
    const container = document.querySelector(".answer-container");
    const reactElem = getReactElement(container);
    return reactElem.pendingProps.children.props.answerOptions;
}

function executeDragAndDrop(draggableId: string, droppableId: string) {
    try {
        const dragElem = document.querySelector(`div[data-rbd-draggable-id="${draggableId}"]`);
        if (!dragElem) {
            return { success: false, error: 'Drag element not found' };
        }

        // Trouver l'instance React et le callback onDragEnd
        let reactInstance = getReactElement(dragElem);
        let onDragEndCallback = null;

        let current = reactInstance;
        while (current && !onDragEndCallback) {
            if (current.return) {
                current = current.return;
                if (current.memoizedProps?.onDragEnd) {
                    onDragEndCallback = current.memoizedProps.onDragEnd;
                    break;
                }
                if (current.pendingProps?.onDragEnd) {
                    onDragEndCallback = current.pendingProps.onDragEnd;
                    break;
                }
            } else {
                break;
            }
        }

        if (!onDragEndCallback) {
            return { success: false, error: 'onDragEnd callback not found' };
        }

        // Trouver la source droppable
        const sourceDroppable = dragElem.closest('[data-rbd-droppable-id]');
        const sourceDroppableId = sourceDroppable?.getAttribute('data-rbd-droppable-id');

        const sourceIndex = Array.from(sourceDroppable?.querySelectorAll('[data-rbd-draggable-id]') || [])
            .indexOf(dragElem);

        // Appeler le callback onDragEnd
        const result = {
            draggableId: String(draggableId),
            type: 'DEFAULT',
            source: {
                droppableId: sourceDroppableId,
                index: sourceIndex >= 0 ? sourceIndex : 0
            },
            destination: {
                droppableId: String(droppableId),
                index: 0
            },
            reason: 'DROP',
            mode: 'FLUID',
            combine: null
        };

        onDragEndCallback(result);
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// Écouter les demandes depuis le content script
globalThis.addEventListener('GET_ANSWER_REQUEST', () => {
    const answer = getAnswerObject();
    globalThis.dispatchEvent(new CustomEvent('GET_ANSWER_RESPONSE', {
        detail: {answer}
    }));
});

globalThis.addEventListener('GET_ANSWER_DRAGDROP_REQUEST', () => {
    const answer = getAnwserDragAndDrop();
    globalThis.dispatchEvent(new CustomEvent('GET_ANSWER_DRAGDROP_RESPONSE', {
        detail: {answer}
    }));
});

globalThis.addEventListener('EXECUTE_DRAGDROP_REQUEST', (event: any) => {
    const { draggableId, droppableId } = event.detail;
    const result = executeDragAndDrop(draggableId, droppableId);
    globalThis.dispatchEvent(new CustomEvent('EXECUTE_DRAGDROP_RESPONSE', {
        detail: result
    }));
});
