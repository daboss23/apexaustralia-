# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> The mechanism is already live on a **placeholder** (frames extracted from
> `public/hero-banner.mp4`). Everything below is about replacing that placeholder
> with purpose-built footage so the "travel through the machine" reads perfectly.

---

## 1. What the scroll experience does

As the visitor scrolls the hero (~1.8 viewport-heights ≈ **~8 seconds** unhurried):

1. **Frames scrub to scroll** — the film advances frame-by-frame with scroll, not
   on a timer. Buttery, no video stutter.
2. **The camera pushes IN** (scale `1.02 → 1.62`) — the "travel through the
   machine" dolly. A tunnel vignette closes in to sell the fly-through.
3. **Three copy beats** resolve over the top:
   - **Beat 1 (0–22%):** *TRAIN BEYOND HUMAN LIMITS* — peels away as we push in.
   - **Beat 2 (34–60%):** live telemetry HUD (Force / Velocity / Response / Control).
   - **Beat 3 (74–100%):** *ENGINEERED FOR THE NEXT TENTH OF A SECOND* + CTAs.

The single most important property of the footage: it must be a **slow,
continuous, single-motion push** with **no hard cuts** — scrubbing amplifies any
jump. Think one uninterrupted camera move.

---

## 2. The ideal footage (what to generate)

**One continuous ~8–12s clip**, 16:9, that tells this arc in a single dolly move:

| Time | On screen |
|------|-----------|
| 0.0–3.0s | Wide: the T-Apex device on/at an elite athlete, dark aerospace studio. Camera begins a slow push toward the device. |
| 3.0–6.0s | We reach the device — it **dismantles / explodes into components** (your dismantle clip). Camera continues *through* the exploded parts. |
| 6.0–9.0s | On the far side, the components **reassemble** into the whole device, hero-lit, as the camera settles. |

This maps 1:1 onto the three beats. If you can only make shorter clips, generate
the three segments separately and I'll stitch + retime them.

### Look / art direction (keep on-brand)
- **Palette:** near-black `#050505` surfaces, electric blue `#00AEEF` signal light,
  performance red `#D61F26` accents. Cool, engineered, motorsport/aerospace.
- **Lighting:** hard rim light, volumetric haze, subtle lens bloom on metal edges.
- **Motion:** slow, weighty, deliberate. Constant velocity (no ease in/out in the
  source — the scroll provides the pacing).
- **Framing:** device kept near centre (the push-in zooms toward centre).
- **No on-screen text** — all copy is live HTML over the top.

### Higgsfield prompt (starter)
```
Cinematic slow dolly push-in toward a futuristic matte-black intelligent
resistance training device, elite athlete in a dark aerospace studio, hard rim
lighting, electric blue accent glow (#00AEEF) and red performance highlights,
volumetric haze, shallow depth of field, anamorphic bloom, ultra-detailed
machined metal, 8s continuous camera move, constant speed, no cuts, 24fps,
photoreal, motorsport-grade product film.
```

### Seedance 2.0 prompt (dismantle / travel-through — your idea)
```
A precision matte-black training device slowly explodes into its individual
machined components mid-air, camera flies forward through the floating exploded
parts, electric-blue energy tracing each part, dark studio, volumetric light,
then the parts smoothly reassemble into the complete device, one continuous
shot, constant camera speed, no cuts, photoreal, cinematic, 24fps.
```

**Seedance tips for scrubbing:** ask for *constant camera speed*, *no cuts*,
*no motion blur on the whole frame* (per-object is fine), and the **longest
duration** the tool allows. Higher fps source = smoother scrub.

---

## 3. How to drop footage into the pipeline

The site scrubs a **numbered WebP image sequence** in `public/hero-frames/`
(`frame-001.webp … frame-NNN.webp`), NOT a video file. To swap footage:

1. Put your new clip at `public/new-hero.mp4`.
2. Extract a frame sequence (ffmpeg). ~100–160 frames is the sweet spot:
   ```bash
   rm -f public/hero-frames/*.webp
   ffmpeg -y -i public/new-hero.mp4 \
     -vf "fps=12,scale=1280:-1" -f image2 -c:v libwebp -quality 78 \
     public/hero-frames/frame-%03d.webp
   ```
   - `fps=12` → longer clips = more frames; aim for **120–160 total**.
   - `scale=1280` keeps each frame ~20–30 KB; the whole set preloads (~4 MB).
3. Update the frame count in `src/components/ScrollCinemaHero.tsx`:
   ```ts
   const FRAME_COUNT = <number of files in public/hero-frames>
   ```
4. `npm run build` to verify, then commit `public/hero-frames/` + the component.

### Optional tuning knobs (top of `ScrollCinemaHero.tsx`)
- `PIN_DISTANCE` — `'+=1750'` px of scroll = how long the hero stays pinned
  (raise for a slower, longer travel).
- `ZOOM_START` / `ZOOM_END` — the push-in strength (`1.02 → 1.62`).
- Beat timings — the `0.34`, `0.6`, `0.74` position values in the timeline map to
  scroll progress (0–1); shift them to re-choreograph when copy appears.

---

## 4. Fallbacks (already handled)
- **Phones (< 1024px)** and **`prefers-reduced-motion`** users get the classic
  `<Hero />` — no pin, no scrub — so the site stays fast and accessible.
- Frames **preload** behind a minimal "Initialising" veil so scrubbing never
  waits on network.

---

## 5. Your one-day AI-video shortlist (priority order)
1. **The travel-through/dismantle clip** (Seedance) — the hero moment. Longest,
   highest-fps continuous shot you can get.
2. A **clean wide push-in** on the device (Higgsfield) — the opening 3s.
3. A **reassembly** beauty shot — the closing 3s.

Send me any of these and I'll extract, retime, and wire them in.
