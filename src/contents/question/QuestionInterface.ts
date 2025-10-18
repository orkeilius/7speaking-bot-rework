
export abstract class QuestionInterface {
    abstract isDetected : ()=> boolean;
    abstract handler: () => Promise<void>;




}