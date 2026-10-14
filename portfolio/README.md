# Aditya Dudeja — personal portfolio

A personal portfolio built with React, TypeScript, and Vite. Warm editorial typography, an interactive point-cloud sculpture, filterable work, video case studies, a personal profile, and an interactive geometry playground.

The original `../legacy_index.html`, `../assets/`, and `../portfolio_assets/` are preserved. All new application code lives in this directory.

## Run locally

Use Node.js 22.12+ or a current supported LTS release.

```sh
cd portfolio
npm ci
npm run dev
```

Open the URL printed by Vite. To verify the production output:

```sh
npm run build
npm run preview
```

The build type-checks the app, creates the client bundle, then prerenders the full page into `dist/index.html`. It needs no server, environment variables, API keys, or database. The public page content is present before JavaScript loads; controls are activated by React hydration.

## Deploy to Vercel

Import the **repository root** into Vercel. The root `vercel.json` already configures:

- Install: `npm --prefix portfolio ci`
- Build: `npm --prefix portfolio run build`
- Output: `portfolio/dist`
- Static delivery, with immutable caching for Vite's fingerprinted assets.

Keep Vercel's Root Directory at the repository root and Framework Preset at **Other** (the configuration sets `framework: null`). The preserved original is also deployed at `/legacy_index.html`, with its original media.

If deploying just this subdirectory instead, use Vite as the preset, `npm ci`, `npm run build`, and `dist` as the output directory.

No live deployment is required to preview or edit this project.

## Edit the content

- `src/data.ts`: selected projects, descriptions, measurements, media, and repository URLs.
- `src/App.tsx`: profile, navigation, contact destination, and section structure.
- `src/style.css`: responsive layout, colours, typography, and motion preferences.
- `src/PointCloud.tsx`: the lightweight 3D projection used by the hero and playground.
- `DESIGN.md`: the design direction and content decisions.

The supplied site only included a GitHub profile. The contact action therefore goes to GitHub; no email, LinkedIn account, résumé, employment, or availability has been invented. Add those details when ready.

## Assets and performance

Project images are local WebP files. Fonts are locally hosted, with their open-source licenses included. Videos only mount when a case study is opened; none autoplay. The point cloud uses Canvas 2D projection, capped at roughly 30 FPS and a 1.7 device-pixel ratio, without a Three.js dependency. It skips drawing offscreen, in hidden tabs, when paused, and under reduced motion unless a redraw is needed.

The website sculpture is an illustrative browser experiment. Native project measurements belong to the supplied project recordings, and case studies preserve benchmark limitations.

To regenerate optimized images, font copies, and the social preview from the supplied sources:

```sh
npm run prepare:assets
```

This command reads the original `../assets/` files without modifying them. Optimized assets are checked in so normal deployments only need `npm run build`.

## Accessibility

Semantic landmarks, a skip link, visible keyboard focus, a responsive keyboard-operable menu, native modal dialogs with Escape dismissal and focus restoration, labelled controls, non-autoplay recordings, and reduced-motion support. Shape selection and density are keyboard accessible.

## Formatting

```sh
npm run format
```
