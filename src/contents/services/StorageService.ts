import { Storage } from "@plasmohq/storage"

class StorageService {
    private readonly storage: Storage;
    private readonly maxTimeUseDiffTooLong = 1000 * 60; // 10 minutes

    constructor() {
        this.storage = new Storage({ area: "local" });
    }

    private async get<T>(key: string,defaultValue : T): Promise<T | undefined> {
        const result = await this.storage.get(key);
        if (typeof result !== typeof defaultValue || result == undefined) {
            console.log(result,defaultValue)
            await this.storage.set(key, defaultValue);
            return defaultValue
        }
        return result as T;
}


    async getActive(): Promise<boolean> {
        return await this.get<boolean>("active", false);
    }
    async setActive(value: boolean) {
        await this.storage.set("active", value);
    }

    async getLog(): Promise<string> {
        return await this.get<string>("log", "⏱️ waiting...");
    }
    async setLog(value: string) {
        await this.storage.set("log", value);
    }

    async getTimerUrl() {
        return await this.get<string>("timerUrl", "");
    }
    async setTimerUrl(value: string) {
        await this.storage.set("timerUrl", value);
    }

    async getTimerEnd() {
        return await this.get<number>("timerEnd", 0);
    }
    async setTimerEnd(value: number) {
        await this.storage.set("timerEnd", value);
    }

    async getFixedTime() {
        return await this.get<number>("fixTime", 1000 * 60 * 20);
    }
    async setFixedTime(value: number) {
        await this.storage.set("fixTime", value);
    }

    async getUseRealtime() {
        return await this.get<boolean>("useRealtime", true);
    }
    async setUseRealtime(value: boolean) {
        await this.storage.set("useRealtime", value);
    }

    async getErrorProbability() {
        return await this.get<number>("errorProbability", Math.random() / 3 + 0.1);
    }
    async setErrorProbability(number: number) {
        await this.storage.set("errorProbability", number);
    }

    async getShowOverlay() {
        return await this.get<boolean>("showOverlay", true);
    }
    async setShowOverlay(value: boolean) {
        await this.storage.set("showOverlay", value);
    }

    async getLastTimeRun(){
        return await this.get<number>("lastTimeRun", 0);
    }
    async setLastTimeRun(){
        await this.storage.set("lastTimeRun", Date.now());
    }

    async getStatQuestionDone(){
        return await this.get<number>("statQuestionDone", 0);
    }

    async addStatQuestionDone(){
        let current = await this.getStatQuestionDone();
        await this.storage.set("statQuestionDone", current + 1);
    }

    async getStatQuizDone(){
        return await this.get<number>("statQuizDone", 0);
    }
    async addStatQuizDone(){
        let current = await this.getStatQuizDone();
        await this.storage.set("statQuizDone", current + 1);
    }

    async getStatTimeUse(){
        return await this.get<number>("statTimeUse", 0);
    }
    async addStatTimeUse(){
        let diff = Date.now() - await this.getLastTimeRun()
        if(diff >= this.maxTimeUseDiffTooLong){
            console.warn("skip")
            return
        }
        let current = await this.getStatTimeUse();
        await this.storage.set("statTimeUse", current + diff);
    }

}

export const storageService = new StorageService();