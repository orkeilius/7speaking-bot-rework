import {storageService} from "~contents/services/StorageService";

export async function logMessage(message: string) {
    console.log(`bot - ${message}`)
    await storageService.setLog(message)
}
