import { compareVersions } from 'compare-versions';

class UpdateService{

    private isUpdateAvailable : boolean = null

    async getUpdateAvailable(){
        try {
            this.isUpdateAvailable == null && await this.checkUpdateAvailable();
        }catch (e){
            console.log(e)
            setTimeout(this.getUpdateAvailable, 1000 * 60 * 5) // retry in 5 minutes
        }
        return this.isUpdateAvailable
    }

    private async checkUpdateAvailable(){
        let currentVersion = chrome.runtime.getManifest().version
        let request = await fetch("https://api.github.com/repos/orkeilius/7speaking-bot-rework/releases/latest")
        if(!request.ok){
            this.isUpdateAvailable = false
            throw new Error(`Failed to fetch latest release: ${request.status} ${request.statusText}`)
        }
        let data = await request.json()
        let latestVersion : string = data.tag_name.replace("v","")
        console.log(`Current version: ${currentVersion}, Latest version: ${latestVersion}`)
        this.isUpdateAvailable = compareVersions(latestVersion,currentVersion) == 1
        if (this.isUpdateAvailable){
            console.log(`🆕 Update available! Current version: ${currentVersion}, Latest version: ${latestVersion}`)
        }
    }
}

export const updateService = new UpdateService()