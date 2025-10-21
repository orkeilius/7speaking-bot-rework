import {Constants} from "~contents/utils/Constants";
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";

export abstract class QuestionInterface<T> {
    abstract isDetected() :boolean;

    protected abstract getGoodAnswer(): Promise<T>;
    protected abstract getBadAnswer(): Promise<T>;
    protected abstract executeAnswer(answer : T) : Promise<void>;

    protected abstract getGoodText() : string;
    protected abstract getBadText() : string;

    async executeSubmit(): Promise<void> {
        const btnContainer : HTMLElement = document.querySelector(Constants.QuizValidateSelector);
        btnContainer?.click();
    }

    public handler = async (): Promise<void> => {
        try {
            const errorProbility =  await storageService.getErrorProbability()
            const makeError = Math.random() < errorProbility;

            const answer: T = makeError ? await this.getBadAnswer() : await this.getGoodAnswer();
            await logMessage(makeError ? this.getBadText() : this.getGoodText());

            await this.executeAnswer(answer);
            await this.executeSubmit()

            await storageService.addStatQuestionDone()
        } catch (error) {
            await logMessage(`⚠️ Error executing good answer, (${error})`);
        }
    };


}