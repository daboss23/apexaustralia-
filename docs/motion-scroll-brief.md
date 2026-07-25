# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` (8.0s, 24fps, 1280×720) —
> the T-Apex on a black plate with holographic athletes (sprinter, footballer,
> tennis) passing through, red/blue light streaks, settling on a hero device
> shot. Extracted at `fps=18` → **145 frames**.
>
> Because it's shot on pure black it fades into the page seamlessly, which is
> what makes the Act-1 aperture reveal work. It is **not** a fly-through: the
> camera barely moves and the device holds dead-centre for the whole clip.
> See §6 for the shots still missing from the full storyboard.

---

## 1. What the scroll experience does

As the visitor scrolls the hero (~2.1 viewport-heights ≈ **~10 seconds**
unhurried), in four acts:

- **ACT 0 — HOLD (0–12%).** Pure black. *TRAIN BEYOND HUMAN LIMITS* alone on the
  plate, no film, no motion. (This doubles as the loading state: scrubbing is
  armed once the first 40 frames decode, the rest stream in behind.)
- **ACT 1 — SPLIT (12–40%).** The headline parts — `TRAIN BEYOND` rises, `HUMAN
  LIMITS` drops — tracking wider as it goes, and a blue seam opens across the
  gap. The film is revealed *by* the split: a `clip-path` aperture unclips
  vertically from that seam while fading up, so the video appears to be let
  through by the type rather than cross-faded under it.
- **ACT 2 — TRAVEL (12–96%).** Frames scrub to scroll while the camera pushes in
  (`1.0 → 1.18` — gentle, the source already dollies) and a tunnel vignette
  closes. The two headline halves stay parked top and bottom, framing the film.
  The telemetry HUD (Force / Velocity / Response / Control) fades in **flanked
  left and right**, not centred — see the layout note below.
- **ACT 3 — RESOLVE (74–100%).** A scrim dims the machine to a ghost so
  *ENGINEERED FOR THE NEXT TENTH OF A SECOND* + CTAs read cleanly.

**Layout note (important):** the current clip keeps the device dead-centre for
its whole run, so *any* centred mid-scroll copy lands on top of it and turns to
mush. Hence the flanking HUD columns and the Act-3 scrim. If you replace the
footage with a genuine fly-through (where the machine opens out and clears
frame), both workarounds can be dropped and copy can return to centre.

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
- Frames **preload** in the background; Act 0 is black-and-type by design, so it
  covers the load. Scrubbing arms at `READY_FRAMES` (40) and a frame that hasn't
  decoded yet holds the previous one rather than flashing black.

---

## 5. Your one-day AI-video shortlist (priority order)
1. **The travel-through/dismantle clip** (Seedance) — the hero moment. Longest,
   highest-fps continuous shot you can get.
2. A **clean wide push-in** on the device (Higgsfield) — the opening 3s.
3. A **reassembly** beauty shot — the closing 3s.

Send me any of these and I'll extract, retime, and wire them in.

---

## 6. The full storyboard vs. what we have

The scroll *mechanism* can drive any of this — it is footage, not code, that
gates the rest. The full five-scene idea needs roughly five separate generated
clips, stitched into one continuous move before extraction:

| # | Shot | Status |
|---|------|--------|
| 1 | Camera pushes toward the T-Apex on black | ✅ **have it** — `apex-hero-cinema.mp4` opens on this |
| 2 | Panels split and open along the seams, glowing internals revealed | ❌ needs generating |
| 3 | Fly-through of the engine interior — red cable spool spinning, machined gears meshing, taut red cable threading, circuit-lined walls pulsing blue/red, sparks, macro detail + motion blur | ❌ needs generating (the hardest shot; likely 2 clips) |
| 4 | Bank upward, burst out the top into black space, dissolve into a red-and-charcoal scanning grid / HUD tunnel | ❌ needs generating |
| 5 | Land inside a performance centre — sprinter running at camera on the T-Apex, camera follows the electric red rope, settles on the device trackside with electrical frequency arcing around it | ❌ needs generating |

**Constraints that matter when generating these:**
- **One continuous move, no hard cuts.** Scrubbing amplifies every jump — a cut
  reads as a glitch, not an edit. Where two clips must join, join them on a
  matched push (same direction, same speed) so the seam disappears.
- **Constant camera speed.** Don't let the generator ease in/out; the scroll
  supplies the pacing.
- **Keep it on black wherever possible.** It's what lets the film dissolve into
  the page instead of sitting in a box.
- **Budget ~2.5–3s per scene.** Five scenes ≈ 13–15s ≈ 240–270 frames at
  `fps=18`, ~6–7 MB of WebP. That's near the ceiling for a preloaded sequence —
  past it, drop to `fps=14` or shorten scenes rather than lowering resolution.
- **No on-screen text** — all copy is live HTML over the top.

Until scenes 2–5 exist, the hero runs the four-act cut described in §1, which
uses the single clip we have honestly rather than faking a fly-through.
