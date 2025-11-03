import {Constants} from "~contents/utils/Constants";
import {logMessage} from "~contents/utils/Logging";
import {StorageKeys, storageService} from "~contents/services/StorageService";
import {waitForSelector} from "~contents/utils/InputUtils";

export abstract class QuestionInterface<T> {
    abstract isDetected() :boolean;

    protected abstract getGoodAnswer(): Promise<T>;
    protected abstract getBadAnswer(): Promise<T>;
    protected abstract executeAnswer(answer : T) : Promise<void>;

    protected abstract getGoodText() : string;
    protected abstract getBadText() : string;

    async executeSubmit(): Promise<void> {

        await waitForSelector(Constants.QuizValidateSelector);
        const btnContainer : HTMLElement = document.querySelector(Constants.QuizValidateSelector);
        btnContainer?.click();

        await waitForSelector(Constants.QuizValidateSelector);
        const btnNext : HTMLElement = document.querySelector(Constants.QuizValidateSelector);
        btnNext?.click();
    }

    public handler = async (): Promise<void> => {
        try {
            const errorProbility =  await storageService.get<number>(StorageKeys.ERROR_PROBABILITY)
            const makeError = Math.random() < errorProbility;

            const answer: T = makeError ? await this.getBadAnswer() : await this.getGoodAnswer();
            await logMessage(makeError ? this.getBadText() : this.getGoodText());

            await this.executeAnswer(answer);
            await this.executeSubmit()

            await storageService.update(StorageKeys.STAT_QUESTION_DONE);
        } catch (error) {
            await logMessage(`⚠️ Error executing good answer, (${error})`);
        }
    };


}