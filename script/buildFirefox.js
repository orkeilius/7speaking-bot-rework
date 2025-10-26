import {execSync} from "node:child_process";
import {MozillaAddonsAPI} from "@plasmohq/mozilla-addons-api";
import * as fs from "node:fs";
import * as https from "node:https";
import path from "node:path";
import dotenv from "dotenv";


dotenv.config({path: path.resolve(process.cwd(), ".env")});

/**
 * Classe pour gérer le build et la publication de l'extension Firefox
 */
class FirefoxBuilder {
    constructor(tag) {
        this.tag = tag;
        this.zipPath = './build/firefox-mv3-prod.zip';
        this.xpiPath = './build/firefox-mv3-prod.xpi';
        this.outputPath = `./release/7speaking-bot-rework_firefox-${tag}.xpi`;
        this.updateJsonPath = './release/firefox_update.json';
        this.mozilla = new MozillaAddonsAPI({
            extId: process.env.FIREFOX_ID,
            apiKey: process.env.FIREFOX_API_KEY,
            apiSecret: process.env.FIREFOX_API_SECRET,
            channel: "unlisted"
        });
    }

    async buildWithPlasmo() {
        console.log("  - plasmo build");
        await execSync("npm exec -- plasmo build --target=firefox-mv3 --zip");
        fs.rename(this.zipPath,this.xpiPath,console.error)
    }

    async submitToMozilla() {
        console.log("  - sending to firefox repo");
        await this.mozilla.submit({
            filePath: this.xpiPath,
            version: this.tag
        }).catch(console.error);
    }

    async downloadFromMozilla() {
        console.log("  - downloading xpi from firefox repo");

        const jwt = await this.mozilla.getAccessToken();

        // Attendre que automated_signing soit true
        console.log("  - waiting for automated signing to complete...");
        let retries = 0;
        const maxRetries = 60; // 5 minutes max (60 * 5 secondes)
        let download_url = "";

        while (retries < maxRetries) {
            let upload_info = await fetch(
                `https://addons.mozilla.org/api/v4/addons/${process.env.FIREFOX_ID}/versions/${this.tag}/`,
                {
                    headers: {
                        'Authorization': `JWT ${jwt}`
                    }
                }
            ).then(res => res.json());

            if (upload_info.files[0].signed === true) {
                console.log("  - automated signing completed!");
                console.debug(upload_info);
                download_url = upload_info.files[0].download_url;
                break;
            }

            console.log(`  - signing in progress... (attempt ${retries + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 20000)); // Attendre 5 secondes
            retries++;
        }

        if (retries >= maxRetries) {
            throw new Error("Timeout: automated signing did not complete in time");
        }

        await https.get(
            download_url,
            {headers: {'Authorization': `JWT ${jwt}`}},
            res => {
                const writeStream = fs.createWriteStream(this.outputPath);
                res.pipe(writeStream);
            }
        )
    }

    updateFirefoxUpdateJson() {
        console.log("  - Updating firefox_update.json");

        const updateJson = JSON.parse(fs.readFileSync(this.updateJsonPath, 'utf8'));

        updateJson.addons[process.env.FIREFOX_ID].updates.push({
            version: this.tag,
            update_link: `https://github.com/orkeilius/7speaking-bot-rework/releases/download/${this.tag}/7speaking-bot-rework_firefox-${this.tag}.xpi`
        });

        fs.writeFileSync(this.updateJsonPath, JSON.stringify(updateJson, null, 2));
    }

    /**
     * Exécute toutes les étapes du build
     */
    async build() {
        console.log(`Building Firefox version: ${this.tag}`);

        await this.buildWithPlasmo();
        await this.submitToMozilla();
        await this.downloadFromMozilla();
        this.updateFirefoxUpdateJson();
    }
}

export default async function buildFirefox(tag) {
    const builder = new FirefoxBuilder(tag);
    await builder.build();
}

