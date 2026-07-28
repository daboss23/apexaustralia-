# CLAUDE.md

Guidance for Claude Code (and any AI session) working in this repository.

> `README.md` is the short human-facing overview; **this file is the working
> guide** for conventions and architecture. Keep both in sync with the `src/`
> source, which is the source of truth.

## What this is

**T-APEX Australia** — a premium, single-page marketing/landing site for T-Apex,
an intelligent resistance training device ("Adaptive Resistance Intelligence")
aimed at elite sports-performance facilities and coaches. The aesthetic is
motorsport / Formula-1 / aerospace: dark, engineered, with telemetry-HUD detail.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** for styling, **Framer Motion 11** for animation
- **Static export** (`next.config.mjs` → `output: 'export'`, images unoptimized)
- Deployed on **Vercel** (`vercel.json`; build → `out/`)
- Fonts via `next/font/google` (configured in `src/app/layout.tsx`)

## Commands

```bash
npm install        # install deps
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build + static export to out/  (run this to verify changes)
npm run start      # serve a production build
npm run lint       # next lint
```

Always confirm a change with `npm run build` — the static export must succeed.

## Structure

```
src/
  app/
    layout.tsx     # root layout: fonts (next/font), <html>/<body>, metadata/SEO
    page.tsx       # the whole page — imports & orders the section components
    globals.css    # global styles + the metallic typography system + utilities
  components/       # one component per page section (Hero, ProblemSection, …)
  lib/
    scroll.ts       # shared Lenis handle: scrollToTarget + the scroll lock
public/             # static assets (hero-video.mp4, logos, images)
  hero-frames/        # desktop scroll-cinema sequence (318 @ 1600x900)
  hero-frames-mobile/ # phone sequence (159 @ 640x360)
tailwind.config.ts  # design tokens (apex.* colors), font families, keyframes
```

The site is assembled in `src/app/page.tsx`. Section order (with the conversion
flow) lives there as comments. Note: `TechnologySection.tsx` is imported as
`HowItWorksSection`. A couple of component files (`WhoItsForSection`,
`SportTransitionStage`) are not wired into `page.tsx` directly.

Most section components are client components (`'use client'`) using Framer
Motion `useInView` / scroll transforms for reveal animations.

## Design tokens (`tailwind.config.ts`, prefix `apex.`)

- **Accent red** `#D61F26` (`red-bright #ff3b30`, `red-deep #9c0f0d`) — CTAs / output
- **Accent blue** `#00AEEF` — the "technology signal" / emphasis colour
- **Surfaces** black `#050505`, surface `#0D1117`, panel/carbon `#131820`, line `#2A3038`
- **Text** white `#F5F7FA`, grey `#b0b6c1` (body), grey-dim `#757b85` (microcopy)
- **Font families**: `font-display`/`font-body` = Inter · `font-luxia` = Marcellus · `font-mono` = JetBrains Mono

## ⭐ Typography system — the most important convention

The headline look is a **centralized, metallic, gradient-clipped type system in
`src/app/globals.css`**. Editing it there restyles every headline on the site at
once (the classes are used across ~17 components). Prefer changing the shared
classes over per-component overrides.

- `.h-luxia` — display headline font = **Marcellus** (elegant high-contrast serif),
  with positive letter-spacing so uppercase words don't merge.
- Metallic finishes (each = a multi-stop vertical `linear-gradient` clipped to the
  text via `background-clip: text` + a bevel `text-shadow`):
  - `.t-silver` — honed "silvery stone" (pewter/granite) with a faint speckle
    texture; primary headline words.
  - `.t-red` — bright saturated scarlet (performance red).
  - `.t-blue` — vivid electric blue, tuned to the brand `#00AEEF`.
  - `.t-feature` — lighter silver for smaller card / feature titles.

Headlines are typically `<h2 class="h-luxia ..."><span class="t-silver">…</span>
<span class="t-red">…</span></h2>` with the words in UPPERCASE.

**Tuning tips** (learned the hard way):
- A clipped gradient *averages* its stops, so to read brighter you must lift the
  stops, not just the top — and avoid both near-black bands (look dull) and
  near-white bands (look washed-out). Keep colours saturated.
- Marcellus ships only weight 400; `font-bold`/`font-black` on it is browser-faux-bold.

## CTA / closing-banner convention

Short closing / reassurance banner sentences (next to a CTA button) use **Inter,
bold, white, with a blue emphasis phrase** — NOT the metallic serif:

```tsx
<p className="font-display font-black text-apex-white leading-tight">
  This is not just another sprint tool. It is an{' '}
  <span className="text-apex-blue">Adaptive Resistance Intelligence system</span>{' '}
  for elite performance programs.
</p>
```

Keep these banners congruent with each other.

## Other reusable bits in `globals.css`

`.cta-glow` (primary red CTA button with sweeping shine), `.grain`,
`.carbon-weave`, `.brushed-metal`, `.hud-scanlines`, `.glow-red`. Corners are
mostly square (`borderRadius: 0`). All animation respects
`prefers-reduced-motion`.

## Deployment

Static export → `out/`, hosted on **Vercel**. Merging to `main` publishes the
production (live) site. Feature work happens on `claude/*` branches via PRs.
Live site: **https://apexaustralia.vercel.app/**

## Scrolling, overlays and links — use the shared helpers

`src/lib/scroll.ts` is the single owner of moving and freezing the page. Two
things run on top of the native scroll (Lenis, and GSAP ScrollTrigger's pin), so
anything that writes `window.scrollY` behind their back is a bug you will feel
rather than see.

- **Same-page links are plain `<a href="#section">`.** A delegated listener in
  `SmoothScroll.tsx` catches them and routes them through `scrollToTarget()`.
  Don't use `next/link` for hashes (this is a single-page static export — it just
  adds router churn), and don't add your own click handler.
- **Never `html { scroll-behavior: smooth }`.** The browser and Lenis both write
  the scroll position every frame and the fight is visible.
- **Navbar clearance** comes from the `--nav-h` custom property plus the
  `[id] { scroll-margin-top }` rule in `globals.css`. Lenis reads scroll-margin
  itself, so don't *also* pass an offset — that double-counts.
- **Overlays call `lockScroll()` / `unlockScroll()`**, never
  `body { overflow: hidden }` (iOS Safari scrolls straight through it, and Lenis
  ignores it entirely). The lock is reference-counted, so overlays can stack.
- **Every CTA needs a destination.** The site's conversion point is `#order`.
  A styled `<button>` with no handler looks identical to a working one and is
  invisible in review — the whole site once shipped with seven of them.
- **Stacking order** is documented at the top of `Navbar.tsx`. Portalled modals
  must clear the navbar (150), or it draws over them.

## Mobile

- `useIsMobile()` starts `false` and corrects in an effect. Don't "improve" it by
  reading matchMedia in the initial state — the export is prerendered with
  `false`, and disagreeing on the first client render breaks hydration.
- Heavy `<video>` goes through `<LazyVideo/>`: no `src` until it's near the
  viewport, paused when it leaves, held on frame 1 under reduced motion.
- Form fields are **≥16px on phones** (`text-[16px] sm:text-[...]`). Below that
  iOS Safari zooms the page in on focus and never zooms back out.
- Hover-revealed controls (`opacity-0 group-hover:opacity-100`) need an
  `md:` prefix if they *do* something — a phone never hovers. Decorative glows
  are fine as-is.
- Interactive targets: **≥40px**, ideally 44.

## Conventions for changes

- Match the surrounding code's style; reuse the shared tokens/classes.
- Verify with `npm run build` before committing.
- Don't resurrect or rely on `README.md`.
- Product reference / facts: myt-apex.com.

## Product photos → checkout gallery

Every new product photo the user supplies goes into the **main Core checkout
gallery** (`CheckoutSection.tsx` → `VARIANTS.core.gallery`), in addition to any
other section the user names. The galleries are arrays of
`{ type, src, alt }` slides; `core-hero.webp` leads the Core gallery, the field
hero (`t-apex product 2.webp`) leads the Overspeed gallery. The viewer frame
uses `object-contain`, so source aspect ratio doesn't need to match.

Images live in `public/` (often `public/checkout/`). Because each web session is
a fresh clone, a photo is only visible here once it's **committed and pushed** —
if a referenced image isn't in the working tree, check `origin/main` and other
branches and `git checkout <branch> -- <path>` to pull it in.
