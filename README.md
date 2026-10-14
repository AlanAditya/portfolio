# Aditya Dudeja — portfolio

The new personal portfolio lives in [`portfolio/`](portfolio/README.md). It is built with React, TypeScript, and Vite, with prerendered HTML for static delivery on Vercel.

```sh
cd portfolio
npm ci
npm run dev
```

The repository-root [`vercel.json`](vercel.json) builds the new portfolio automatically. Import the repository into Vercel with the repository root selected; the output directory is `portfolio/dist`.

## Original reference

The original `legacy_index.html` preserves the original page unchanged, alongside its original `assets/` and `portfolio_assets/`. Open that file separately to consult the earlier project-focused site. Its placeholder speedups are not used in the new portfolio.

See [`portfolio/README.md`](portfolio/README.md) for production builds, deployment configuration, content editing, and accessibility/performance details. See [`portfolio/DESIGN.md`](portfolio/DESIGN.md) for the design direction.
