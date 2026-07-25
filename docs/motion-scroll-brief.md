# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` (17.2s, 24fps, 1280×720) —
> a **master edit cut from three source clips**, extracted at `fps=14`,
> `scale=1920` (lanczos + unsharp) → **241 frames at 1920×1080, 15 MB**.
>
> The spine is deliberately simple: **the black-plate scene plays out, then that
> same box opens.** Then fly-through the internals → HUD → hero device. See §6
> for how the one-flow read is bought and §7 for the resolution ceiling.

---

## 1. What the scroll experience does

As the visitor scrolls the hero (~3.7 viewport-heights ≈ **~17 seconds**
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
  vignette breathes in. The halves clear at 33% so nothing sits on the
  box-opening reveal. The telemetry HUD (Force / Velocity / Response / Control)
  fades in over the fly-through, **flanked left and right**, not centred.
- **ACT 3 — RESOLVE (88–100%).** A scrim dims the machine so *ENGINEERED FOR THE
  NEXT TENTH OF A SECOND* + CTAs read cleanly over the trackside hero shot.

### Where the content sits (scroll progress → shot)

The film scrubs across `0.10 → 0.97`, so `frame ≈ (p − 0.10) / 0.87 × 241`:

| Progress | On screen |
|---|---|
| 0.10–0.38 | the **black plate** — device on pure black, holographic athletes running through it. The scene "plays out". |
| 0.38–0.50 | ✦ **that same box opens** — panels split along the seams, internals lit |
| 0.53–0.81 | fly-through: circuit macro, copper traces, cable spool + gears |
| 0.81–0.89 | HUD panels of athletes wrapped in red/blue energy |
| 0.89–0.97 | out to the hero device, trackside, T-APEX branding |

**Two layout rules this footage forces:**

1. **Nothing goes on screen between 38% and 50%.** The box opening is the
   centrepiece; the headline halves are timed to clear just before it starts.
2. **Copy can't just sit on the film any more.** Unlike the old black plate,
   this cut has a mean luma of 43–85. `.cine-dim` is therefore scheduled like a
   lighting cue — it lifts under every copy beat (0.16 / 0.46 / 0.66) and drops
   between them (0.05 / 0.12) so the film plays at full strength exactly when
   nothing is written over it. The **black plate leads deliberately** — it's the
   only near-black footage available, so it's the only thing the Act-1 aperture
   can open onto without the type fighting a lit background. If you recut,
   **re-measure the luma and re-time that cue** — it's the difference between premium and mush:
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
     -vf "fps=14,scale=1920:-1:flags=lanczos,unsharp=5:5:0.7:3:3:0.35" \
     -f image2 -c:v libwebp -quality 70 \
     public/hero-frames/frame-%03d.webp
   ```
   `lanczos` + a light `unsharp` matter: the source is 720p, so these frames are
   upscaled. A good resampler and a touch of sharpening is the difference
   between "soft" and "blurry" — never let the browser do that upscale for you.
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

Current: 241 frames @ 1920px / q70 = **15 MB**. Measured alternatives on this
footage — `1920 q78` → 18.8 MB, `1920 q72 fps13` → 15.1 MB, `1440 q74` → 14 MB,
`1280 q82` → 12 MB, `1600 q68 fps13` → 12.3 MB.

Note the shape of that table: **going from 1440 to 1920 cost only ~2 MB**, because
dropping quality 74 → 70 pays for most of the extra pixels. On this footage that
is a clear win — resolution buys more perceived sharpness than quantisation does,
and q70 shows no banding even on the dark panel gradients (the worst case).

AVIF at 1600px/crf34 measured ~42 KB/frame vs WebP's ~64 KB — about a third
smaller *and* sharper. It was **not** adopted because AVIF decodes considerably
slower than WebP, and a decode stall during a scrub costs smoothness, which is
the more valuable of the two. Revisit if the weight ever has to come down.

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
| 1 | Camera moves toward the T-Apex | ✅ covered (source **V1**, the black plate) |
| 2 | Panels split and open along the seams, glowing internals revealed | ✅ covered (source **A**) |
| 3 | Fly-through of the interior — cable spool, machined gears meshing, taut red cable, circuit-lined walls | ✅ covered (source **C**) |
| 4 | Bank up, burst out the top into black space, dissolve to a scanning-grid HUD tunnel | ⚠️ **not used.** Source A has a light-tunnel and a warp streak, but placing them mid-fly-through costs two more joins for a beat the cut doesn't need — the circuit→gears run already carries that stretch |
| 5 | Performance centre — sprinter at camera, follow the electric rope, settle on the device trackside | ⚠️ **partly.** The film still ends trackside on the hero device, but the sprinter-charging-camera shot was cut — it sat between the plate and the box opening and broke the one-flow read (§6). Source C 0.3–3.6s if you want it back. |

**The deliberate departure from the storyboard:** the film opens on the product
rather than an athlete, because the priority is that the box you watch is
visibly the box that opens. The holographic athletes running through the black
plate carry the human beat instead, and the film still *ends* trackside on the
hero device with the T-APEX branding.

---

## 6. How the master is cut

Three sources, two dissolves. Both joins were chosen where the outgoing and
incoming frames already rhyme, so the blend reads as one continuous camera move
rather than an edit:

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | **V1** (`Apex_Vid_1`) | 0.30–6.60 | the black plate — device + holographic athletes, playing out |
| 2 | **A** (`hf_20260722_125532…`) | 1.85–4.75 | **the same box opens** — graded to black, see below |
| 3 | **C** (`…101435_Lumina_1`) | 5.40–14.60 | circuit macro → spool + gears → HUD athletes → hero device |

```bash
ffmpeg -y -i V1.mp4 -i A.mp4 -i C.mp4 -filter_complex "\
[0:v]trim=0.30:6.60,setpts=PTS-STARTPTS,fps=24[v0];\
[1:v]trim=1.85:4.75,setpts=PTS-STARTPTS,fps=24,\
scale=1600:900:flags=lanczos,crop=1280:720:160:120,\
curves=all='0/0 0.20/0.015 0.45/0.42 0.75/0.82 1/1',\
vignette=angle=PI/2.9:x0=w/2:y0=h/1.9,vignette=angle=PI/3.6:x0=w/2:y0=h/1.9[v1];\
[2:v]trim=5.40:14.60,setpts=PTS-STARTPTS,fps=24[v2];\
[v0][v1]xfade=transition=fade:duration=0.7:offset=5.6[x1];\
[x1][v2]xfade=transition=fade:duration=0.5:offset=8.0[x2]" \
-map "[x2]" -an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p master.mp4
```

`xfade`'s `offset` is measured on the *incoming* chain, so each one is
`(length so far) − (dissolve duration)`.

### ⭐ How the "one flow" read is bought

The brief is: *you watch the box, then **that** box opens* — not two videos
played back to back. The two shots were filmed in different places (a pure black
void vs a lit hall with neon strips and a wet floor) and from different angles
(3/4 vs near face-on). Three things reconcile that, in order of importance:

1. **Grade the hall out.** The `curves` + double `vignette` on segment 2 crushes
   the floor, walls and neon to black so the opening box sits in the same void as
   the plate. *This is the big one* — the change of environment, not the change
   of angle, is what makes an edit read as "different video".
2. **Zoom slightly and re-centre** (`scale` then `crop`) so the box lands at a
   comparable size and the neon strips at the frame edges are pushed out.
3. **Make the dissolve long** — 0.7s rather than 0.5s. Held over that duration
   with both boxes in black, the change of angle reads as the camera moving
   around the machine, not as a cut.

The track-hall segment that used to sit between them was **removed**: cutting
black void → lit hall → different lit hall was exactly what broke the illusion.
The hall returns later, after the fly-through, where the journey justifies it.

**The other two joins:**
- **Join 2** cuts interior→interior. Both sides are blue-lit macro circuitry, so
  it reads as the camera diving deeper into the board. Essentially invisible.
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
- **Source A, 5.25–6.5s** — a warp/hyperspeed streak and a wireframe hologram
  insert. Usable as a transition if a future recut needs to bridge two
  mismatched shots.

**Constraints for anything new you generate:**
- **One continuous move, no hard cuts.** Scrubbing amplifies every jump.
- **Constant camera speed** — the scroll supplies the pacing.
- **No on-screen text** — all copy is live HTML over the top.
- Watch the luma: bright footage forces the `.cine-dim` cue to work harder and
  leaves less room for copy.

---

## 7. The resolution ceiling — read this before chasing sharpness

**Every source clip is 1280×720.** There is no 1080p in the material, so the
hero cannot be truly 1080p; any larger frame is interpolated. What was fixed
was the *avoidable* softness stacked on top of that:

| Cause | Fix |
|---|---|
| Frames were extracted at **1152px — below the 1280px source** | Extract at 1440 with `lanczos` + `unsharp` |
| WebP quality 72 on detailed macro shots | Raised to 74 at the larger size |
| Canvas used the browser's default (cheap) resampler | `ctx.imageSmoothingQuality = 'high'` |
| Canvas backing store ran at DPR 2 — 4× the pixels of a 1440px frame, with no extra detail to show for it | Capped at 1.5; costs nothing visually, gives the fill rate back to framerate |

### How much detail is actually in there?

Measured with a resolution round-trip (`psnr` after halving and restoring):

| Round trip | PSNR (Y) | Reading |
|---|---|---|
| 720p → 360p → 720p | **30.6 dB** | Low, so a lot is lost — the source genuinely carries detail all the way to 720p. It is a sharp master, not a soft one. |
| 720p → 1080p → 720p | **46.1 dB** | Near-lossless, i.e. the 1080p step adds no information. Confirms nothing exists above 720p. |

```bash
ffmpeg -i master.mp4 -filter_complex "[0:v]split=2[a][b];\
[a]scale=640:360:flags=lanczos,scale=1280:720:flags=lanczos[d];\
[b][d]psnr=stats_file=-" -f null -
```

**The practical consequence:** the biggest available win was never an upscale
service — it was that the extraction was *under-supplying* the canvas. On a
standard 1080p desktop the canvas backing store asks for 1920px and was being
handed 1152, then 1440. Extracting at 1920 makes it pixel-for-pixel on the most
common desktop configuration, using only pixels lanczos can honestly interpolate.

**An AI upscale (Higgsfield `upscale_video`, Topaz) remains the only way to go
further**, and the sharp source measured above is the favourable case for one.
But the expected gain on *this* content is modest: it's synthetic CG — smooth
gradients, bokeh, glowing filaments — where upscalers earn least and risk
over-sharpening artefacts on exactly the delicate energy effects that carry the
film. Worth trying only if 1920 still isn't enough; do it on the **master**, not
the individual sources, so the dissolves stay consistent, then re-extract at
`scale=2560` and expect AVIF (see §3) to become necessary for the weight.

---

## 8. Smooth scroll (`src/components/SmoothScroll.tsx`)

A mouse wheel does not emit continuous motion — it fires discrete notches of
roughly 100–120px. On an ordinary page nobody notices. Here, scroll position
maps straight onto film frames (~15px of scroll per frame), so **one notch used
to jump ~8 frames at once**. No amount of extra frames fixes that; the input
itself is stepped.

[Lenis](https://github.com/darkroomengineering/lenis) interpolates the real
scroll position toward the target every frame, turning each notch into a short
eased glide. Measured on this page: one 120px notch now resolves across **34
distinct scroll positions with a largest single-frame step of 15px** — about one
film frame per rendered frame, which is what "smooth video" actually means.

Two things are load-bearing and easy to break:

1. **Lenis and ScrollTrigger must share one clock.** Lenis is driven from
   `gsap.ticker` and ScrollTrigger updates on Lenis's `scroll` event. If both
   run their own RAF loop they sample the scroll position at different points in
   the frame and the hero judders — *worse* than no smoothing at all.
2. **`scrub` must come down.** Lenis already adds easing; a large `scrub` on top
   stacks a second lag and the film visibly trails the page. It's `0.35` now
   (was `1`).

Disabled entirely under `prefers-reduced-motion` — hijacking scroll is exactly
what that setting asks you not to do.
