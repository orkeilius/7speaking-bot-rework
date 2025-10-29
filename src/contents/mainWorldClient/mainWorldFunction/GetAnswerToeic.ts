import MainWorldInterface from "~contents/mainWorldClient/mainWorldInterface";

export default class GetAnswerToeic extends MainWorldInterface<void, string>{
    name: string = "GetAnswerToeic";

    protected clientFunction(): string {
        const container = document.querySelector(".questions_variantsContainer");
        const reactElem = this.getReactElement(container);
        if (!reactElem) {
            return "";
        }
        if (reactElem.pendingProps?.children?.[0]?.props?.children?.[0].props?.question?.errorMessage) {
            return String(reactElem.pendingProps.children[0].props.children[0].props.question.errorMessage);
        }
        return "";
    }
}