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
            console.log("key ", key);
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

// Écouter les demandes depuis le content script
globalThis.addEventListener('GET_ANSWER_REQUEST', () => {
    const answer = getAnswerObject();
    globalThis.dispatchEvent(new CustomEvent('GET_ANSWER_RESPONSE', {
        detail: {answer}
    }));
});
