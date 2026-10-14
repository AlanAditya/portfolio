# Verification — 14 October 2026

- Production build and strict TypeScript check: passed.
- Complete prerendered HTML: verified for Work, About, Playground, and Contact.
- Local asset references: 11 referenced paths checked against the built output; no missing assets.
- Browser layouts checked at 1200, 768, 390, and 325 CSS pixels; no horizontal document overflow at the measured widths.
- Mobile menu opens and closes after navigation.
- Project filters: all work = 4, machine learning = 2, graphics & systems = 1, robotics = 1.
- Project dialogs open; Escape closes them; focus returns to the originating project button.
- Production hand-tracking video reached readyState 4 with no media error.
- Playground: sphere/wave changes, keyboard density adjustment, pause/resume states verified.
- Expandable project archive: verified.
- Browser warning/error log: empty during production interaction checks.
- Build output JavaScript: 78,308 bytes gzip. CSS: 6,243 bytes gzip. These are transfer-size measurements, not Lighthouse or field Core Web Vitals scores.
- Original root index.html SHA-256 before and after: b88b8ea00a84979847d151819a797b02a9fc5934b9375feaf15a229b11c0ffc3.

Screenshots: desktop.jpg and mobile.jpg. No live Vercel deployment was performed. GitHub destinations were retained from the original site; outbound repository availability was not independently audited.

## Dark theme follow-up

Added a persistent light/dark toggle, first-visit system preference, and pre-paint theme initialization. Browser checks confirmed #000000 background and #FFFFFF foreground in dark mode, restoration of the original light palette, persistence after reload, and no horizontal overflow at 325 CSS pixels. Canvas palettes respond to theme changes, including paused scenes. Production build and TypeScript check passed.
