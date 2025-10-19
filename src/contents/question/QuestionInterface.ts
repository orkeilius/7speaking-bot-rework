import {Selector} from "~contents/utils/SelectorConstant";
import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";

export abstract class QuestionInterface<T> {
    protected abstract isDetected() :boolean;

    protected abstract getGoodAnswer(): Promise<T>;
    protected abstract getBadAnswer(): Promise<T>;
    protected abstract executeAnswer(answer : T) : Promise<void>;

    async executeSubmit(): Promise<void> {
        const btnContainer : HTMLElement = document.querySelector(Selector.QuizValidateSelector);
        btnContainer?.click();
    }

    public handler = async (): Promise<void> => {
        try {
            const errorProbility =  await storageService.getErrorProbability()
            const makeError = Math.random() < errorProbility;

            const answer: T = makeError ? await this.getBadAnswer() : await this.getGoodAnswer();

            await this.executeAnswer(answer);
            await this.executeSubmit()

        } catch (error) {
            await logMessage(`⚠️ Error executing good answer, (${error})`);
        }
    };


}