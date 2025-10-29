import {Storage} from "@plasmohq/storage"
import {Constants} from "../utils/Constants";

class StorageService {
    private readonly storage: Storage;

    constructor() {
        this.storage = new Storage({area: "local"});
    }


    public async get<T>(key: StorageKeys): Promise<T | undefined> {
        const result = await this.storage.get(key.key);
        if (typeof result !== typeof key.defaultValue || result == undefined) {
            await this.storage.set(key.key, key.defaultValue);
            return key.defaultValue
        }
        return result as T;
    }

    public async set<T>(key: StorageKeys,value:T): Promise<void> {
        if(key.customSetter){
            throw new Error(`Use custom setter for key ${key.key} use update() instead.`);
        }
        if(typeof value !== typeof key.defaultValue){
            throw new Error(`Invalid type for key ${key.key}. Expected ${typeof key.defaultValue} but got ${typeof value}`);
        }
        await this.storage.set(key.key, value);
    }
    public async update(key: StorageKeys): Promise<void> {
        if(!key.customSetter){
            throw new Error(`Use standard setter for key ${key.key} use set() instead.`);
        }
        const value = await key.customSetter();
        await this.storage.set(key.key, value);
    }


}

export class StorageKeys {
    public static readonly ACTIVE = new StorageKeys("active", false)
    public static readonly LOG = new StorageKeys("log", "⏱️ waiting...");
    public static readonly TIMER_URL = new StorageKeys("timerUrl", "");
    public static readonly TIMER_END = new StorageKeys("timerEnd", 0);
    public static readonly CUSTOM_TIMER = new StorageKeys("fixTime", 1000 * 60 * 20);
    public static readonly USE_RECOMMENDED_TIME = new StorageKeys("useRealtime", true);
    public static readonly ERROR_PROBABILITY = new StorageKeys("errorProbability", Math.random() / 3 + 0.1);
    public static readonly SHOW_OVERLAY = new StorageKeys("showOverlay", true)
    public static readonly LAST_TIME_RUN = new StorageKeys("lastTimeRun", 0,Date.now);
    public static readonly LAST_TIME = new StorageKeys("lastTime", 0,Date.now);
    public static readonly STAT_QUESTION_DONE = new StorageKeys("statQuestionDone", 0,
        async ()=> await storageService.get<number>(StorageKeys.STAT_QUESTION_DONE) + 1
    );
    public static readonly STAT_QUIZ_DONE = new StorageKeys("statQuizDone", 0,
        async ()=> await storageService.get<number>(StorageKeys.STAT_QUIZ_DONE) + 1
    );
    public static readonly STAT_TIME_USE = new StorageKeys("statTimeUse", 0,async ()=>{
        let diff = Date.now() - await storageService.get<number>(StorageKeys.LAST_TIME_RUN)
        if(diff >= Constants.maxTimeUseDiffTooLong){
            console.warn("skip")
            return 0
        }
        return await storageService.get<number>(StorageKeys.STAT_TIME_USE) + diff;
    }
    );
    public static readonly LAST_QUIZ_COMPLETED = new StorageKeys("lastQuizCompleted", "");


    private constructor(public readonly key: string, public readonly defaultValue: any,public readonly customSetter : ()=>any = null) {
    }

}

export const storageService = new StorageService();