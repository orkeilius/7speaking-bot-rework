import {StorageKeys, storageService} from "~contents/services/StorageService";

export async function logMessage(message: string) {
    console.log(`bot - ${message}`)
    await storageService.set(StorageKeys.LOG, message)
}
