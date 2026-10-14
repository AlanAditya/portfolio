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
await sharp("public/social.svg").png().toFile("public/social.png");
console.log(
  "Prepared local fonts, optimized project images, and social preview.",
);
