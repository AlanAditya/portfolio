# Aditya Dudeja — engineering, made tangible

## Direction

An independent engineering studio, with the clarity of a technical field guide and the confidence of an editorial portfolio. Personal identity precedes project detail. Warm paper, ink, signal orange. Large, tightly tracked sans serif headlines meet small monospace annotations. Hairline rules, intentional negative space, small index numbers. Avoid generic dashboard cards and decorative gradients.

## Composition

1. Compact wordmark and persistent navigation: work, about, playground, contact.
2. Editorial hero: “Curiosity. Built from scratch.” paired with a large interactive point-cloud sculpture. Name, institution and engineering focus are explicit.
3. Selected work: substantial project imagery and concise outcomes. Category filters and accessible case-study dialogs with actual supplied technical evidence and source links.
4. Personal profile: motivations grounded in the existing portfolio, tools, education, and progression from sensors and servos to GPU computing.
5. Playground: an interactive point-cloud laboratory with shape and motion controls; clearly described as a browser visualization, distinct from benchmarked native work.
6. Additional projects and an inviting GitHub contact destination. No fabricated email, résumé, jobs, or availability claims.

## Interaction and performance

Use React + TypeScript + Vite. Prerender the complete public page at build time; hydrate interactive controls. Draw the 3D particle projection directly in a small Canvas 2D implementation. Respond to pointer input without component re-renders. Cap density and device pixel ratio, stop animation offscreen and in hidden tabs, honor reduced motion, expose a pause control. Project cards play short muted looping clips in place (started only while on screen, paused offscreen, still under reduced motion); the larger controllable videos live in the case study dialog. Use local fonts and local image assets. No third-party trackers or runtime requests.

## Layout and access

Desktop: 12-column feel, generous 48–72 px margins, approximately 1440 px maximum width. Mobile: deliberate single-column composition, compact navigation, minimum 44 px controls, no hover-only information. Semantic sections, keyboard focus, native modal dialogs, readable contrast, skip navigation, and reduced-motion styles.

## Content provenance

Name, BITS Pilani Goa, project descriptions, measurements and repository URLs come from ../legacy_index.html. Keep that file byte-for-byte unchanged. Exclude the original placeholder speedups. Preserve benchmark caveats in case studies.
