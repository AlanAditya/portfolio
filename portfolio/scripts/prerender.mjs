import { readFile, writeFile, rm, copyFile, cp } from "node:fs/promises";
import { render } from "../.ssr/prerender.js";
const html = await readFile("dist/index.html", "utf8");
await writeFile("dist/index.html", html.replace("<!--app-html-->", render()));
await rm(".ssr", { recursive: true, force: true });
console.log("Prerendered complete portfolio HTML.");

// Keep the original site and its relative media URLs available on the same domain.
await copyFile("../legacy_index.html", "dist/legacy_index.html");
await cp("../assets", "dist/assets", { recursive: true });
console.log("Published the preserved legacy page alongside the new homepage.");
