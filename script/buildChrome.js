import {execSync} from "node:child_process";
import crx3 from "crx3"

class ChromeBuilder {
    constructor(tag) {
        this.tag = tag
        this.outputZip = `./release/7speaking-bot-rework_chrome-${tag}.zip`;
        this.outputCrx = `./release/7speaking-bot-rework_chromium-${tag}.crx`;
    }

    async buildWithPlasmo() {
        console.log("  - plasmo build");
        await execSync("npm exec -- plasmo build --target=chrome-mv3 --zip");
    }

    async buildCrx(){
        console.log("  - create crx package");
        crx3(["./build/chrome-mv3-prod/manifest.json"], {
            keyPath: '7speaking-bot-rework.pem',
            crxPath: this.outputCrx,
            zipPath: this.outputZip,
            xmlPath: "./release/chrome_update.xml",
            crxURL: `https://github.com/orkeilius/7speaking-bot-rework/releases/download/${this.tag}/7speaking-bot-rework_chromium-${this.tag}.crx`

        })
    }

    async build() {
        console.log(`Building Chrome version: ${this.tag}`);
        await this.buildWithPlasmo();
        await this.buildCrx();
    }
}


export default async function buildChrome(tag) {
    const builder = new ChromeBuilder(tag);
    await builder.build();
}