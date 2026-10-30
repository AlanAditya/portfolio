import {
  readFile,
  writeFile,
  rm,
  copyFile,
  cp,
  mkdir,
  access,
} from "node:fs/promises";
import { render, projects } from "../.ssr/prerender.js";

// Social previews need absolute URLs. Vercel provides the production domain at
// build time; SITE_URL overrides it (for example, once a custom domain is set).
const site = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "")
).replace(/\/$/, "");
const escape = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  );

function head({ title, socialTitle, description, path, image }) {
  const tags = [
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Aditya Dudeja" />`,
    `<meta property="og:title" content="${escape(socialTitle)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${site}${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (site) {
    tags.push(
      `<meta property="og:url" content="${site}${path}" />`,
      `<link rel="canonical" href="${site}${path}" />`,
    );
  }
  return { title: escape(title), tags: tags.join("\n    ") };
}
function page(template, meta) {
  const { title, tags } = head(meta);
  return template
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace("<!--app-head-->", tags);
}

const template = (await readFile("dist/index.html", "utf8")).replace(
  "<!--app-html-->",
  render(),
);
await writeFile(
  "dist/index.html",
  page(template, {
    title: "Aditya Dudeja — Engineer & Builder",
    socialTitle: "Aditya Dudeja — Curiosity. Built from scratch.",
    description:
      "Aditya Dudeja — a builder at BITS Pilani, Goa exploring graphics, machine learning, and robotics. From the maths underneath to the worlds on screen.",
    path: "/",
    image: "/social.png",
  }),
);
// One page per project, so a shared link previews that project and opens it.
for (const project of projects) {
  const share = `/media/share/${project.id}.jpg`;
  await mkdir(`dist/work/${project.id}`, { recursive: true });
  await writeFile(
    `dist/work/${project.id}/index.html`,
    page(template, {
      title: `${project.tagline} — Aditya Dudeja`,
      socialTitle: `${project.tagline} — Aditya Dudeja`,
      description: project.description,
      path: `/work/${project.id}`,
      image: (await exists(`public${share}`)) ? share : "/social.png",
    }),
  );
}
await rm(".ssr", { recursive: true, force: true });
console.log(
  `Prerendered the homepage and ${projects.length} project pages${site ? ` for ${site}` : " (no SITE_URL: preview images use relative URLs)"}.`,
);

// Keep the original site and its relative media URLs available on the same domain.
await copyFile("../legacy_index.html", "dist/legacy_index.html");
await cp("../assets", "dist/assets", { recursive: true });
console.log("Published the preserved legacy page alongside the new homepage.");
