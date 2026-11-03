import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
await mkdir("public/fonts", { recursive: true });
for (const [source, target] of [
  [
    "@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
    "dm-sans.woff2",
  ],
  [
    "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
    "ibm-plex-mono.woff2",
  ],
  ["@fontsource-variable/dm-sans/LICENSE", "DM-Sans-LICENSE"],
  ["@fontsource/ibm-plex-mono/LICENSE", "IBM-Plex-Mono-LICENSE"],
])
  await copyFile(`node_modules/${source}`, `public/fonts/${target}`);
for (const name of ["segmentation-still", "depth-demo"]) {
  await sharp(`../assets/${name}.jpg`)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/media/${name}.webp`);
}
// The Sherlock poster: whole for the project dialog, cropped for its card and
// for link previews. Crops are in pixels of the 2339 x 3308 source.
const poster = "../assets/sherlock-poster.jpg";
await sharp(poster)
  .resize({ width: 1100 })
  .webp({ quality: 84 })
  .toFile("public/media/sherlock-poster.webp");
await sharp(poster)
  .extract({ left: 120, top: 815, width: 2099, height: 1418 })
  .resize({ width: 1200 })
  .webp({ quality: 82 })
  .toFile("public/media/sherlock-card.webp");
await sharp(poster)
  .extract({ left: 0, top: 990, width: 2339, height: 1228 })
  .resize({ width: 1200, height: 630, fit: "cover" })
  .jpeg({ quality: 84 })
  .toFile("public/media/share/sherlock.jpg");
await sharp("public/social.svg").png().toFile("public/social.png");
console.log(
  "Prepared local fonts, optimized project images, and social preview.",
);
