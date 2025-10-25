import buildFirefox from "./buildFirefox.js";
import * as fs from "node:fs";

const tag = JSON.parse(fs.readFileSync("./package.json", 'utf8')).version;

console.log(`building version ${tag}`)

try {
    await buildFirefox(tag)
} catch (e) {
    console.error('buildFirefox failed:', e);
}


