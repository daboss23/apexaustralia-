# T-APEX Australia

Premium, single-page marketing/landing site for **T-Apex** — an intelligent
resistance training device ("Adaptive Resistance Intelligence") for elite
sports-performance facilities and coaches. The aesthetic is motorsport /
Formula-1 / aerospace: dark, engineered, with telemetry-HUD detail.

## Tech stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS 3** · **Framer Motion 11**
- **Static export** (`next.config.mjs` → `output: 'export'`), deployed on **Vercel**
- Fonts via `next/font/google` (Marcellus · Inter · JetBrains Mono)

## Getting started

```bash
npm install     # install dependencies
npm run dev     # local dev server → http://localhost:3000
npm run build   # production build + static export to out/  (use this to verify changes)
npm run start   # serve a production build
npm run lint    # next lint
```

## Project layout

```
src/
  app/
    layout.tsx     # root layout: fonts, metadata/SEO
    page.tsx       # the whole page — orders the section components
    globals.css    # global styles + the metallic typography system
  components/       # one component per page section (Hero, ProblemSection, …)
public/             # static assets (hero-video.mp4, logos, images)
tailwind.config.ts  # design tokens (apex.* colors), font families
```

The site is assembled in `src/app/page.tsx`; each section lives in
`src/components/`. Most are client components using Framer Motion for
scroll-reveal animations.

## Working in this repo

See [`CLAUDE.md`](./CLAUDE.md) for the important conventions — especially the
**centralized metallic typography system** in `src/app/globals.css`
(`.h-luxia` + `.t-silver`/`.t-red`/`.t-blue`/`.t-feature`), the brand design
tokens, and the CTA-banner style. Always confirm changes with `npm run build`.

## Deployment

Static export → `out/`, hosted on **Vercel**. Merging to `main` publishes the
production (live) site; feature work happens on `claude/*` branches via PRs.

---

Product reference / facts: myt-apex.com
