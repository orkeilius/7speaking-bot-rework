import browser from "webextension-polyfill";

export class TimeUtils {

    // 20 minutes
    static readonly defaultTiming = 60 * 1000 * 1;

    useRealtime = false
    fixTime = 0
    timerUrl = ""
    timerEnd = 0

    async updateStorageValue() {
        const result = await browser.storage.sync.get(['fixTime', 'useRealtime', 'timerUrl', 'timerEnd']);
        if (typeof result.fixTime === 'number' && !Number.isNaN(result.fixTime)) {
            this.fixTime = result.fixTime;
        }
        if (typeof result.useRealtime === 'boolean') {
            this.useRealtime = result.useRealtime;
        }
        if (typeof result.timerUrl === 'string') {
            this.timerUrl = result.timerUrl
        }
        if (typeof result.timerEnd === 'number' && !Number.isNaN(result.timerEnd)) {
            this.timerEnd = result.timerEnd;
        }
    }


    async isWaitingEnded() {
        await this.updateStorageValue()
        if(document.location.href !== this.timerUrl){
            this.createTimer()
            return false
        }
        if(this.timerEnd > Date.now()){
            console.log("remaining time ", (this.timerEnd - Date.now()) / 1000)
            return false
        }
        browser.storage.sync.set({timerUrl:""})
        return true
    }

    async createTimer(){
        let time = this.fixTime
        if(this.useRealtime){
            time = await this.findRealTime()
        }
        console.log("time",time)
        const newTime = Date.now() + time

        await browser.storage.sync.set({timerUrl:document.location.href,timerEnd:newTime})
        console.log("timer set to : ",new Date(newTime).toLocaleTimeString())
    }

    async findRealTime(){
        return TimeUtils.defaultTiming
    }


}