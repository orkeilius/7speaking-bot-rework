import { Storage } from "@plasmohq/storage"

class StorageService {
    private readonly storage: Storage;

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
        return await this.get<number>("errorProbability", 0.2);
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
}

export const storageService = new StorageService();