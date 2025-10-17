import { Storage } from "@plasmohq/storage"
import {logMessage} from "~contents/utils/Logging";

const storage = new Storage({area: "local"})

export class TimeUtils {

    // 20 minutes
    static readonly defaultTiming = 60 * 1000 * 0.5;

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
            logMessage(`⏱️ waiting (time left ${Math.floor((this.timerEnd - Date.now()) / 60000)}mins ${Math.floor(((this.timerEnd - Date.now()) % 60000) / 1000)}s)`)
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
        const newTime = Date.now() + time

        await storage.setMany({timerUrl:document.location.href,timerEnd:newTime})
        logMessage("⏱️ setting timer for "+ new Date(newTime).toLocaleTimeString())

    }

    async findRealTime(){
        return TimeUtils.defaultTiming
    }


}