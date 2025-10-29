import MainWorldInterface from "~contents/mainWorldClient/mainWorldInterface";

export default class GetAnswer extends MainWorldInterface<void, string>{
    name: string = "GetAnswer";

    protected clientFunction(): string {
        const container = document.querySelector(".question-container");
        const reactElem = this.getReactElement(container);

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


}