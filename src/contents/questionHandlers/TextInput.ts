import {QuestionInterface} from "./QuestionInterface";
import {getReactAnswer} from "../utils/ReactUtils";

export class TextInput implements QuestionInterface{
    async isDetected(){
        console.log("salut")
        return document.querySelector(".question__form input[type=text]") == null
    }
    async handler(){
        const anwser = await getReactAnswer();
        console.log("awnser : ",anwser);
    }
}