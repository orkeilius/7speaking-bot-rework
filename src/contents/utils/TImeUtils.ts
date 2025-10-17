import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export class TimeUtils {

    // 20 minutes
    static readonly defaultTiming = 60 * 1000 * 0.2;

    useRealtime = false
    fixTime = 0
    timerUrl = ""
    timerEnd = 0

    async updateStorageValue() {
        const result = await storage.getMany(['fixTime', 'useRealtime', 'timerUrl', 'timerEnd']);
        if (typeof result.fixTime === 'number' && !Number.isNaN(result.fixTime)) {
            this.fixTime = result.fixTime;
        }else {
           await storage.set("fixTime",0)
        }
        if (typeof result.useRealtime === 'boolean') {
            this.useRealtime = result.useRealtime;
        }else {
            await storage.set("useRealtime",true)
        }
        if (typeof result.timerUrl === 'string') {
            this.timerUrl = result.timerUrl
        } else {
            await storage.set("timerUrl","")
        }
        if (typeof result.timerEnd === 'number' && !Number.isNaN(result.timerEnd)) {
            this.timerEnd = result.timerEnd;
        } else {
            await storage.set("timerEnd",0)
        }
    }


    async isWaitingEnded() {
        await this.updateStorageValue()
        if(document.location.href !== this.timerUrl){
            await this.createTimer()
            return false
        }
        if(this.timerEnd > Date.now()){
            console.log("remaining time ", (this.timerEnd - Date.now()) / 1000)
            return false
        }
        await storage.set("timerUrl","")
        return true
    }

    async createTimer(){
        let time = this.fixTime
        if(this.useRealtime){
            time = await this.findRealTime()
        }
        console.log("time",time)
        const newTime = Date.now() + time

        await storage.setMany({timerUrl:document.location.href,timerEnd:newTime})
        console.log("timer set to : ",new Date(newTime).toLocaleTimeString())
    }

    async findRealTime(){
        return TimeUtils.defaultTiming
    }


}