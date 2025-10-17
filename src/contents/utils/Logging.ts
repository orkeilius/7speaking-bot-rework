import { Storage } from "@plasmohq/storage"

const storage = new Storage({area: "local"})

export async function logMessage(message: string) {
    console.log(`bot - ${message}`)
    storage.set("log", message)
}
