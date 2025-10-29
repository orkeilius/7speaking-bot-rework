import type DragAndDropRawAnswer from "~types/DragAndDropRawAnswer";
import MainWorldInterface from "~contents/mainWorldClient/mainWorldInterface";

export default class GetAnswerDragAndDrop extends MainWorldInterface<void, DragAndDropRawAnswer>{
    name: string = "GetAnswerDragAndDrop";

    protected clientFunction(): DragAndDropRawAnswer {
        const container = document.querySelector(".answer-container");
        const reactElem = this.getReactElement(container);
        return reactElem.pendingProps.children.props.answerOptions;
    }
}