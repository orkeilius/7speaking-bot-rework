import type {PlasmoCSConfig} from "plasmo";
import ExecuteDragAndDrop from "~contents/mainWorldClient/mainWorldFunction/ExecuteDragAndDrop";
import GetAnswer from "~contents/mainWorldClient/mainWorldFunction/GetAnswer";
import GetAnswerDragAndDrop from "~contents/mainWorldClient/mainWorldFunction/GetAnswerDragAndDrop";
import GetAnswerToeic from "~contents/mainWorldClient/mainWorldFunction/GetAnswerToeic";
import type MainWorldInterface from "~contents/mainWorldClient/mainWorldInterface";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    world: "MAIN",
    all_frames: true
}

const functions : MainWorldInterface<any,any>[] = [
    new ExecuteDragAndDrop(),
    new GetAnswer(),
    new GetAnswerDragAndDrop(),
    new GetAnswerToeic()
]
for(const elem of functions){
    elem.initClientSide()
}

