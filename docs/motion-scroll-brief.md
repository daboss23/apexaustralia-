# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` (22.7s, 30fps) — a single
> continuous Seedance 2.0 generation delivered at 2560×1440, unmodified, tail-trimmed at 22.7s, extracted at `fps=14`, `scale=1600` (lanczos, no
> unsharp) → **318 frames at 1600×900, 22 MB**.
>
> The spine is deliberately simple: **the black-plate scene plays out, then that
> same box opens.** Then fly-through the internals → red tunnel → the sprint.
> See §6 for how the one-flow read is bought and §7 for the resolution ceiling.
>
> **⚠ Do not try to stabilise the machine with a whole-frame transform.** As
> generated, the sprint reads as though the athlete were towing the machine, and
> the obvious fix — track the machine and warp each frame so it holds a fixed
> screen position — was tried and **made it dramatically worse**. It was shipped
> briefly and reverted.
>
> The reason is geometric, so no amount of tuning rescues it. The camera dollies
> down the track, so a *planted* object must travel across the frame. Pinning it
> to the frame therefore forces it to slide across the tarmac. Measured as the
> distance between where the machine actually sits and where the ground plane
> says it should (per-frame RANSAC homography on the tarmac, machine and athlete
> masked out of the fit):
>
> | | slip vs tarmac, mean | slip, final frame |
> |---|---|---|
> | generation as delivered | 92 px | 219 px |
> | whole-frame "lock" | 276 px | **1605 px** |
>
> A whole-frame warp moves the ground and the machine *together*, so it can
> never change their relative motion — it only adds its own. The delivered
> footage does have a real, modest drag (219px over ~6.5s on a 2560px frame).
> Fixing that properly means matting the machine out, re-compositing it at the
> homography-predicted transform, and inpainting the vacated tarmac — or, far
> cheaper, re-generating the shot. Reach for one of those, not a stabiliser.

> **Floating product films** (`SolutionSection`'s turntable, and anything else
> using `mix-blend-mode: screen` on the black page): the blend composites black
> to exactly the page background, which is what makes the unit look like it is
> floating rather than sitting in a video box. It only works on a **true black**
> plate. Two traps:
>
> - **Do not supply a background-removed clip.** Alpha does not survive mp4, so
>   a "transparent" export arrives on **white** — the worst possible case, since
>   screen renders white as white and you get a white square. Key it back onto
>   black first: `lumakey=threshold=0.86:tolerance=0.12` over a black `color`
>   source, then crush with `colorlevels=rimin=0.03:gimin=0.03:bimin=0.03`. A
>   plate grading out at ~2.5 reads as a faint lighter box; crushed, it lands
>   within 0.2/255 of the page.
> - **Do not motion-interpolate to slow a turntable down.** Both `minterpolate`
>   (warping across the machine face) and `framerate` blending (ghosting two
>   rotation angles into a mottled smear) were tried and produced visible
>   artefacts. Re-time instead: keep every real frame and lower the output rate
>   (`setpts=1.667*PTS,fps=18`), which is judder-free because no frame is
>   invented or duplicated.
>
> These turntables rarely loop on their own — the unit does not return to its
> opening pose, so a matched hard cut pops wherever you put it. Crossfade the
> tail into the head instead (~1.5s) and check the seam difference; under
> ~5/255 is clean.

---

## 1. What the scroll experience does

As the visitor scrolls the hero (**4800px pinned, ~4 viewport-heights**), in
four acts. Percentages below are timeline progress, which is also scroll
progress across the pin.

- **ACT 0 — HOLD (0–3%).** Pure black, *TRAIN BEYOND HUMAN LIMITS* alone. Kept
  deliberately short: at 10% the headline took five wheel notches to budge and
  read as broken. (It doubles as the loading state — scrubbing arms once the
  first 36 frames decode, the rest stream in behind.)
- **ACT 1 — SPLIT (3–26%).** The headline parts — `TRAIN BEYOND` rises, `HUMAN
  LIMITS` drops — on a `power2.out` ease so they break apart on contact rather
  than creeping. A blue seam opens across the gap and the film is revealed *by*
  the split: a `clip-path` aperture unclips vertically from that seam.
- **ACT 2 — TRAVEL (3–97%).** Frames scrub to scroll, act by act rather than at
  one flat rate (see `ACT SCRUB` in the component). The machine starts at 0.34
  scale — deep down the lens against its own black plate — and flies in to full
  frame as the panels open. The telemetry HUD lands over the fly-through,
  flanked left and right at 11–13% inset, not centred.
- **ACT 3 — RESOLVE (74–100%).** *DEVELOPED FOR THE NEXT TENTH OF A SECOND*
  lands centre-frame as the sprinter appears and clears at 87% so the machine
  alone closes the shot; CTAs resolve at 92%.

### Where the content sits (scroll progress → shot)

318 frames, scrubbed across `0.03 → 0.97`:

| Progress | Frames | On screen |
|---|---|---|
| 0.03–0.40 | 0–59 | the machine on pure black — travelling in, turning, then ✦ **the panels open**, internals lit |
| 0.40–0.63 | 59–185 | fly-through: cable spool, motor, gears, circuit macro, chip |
| 0.63–0.72 | 185–227 | the red grid tunnel, opening onto the track |
| 0.72–0.97 | 227–317 | the sprint, resolving on the machine trackside |

**Two layout rules this footage forces:**

1. **Nothing goes on screen during the box opening.** It is the centrepiece; the
   headline halves are timed to clear at 26%, just before it starts.
2. **Copy can't just sit on the film.** Only the opening is near-black; the rest
   is lit. `.cine-dim` is therefore scheduled like a lighting cue — it lifts
   under every copy beat (0.46 telemetry, 0.58 sprint headline, 0.62 CTAs) and
   drops between them (0.04 at the box opening, 0.10 at the tunnel, 0.14 on the
   closing hero shot) so the film plays at full strength exactly when nothing is
   written over it. If you recut, **re-measure the luma and re-time that cue**:
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
3. Extract the **phone** sequence into `public/hero-frames-mobile/` — same cut,
   every second frame, 960×540 (see §3b):
   ```bash
   rm -f public/hero-frames-mobile/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=7,scale=960:-1:flags=lanczos" \
     -f image2 -c:v libwebp -quality 68 \
     public/hero-frames-mobile/frame-%03d.webp
   ```
4. Update **both** frame counts in `src/components/ScrollCinemaHero.tsx` —
   `DESKTOP.frameCount` and `MOBILE.frameCount`.
5. Re-measure luma and re-time the `.cine-dim` cue (see §1).
6. `npm run build` to verify, then commit both frame directories + the component.

### 3b. The phone sequence
Phones run the same four acts off their own sequence: **159 frames at 960×540,
6.0 MB**, with `readyFrames: 12` (~450 KB) gating the start. That is still less
than half the 13 MB looping banner video it replaced — which was being loaded
through two stacked `<video preload="auto">` elements and had to buffer
contiguously — so the phone gained the film and got lighter at the same time.

Act boundaries are expressed as **ratios** of the sequence (`ACT_OPEN_END` and
friends), not frame indices, so half the frames still land every cut on the same
moment of the film. Keep that property if you re-cut.

The framing could not carry across unchanged. The footage is 16:9 and a phone is
about 9:19.5, so cover-fitting shows a ~26 % wide slice of every shot — the
fly-through and the sprint both lose their subject. Mobile therefore uses
`fit: 'width'` and plays the film as a **band across the middle of a black
screen**, which is exactly where the headline splits apart: the type parts and
the band opens in the seam. `baseScale: 1.35` sizes that band; above ~1.5 the
sprint starts cropping the athlete. The band's top and bottom edges are faded
**in the canvas itself** (see `draw()`), not with an overlay, so the fade tracks
the camera push — a fixed CSS gradient cannot.

Resolution follows from that — and the first pass got it wrong. The band draws
at ~526 CSS px wide, which was read as "a 640-wide source is already a mild
upscale" with `maxDpr: 1.25` to match. But a 1.25 cap on a DPR-3 phone makes the
backing store 488px against a 390pt box, and the browser then stretches that
2.4x to fill it: the film was resampled twice and looked soft on precisely the
screens that could have shown it sharp. The sequence is now **960 wide** at
`maxDpr: 2` — an 780px buffer, the band drawn ~1150px from a 960px source, once.
It costs 3 MB and it is the difference between "soft" and "fuzzy" on a phone.
Going to DPR 3 is 2.25x the fill rate for detail the source does not have.

### Sizing the sequence — the real trade-off
Frame **count** sells smoothness far more than frame **resolution**: the scrub
is a temporal effect, and a soft frame in motion reads fine where a chunky one
does not. So when the budget gets tight, drop `scale` before you drop `fps`.

Current: 241 frames @ 1920px / q70 = **15 MB**. Measured alternatives on this
footage — `1920 q78` → 18.8 MB, `1920 q72 fps13` → 15.1 MB, `1440 q74` → 14 MB,
`1280 q82` → 12 MB, `1600 q68 fps13` → 12.3 MB.

**That table does not survive the current footage.** Re-measured on the 2K cut,
the picture is dense enough (circuit macros, cable texture, upscaler grain) that
neither lever buys much: `1600 q70` → 64 KB/frame, `1600 q52` → 63, `1280 q68`
→ 57, and denoising first saved ~2 KB. Dropping `unsharp` was the only real win
(76 → 64 KB) and it looks better anyway, the source being a 2K upscale that has
already been sharpened once. So 318 frames land at 22 MB and there is no cheap
way down — the weight is the picture. Kept whole rather than traded away, since
frame count is what sells the scrub.

Note the shape of the older table: **going from 1440 to 1920 cost only ~2 MB**, because
dropping quality 74 → 70 pays for most of the extra pixels. On this footage that
is a clear win — resolution buys more perceived sharpness than quantisation does,
and q70 shows no banding even on the dark panel gradients (the worst case).

AVIF at 1600px/crf34 measured ~42 KB/frame vs WebP's ~64 KB — about a third
smaller *and* sharper. It was **not** adopted because AVIF decodes considerably
slower than WebP, and a decode stall during a scrub costs smoothness, which is
the more valuable of the two. Revisit if the weight ever has to come down.

That weight is desktop-only (phones fetch the 6.0 MB sequence in §3b instead)
and loads progressively — only `readyFrames` (36) gate the start of scrubbing,
and a frame that hasn't decoded holds the previous one rather than flashing
black.

**Re-measured on the shipped 318-frame sequence, and the answer is: leave it.**
Sampling 24 frames across the whole cut and re-encoding through Chromium's WebP
encoder:

| | full sequence | vs now |
|---|---|---|
| as shipped (1600×900) | 24.2 MB | — |
| 1600×900 q0.80 | 26.6 MB | **+10 %** |
| 1600×900 q0.72 | 23.5 MB | −3 % |
| 1440×810 q0.78 | 22.0 MB | −9 % |
| 1280×720 q0.80 | 20.5 MB | −15 % |
| 1280×720 q0.72 | 16.8 MB | −31 % |

Quality alone buys nothing — the frames are already encoded near the knee, and
re-encoding at a *higher* quality setting than they were made at makes them
bigger. Only a resolution cut moves the number, and it costs visible sharpness
on a large display *plus* generation loss from re-compressing already-lossy
source. Meanwhile 24 MB is not the number that decides how the page feels:
36 frames (~2.7 MB) gate the start and the rest streams in behind Act 0's black
hold, so time-to-interactive is better than the 15 MB video the hero used to
run, which had to buffer contiguously.

If the weight ever genuinely has to come down, take **frames out of the slow
acts** before you take pixels out of every frame — the opening act spends 34 %
of the scroll on 19 % of the sequence and can afford it.

### Load ordering
The opening frames are fetched at `fetchPriority: 'high'` and the rest at
`'low'`, so frame 4 doesn't queue behind frame 200 — which nobody sees for
another four thousand pixels of scroll. The ready gate counts the **first** N
frames specifically, not any N completions; counting completions let a scattered
set of late arrivals satisfy it while the opening was still in flight.

### Optional tuning knobs (the `DESKTOP` / `MOBILE` configs in `ScrollCinemaHero.tsx`)
- `pinDistance` — px of scroll the hero stays pinned (`'+=4800'` desktop,
  `'+=3200'` phone). Keep it near **15–20 px of scroll per frame** or the scrub
  changes feel. Phones get less because a thumb covers ground far faster than a
  wheel, and a 4800px pin on a phone reads as the page having stopped.
- `ZOOM_START` / `ZOOM_END` — extra push-in (`1.0 → 1.1`). Keep this small when
  the footage already flies; the two motions fight otherwise.
- `splitTravel` — how far the headline halves part, as a fraction of viewport
  height (`0.34` desktop, `0.21` phone — enough to clear the film band without
  throwing the type off the top of a short phone).
- `fit` / `baseScale` / `maxDpr` — see §3b.
- Beat timings — the position values in the timeline map to scroll progress
  (0–1); shift them to re-choreograph when copy appears.

---

## 4. Fallbacks (already handled)
- **Phones (< 1024px)** run the same scroll-cinema off the mobile sequence
  (§3b). **`prefers-reduced-motion`** and **Data Saver / 2G-class connections**
  get the classic `<Hero />` — no pin, no scrub — with the banner rendered as a
  still (`<Hero still />`), because a three-hundred-image preload is exactly
  what those settings ask you not to do.
- The same `still` flag covers the moment before the hero has decided which mode
  it's in. That first paint is what the static export ships, so without it every
  visitor on every device kicked off the 13 MB banner video for a hero that was
  replaced milliseconds later.
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
