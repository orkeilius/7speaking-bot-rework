import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";

export class TimeUtils {

    // 20 minutes
    static readonly defaultTiming = 60 * 1000 * 0.5;

    async isWaitingEnded() {
        if(document.location.href !== await storageService.getTimerUrl()){
            await this.createTimer()
            return false
        }

        let timerEnd = await storageService.getTimerEnd()
        if(timerEnd > Date.now()){
            logMessage(`⏱️ waiting (time left ${Math.floor((timerEnd - Date.now()) / 60000)}mins ${Math.floor(((timerEnd - Date.now()) % 60000) / 1000)}s)`)
            return false
        }
        await storageService.setTimerUrl("")
        return true
    }

    async createTimer(){
        let time = await storageService.getFixedTime()
        if(await storageService.getUseRealtime()){
            time = await this.findRealTime()
        }
        const newTime = Date.now() + time

        await storageService.setTimerUrl(document.location.href)
        await storageService.setTimerEnd(newTime)
        logMessage("⏱️ setting timer for "+ new Date(newTime).toLocaleTimeString())

    }

    async findRealTime(){
        return TimeUtils.defaultTiming
    }


}