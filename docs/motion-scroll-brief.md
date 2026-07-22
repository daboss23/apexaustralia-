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

---

## 2a. How Seedance 2.0 actually generates this — and what references to give

Seedance does **not** transform your existing 15s website video. It works from:

- **Image-to-video (recommended):** one **starting still image** (a keyframe) + a
  text prompt describing the motion. It animates *from* that image.
- **First + last frame (if available):** set a **start frame** and an **end
  frame** — perfect for "explode → reassemble" (end frame = the whole device,
  hero-lit). Forces a clean landing.
- **Text-to-video:** prompt only, no image — least control over how the device looks.

### References to supply (in priority order)
1. **A clean product still of the T-Apex device** — sharp, dark or transparent
   background. This makes the machine in the ride *your actual product*, not a
   hallucination. Use as the **start frame**.
2. **A frame grab from your 15s top video** — locks lighting/colour so the ride
   blends seamlessly out of the existing hero footage. Use for style continuity.
3. **A "whole device, hero-lit" still** — use as the **end/last frame** so the
   reassembly lands on-brand.

> No clean product still? Grab a single frame from the dismantle clip and send it
> over — any frame can be extracted with:
> `ffmpeg -i clip.mp4 -vf "select=eq(n\,0)" -frames:v 1 frame.png`

### Global settings (apply to every shot)
- **Aspect:** 16:9 · **fps:** highest available (60 > 30 > 24) — more fps = smoother scrub.
- **Duration:** the **longest** the tool allows per clip.
- **Camera speed:** *constant / linear* — **no ease-in or ease-out** (the scroll
  supplies the pacing; built-in easing double-eases and feels wrong).
- **Negative prompt (paste every time):**
  `text, watermark, logo, letterboxing, cuts, jump cut, scene change, camera
  shake, strobing, flicker, warping geometry, melting, extra limbs, people
  crowd, ui, hud, subtitles, whole-frame motion blur`

---

## 2b. The "inside a ride" prompt library

Ride feel = **POV forward motion + acceleration + speed cues + threading through
the machine's core + g-force settle.** Generate these three back-to-back; I'll
retime and stitch them into one continuous scrub.

### 🎬 Shot A — LAUNCH / approach (the ride starts)  ~ first 3s
*Start frame: wide product still. Goal: the viewer feels strapped in and
accelerating toward the machine.*
```
First-person POV flying forward through a dark aerospace hangar toward a
futuristic matte-black intelligent resistance-training device suspended in a
shaft of hard rim light. The camera accelerates smoothly forward, low to the
ground, as thin electric-blue light streaks (#00AEEF) rush past on both sides
like a launch tunnel. Fine volumetric haze, floating dust catching the light,
subtle red hazard glints (#D61F26) on the machined metal. Depth of field racks
from soft to sharp as we close in. Constant forward velocity, single continuous
camera move, no cuts. Photoreal, motorsport-grade product film, cinematic
anamorphic lens, 60fps.
```

### 🎬 Shot B — THREAD THROUGH THE CORE (the drop)  ~ middle 3–4s  ⭐ hero moment
*The centrepiece. The device blows apart and the camera flies straight through
the exploded core — the "you're inside it" beat.*
```
Continuous first-person POV flying straight INTO and THROUGH a matte-black
resistance-training device as it explodes into its individual machined
components in mid-air. Each part — housing, actuator, cable drum, circuit
boards, cooling fins — separates and floats outward, traced by glowing
electric-blue energy filaments (#00AEEF) and faint red data lines (#D61F26).
The camera threads through the gap at the centre of the exploded machine, parts
rushing past the lens on all sides at speed, motion streaks and light trails
implying g-force, sparks of blue plasma, volumetric god-rays through the
floating parts. Deep dark studio void background. Constant high forward
velocity, one unbroken camera move, no cuts, no scene change. Hyper-detailed,
photoreal, cinematic, anamorphic bloom, 60fps.
```

### 🎬 Shot C — REASSEMBLE / arrive (the ride settles)  ~ last 3s
*End frame: whole device, hero-lit. Camera decelerates and the machine snaps
back together in front of you.*
```
First-person POV emerging on the far side of the exploded machine into a clean
dark studio. The floating machined components smoothly fly back together and
reassemble into the complete matte-black resistance-training device, hero-lit
with a hard blue rim light (#00AEEF) and a single red accent (#D61F26). The
camera glides forward and gently settles to a stop, centring the fully
assembled device as light blooms off its edges. Lingering haze, faint
electric-blue afterglow. Constant then softly settling camera, one continuous
shot, no cuts. Photoreal, premium product reveal, cinematic, 60fps.
```

### Directing tips that make or break the ride
- **Keep the device centred** — the site zooms toward frame-centre, so anything
  centred gets the "flying into it" payoff; off-centre subjects drift out.
- **Say "POV" and "through," not "orbit"** — orbiting reads as a turntable, not a
  ride. You want forward penetration of the frame.
- **Speed streaks + haze = velocity.** Without particles/streaks, fast camera
  moves read as empty. Always ask for them.
- **One move per clip.** If Seedance adds a cut or a whip-pan, regenerate — cuts
  destroy the scrub. Lower the "motion" / "camera dynamics" slider if it over-cuts.
- **Match exposure across A/B/C** so they stitch invisibly (same rim-light
  direction, same background darkness). Feeding the same style reference to all
  three helps a lot.

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
