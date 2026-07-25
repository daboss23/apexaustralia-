# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` (14.6s, 24fps, 1280×720) —
> a **master edit cut from three source clips**, extracted at `fps=14`,
> `scale=1152` → **205 frames, 8.6 MB**.
>
> It now covers nearly the whole storyboard: sprinter → machine → panels open →
> fly-through the internals → HUD → hero device. See §6 for how it was cut and
> what's still missing.

---

## 1. What the scroll experience does

As the visitor scrolls the hero (~3 viewport-heights ≈ **~15 seconds**
unhurried), in four acts:

- **ACT 0 — HOLD (0–12%).** Pure black. *TRAIN BEYOND HUMAN LIMITS* alone on the
  plate, no film, no motion. (This doubles as the loading state: scrubbing is
  armed once the first 40 frames decode, the rest stream in behind.)
- **ACT 1 — SPLIT (12–40%).** The headline parts — `TRAIN BEYOND` rises, `HUMAN
  LIMITS` drops — tracking wider as it goes, and a blue seam opens across the
  gap. The film is revealed *by* the split: a `clip-path` aperture unclips
  vertically from that seam while fading up, so the video appears to be let
  through by the type rather than cross-faded under it.
- **ACT 2 — TRAVEL (10–97%).** Frames scrub to scroll while the camera adds a
  whisper of push (`1.0 → 1.1` — the film does its own flying now) and a tunnel
  vignette breathes in. The halves clear at 34% so nothing sits on the
  panels-open reveal. The telemetry HUD (Force / Velocity / Response / Control)
  fades in over the fly-through, **flanked left and right**, not centred.
- **ACT 3 — RESOLVE (85–100%).** A scrim dims the machine so *ENGINEERED FOR THE
  NEXT TENTH OF A SECOND* + CTAs read cleanly over the trackside hero shot.

### Where the content sits (scroll progress → shot)

The film scrubs across `0.10 → 0.97`, so `frame ≈ (p − 0.10) / 0.87 × 205`:

| Progress | On screen |
|---|---|
| 0.10–0.29 | sprinter charges camera, turns to blue energy, runs the rope |
| 0.29–0.46 | ✦ **panels split open along the seams** — the money shot |
| 0.46–0.72 | fly-through: circuit macro, copper traces, cable spool + gears |
| 0.72–0.84 | HUD panels of athletes wrapped in red/blue energy |
| 0.84–0.97 | out to the hero device, trackside, T-APEX branding |

**Two layout rules this footage forces:**

1. **Nothing goes on screen between 29% and 46%.** The panels-open reveal is the
   centrepiece; the headline halves are timed to clear before it.
2. **Copy can't just sit on the film any more.** Unlike the old black plate,
   this cut has a mean luma of 43–85. `.cine-dim` is therefore scheduled like a
   lighting cue — it lifts under every copy beat (0.40 / 0.46 / 0.66) and drops
   between them (0.08 / 0.12) so the film plays at full strength exactly when
   nothing is written over it. If you recut the footage, **re-measure the luma
   and re-time that cue** — it's the difference between premium and mush:
   ```bash
   ffmpeg -v error -i master.mp4 -vf "fps=14,signalstats,\
     metadata=print:key=lavfi.signalstats.YAVG:file=-" -an -f null -
   ```

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

1. Cut your clips into one master (see §6 for the current recipe) at
   `public/apex-hero-cinema.mp4`.
2. Extract a frame sequence (ffmpeg):
   ```bash
   rm -f public/hero-frames/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=14,scale=1152:-1" -f image2 -c:v libwebp -quality 72 \
     public/hero-frames/frame-%03d.webp
   ```
3. Update the frame count in `src/components/ScrollCinemaHero.tsx`:
   ```ts
   const FRAME_COUNT = <number of files in public/hero-frames>
   ```
4. Re-measure luma and re-time the `.cine-dim` cue (see §1).
5. `npm run build` to verify, then commit `public/hero-frames/` + the component.

### Sizing the sequence — the real trade-off
Frame **count** sells smoothness far more than frame **resolution**: the scrub
is a temporal effect, and a soft frame in motion reads fine where a chunky one
does not. So when the budget gets tight, drop `scale` before you drop `fps`.

Current: 205 frames @ 1152px / q72 = **8.6 MB**. For reference on this footage —
`fps=15 scale=1280 q78` → 12.2 MB, `fps=13 scale=960 q70` → 6.5 MB.

That weight is desktop-only (phones get `<Hero />` and never fetch a frame) and
loads progressively — only `READY_FRAMES` (36) gate the start of scrubbing, and
a frame that hasn't decoded holds the previous one rather than flashing black.
Keep the total under ~10 MB.

### Optional tuning knobs (top of `ScrollCinemaHero.tsx`)
- `PIN_DISTANCE` — `'+=3000'` px of scroll = how long the hero stays pinned.
  Keep it at roughly **15 px of scroll per frame** or the scrub changes feel.
- `ZOOM_START` / `ZOOM_END` — extra push-in (`1.0 → 1.1`). Keep this small when
  the footage already flies; the two motions fight otherwise.
- `SPLIT_TRAVEL` — how far the headline halves part (`0.34` of viewport height).
- Beat timings — the position values in the timeline map to scroll progress
  (0–1); shift them to re-choreograph when copy appears.

---

## 4. Fallbacks (already handled)
- **Phones (< 1024px)** and **`prefers-reduced-motion`** users get the classic
  `<Hero />` — no pin, no scrub — so the site stays fast and accessible.
- Frames **preload** in the background; Act 0 is black-and-type by design, so it
  covers the load. Scrubbing arms at `READY_FRAMES` (40) and a frame that hasn't
  decoded yet holds the previous one rather than flashing black.

---

## 5. Storyboard coverage

| # | Shot | Status |
|---|------|--------|
| 1 | Camera moves toward the T-Apex | ✅ covered (source **C**, sprinter runs the rope into it) |
| 2 | Panels split and open along the seams, glowing internals revealed | ✅ covered (source **A**) |
| 3 | Fly-through of the interior — cable spool, machined gears meshing, taut red cable, circuit-lined walls | ✅ covered (source **C**) |
| 4 | Bank up, burst out the top into black space, dissolve to a scanning-grid HUD tunnel | ⚠️ **not used.** Source A has a light-tunnel and a warp streak, but placing them mid-fly-through costs two more joins for a beat the cut doesn't need — the circuit→gears run already carries that stretch |
| 5 | Performance centre — sprinter at camera, follow the electric rope, settle on the device trackside | ✅ covered, but **at the front** rather than the end (see below) |

**The one deliberate departure from the storyboard:** you wanted the performance
centre last. Source C shoots it first, and putting the athlete first is the
better page anyway — you open on a human (relatable), go inside the machine
(proof), and come out on the product (the thing to buy). Reversing it would cost
two extra joins to land somewhere weaker. The film still *ends* trackside, on the
hero device with the T-APEX branding, so the location bookends itself.

---

## 6. How the master is cut

Three sources, two dissolves. Both joins were chosen where the outgoing and
incoming frames already rhyme, so the blend reads as one continuous camera move
rather than an edit:

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | **C** (`…101435_Lumina_1`) | 0.30–3.60 | sprinter → blue energy → rope to the machine |
| 2 | **A** (`hf_20260722_125532…`) | 1.85–4.75 | panels split open, internals, slow push |
| 3 | **C** | 5.40–14.80 | circuit macro → spool + gears → HUD athletes → hero device |

```bash
ffmpeg -y -i C.mp4 -i A.mp4 -i C.mp4 -filter_complex "\
[0:v]trim=0.30:3.60,setpts=PTS-STARTPTS,fps=24[v0];\
[1:v]trim=1.85:4.75,setpts=PTS-STARTPTS,fps=24[v1];\
[2:v]trim=5.40:14.80,setpts=PTS-STARTPTS,fps=24[v2];\
[v0][v1]xfade=transition=fade:duration=0.5:offset=2.8[x1];\
[x1][v2]xfade=transition=fade:duration=0.5:offset=5.2[x2]" \
-map "[x2]" -an -c:v libx264 -crf 15 -preset slow -pix_fmt yuv420p master.mp4
```

`xfade`'s `offset` is measured on the *incoming* chain, so each one is
`(length so far) − (dissolve duration)`.

**Why these two joins work, and how to pick more:**
- **Join 1** cuts device→device. Both sides are a centred machine in a dark hall
  under red neon, so the dissolve reads as the panels *opening*, not as a cut.
- **Join 2** cuts interior→interior. Both sides are blue-lit macro circuitry, so
  it reads as the camera diving deeper into the board. It's essentially
  invisible.
- The rule: **dissolve between frames that already share subject, scale and
  palette.** A dissolve between mismatched frames is just a slow cut, and a
  scrub makes that worse than a hard one, not better.

### Checking a source before you cut it
Scene-detect first — a hard cut mid-segment will wreck the scrub:
```bash
ffmpeg -v error -i clip.mp4 -vf "select='gt(scene,0.2)',metadata=print:file=-" \
  -an -f null - 2>&1 | grep pts_time
```
Of the three sources, **C is continuous across all 15s** (one 0.17-score blip at
t=12.0), which is why it carries two of the three segments. A cuts at t≈4.8–5.25
(the warp) and B cuts at t≈10.8 — both were trimmed to avoid those.

### Unused footage worth revisiting
- **Source B** (`…101635_Lumina_1`, 15s) is a near-twin of C: same hall, same
  beats, one hard cut at 10.8s. Nothing in it beats C, but it's a fallback if C
  ever needs replacing.
- **Source A, 0–1.8s** — the red/blue light-tunnel corridor. This is the
  scanning-grid/HUD-tunnel beat from the storyboard. If you ever want scene 4,
  this is the shot; budget a join either side of it.
- **The original black-plate clip** (T-Apex with ghost athletes) is no longer in
  the repo — it was replaced by this master. It's still in the upload history if
  another section wants it.

**Constraints for anything new you generate:**
- **One continuous move, no hard cuts.** Scrubbing amplifies every jump.
- **Constant camera speed** — the scroll supplies the pacing.
- **No on-screen text** — all copy is live HTML over the top.
- Watch the luma: bright footage forces the `.cine-dim` cue to work harder and
  leaves less room for copy.
