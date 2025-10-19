import {logMessage} from "~contents/utils/Logging";
import {storageService} from "~contents/services/StorageService";

export class TimeUtils {

    // 20 minutes
    static readonly defaultTiming = 60 * 1000 * 20;

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
        const newTime = Date.now() + (time * (Math.random() + 0.5))

        await storageService.setTimerUrl(document.location.href)
        await storageService.setTimerEnd(newTime)
        logMessage("⏱️ setting timer for "+ new Date(newTime).toLocaleTimeString())

    }

    async findRealTime(){
        const rawTime = document.querySelector('.durationCounter p.MuiTypography-body1')?.textContent
        if(rawTime != null && /^\d+(?:sec|min|h)$/.test(rawTime)){
            console.log(new RegExp(/\w*$/).exec(rawTime)[0])
            const value = Number.parseInt(rawTime)
            switch (new RegExp(/[a-z]*$/).exec(rawTime)[0]) {
                case "sec" :
                    return value * 1000
                case "min" :
                    return value * 60 * 1000
                case "h" :
                    return  value * 60 * 60 * 1000
            }
        }
        return TimeUtils.defaultTiming
    }


}