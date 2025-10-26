import buildFirefox from "./buildFirefox.js";
import * as fs from "node:fs";
import buildChrome from "./buildChrome.js";

const tag = JSON.parse(fs.readFileSync("./package.json", 'utf8')).version;

console.log(`building version ${tag}`)

try {
    await buildFirefox(tag)
} catch (e) {
    console.error('firefox build failed:', e);
}


try {
    await buildChrome(tag)
} catch (e) {
    console.error('chrome build failed:', e);
}

