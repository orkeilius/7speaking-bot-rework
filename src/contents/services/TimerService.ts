import {logMessage} from "~contents/utils/Logging";
import {StorageKeys, storageService} from "~contents/services/StorageService";

class TimeUtils {

    // 20 minutes
    static readonly defaultTimerQuiz = 60 * 1000 * 20;
    static readonly defaultTimerQuestion = 10 * 1000;

    async isWaitingEnded(timerType: TimerType) {
        if(document.location.href !== await storageService.get(StorageKeys.TIMER_URL)){
            await this.createTimer(timerType)
            return false
        }

        const timerEnd = await storageService.get<number>(StorageKeys.TIMER_END)
        if(timerEnd > Date.now()){
            logMessage(`⏱️ waiting (time left ${Math.floor((timerEnd - Date.now()) / 60000)}mins ${Math.floor(((timerEnd - Date.now()) % 60000) / 1000)}s)`)
            return false
        }
        await storageService.set(StorageKeys.TIMER_URL, "")
        return true
    }

    async createTimer(timerType:TimerType){
        let time = await storageService.get<number>(timerType == TimerType.QUIZ ? StorageKeys.CUSTOM_TIMER_QUIZ : StorageKeys.CUSTOM_TIMER_QUESTION)

        if(await storageService.get<boolean>(StorageKeys.USE_RECOMMENDED_TIME)){
            switch (timerType) {
                case TimerType.QUIZ:
                    time = await this.findRealTime()
                    break
                case TimerType.QUESTION:
                    time = TimeUtils.defaultTimerQuestion
                    break
            }
        }
        const newTime = Date.now() + (time * (Math.random() + 0.5))

        await storageService.set(StorageKeys.TIMER_URL, document.location.href)
        await storageService.set(StorageKeys.TIMER_END, newTime)
        logMessage("⏱️ setting timer for "+ new Date(newTime).toLocaleTimeString())

    }

    async findRealTime(){
        const rawTime = document.querySelector('.durationCounter p.MuiTypography-body1')?.textContent
        if(rawTime != null && /^\d+(?:sec|min|h)$/.test(rawTime)){
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
        return TimeUtils.defaultTimerQuiz
    }
}
export enum TimerType{
    QUIZ,
    QUESTION
}

export const timeService = new TimeUtils();