# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` (22.6s, 24fps, 1600×900) —
> two sources joined by one dissolve, extracted at `fps=14` (no rescale, the
> master is already 1600×900) → **317 frames at 1600×900, 19 MB**; the phone
> sequence is **158 frames at 640×360, 2.9 MB**. See §6 for the recipe.
>
> The spine is deliberately simple: **the black-plate scene plays out, then that
> same box opens.** Then fly-through the internals → red grid tunnel → out into
> the T-APEX hall for the sprint. See §6 for how the one-flow read is bought and
> §7 for the resolution ceiling.
>
> **⚠ The sprint must be a locked-off shot. This is a hard requirement.**
>
> The previous sprint was a dolly — the camera tracked down the lane while the
> athlete ran at it — and in it the machine read as though it were being towed.
> That was real and it was measured. Per-frame RANSAC homography on the tarmac
> (machine masked out of the fit, athlete rejected as outliers), accumulated
> across the shot, against the machine's own contact patch tracked by
> Lucas-Kanade, at the master's 1600×900:
>
> | | slip vs tarmac, mean | slip, final frame |
> |---|---|---|
> | machine's own screen travel | — | 263 px |
> | a planted object would travel | — | 221 px |
> | **slip** | **54 px** | **120 px** |
>
> The chain was verified rather than trusted: warping the last sprint frame back
> into the first frame's coordinates registers the tarmac, lane lines, hedge and
> skyline continuously, while the machine and its starting blocks appear *twice*,
> plainly offset. The machine also grew **1.44× faster than the ground it stood
> on**, which is exactly what sliding that far toward the lens predicts (1.425×)
> — so it was a rigid object on a consistent ground plane that genuinely moved.
>
> **Three fixes were built and all three were rejected:**
>
> 1. **Whole-frame stabilise** — cannot work at any tuning. It moves the ground
>    and the machine together, so it can never change their relative motion; it
>    only adds its own. Shipped briefly once, reverted.
> 2. **Local mesh warp** — displace only the machine's neighbourhood onto the
>    ground's prediction, decaying to identity. Correct in principle, but 109 px
>    of displacement ripples the tarmac and visibly bends the lane lines, and the
>    machine's blocks sit ~120 px off the bottom of frame so the band beneath them
>    has to stretch ~1.9×. Rendered, inspected, rejected.
> 3. **Matte, re-composite, fill** — the only one that looked right on a still,
>    and the one to reach for if this ever has to be done in post. Key the
>    *tarmac* rather than the machine (a luminance key finds the chassis and drops
>    the mid-brown blocks and white frame, leaving them behind on the track), lift
>    clean tarmac from below to fill, tone-match on a ring outside the patch. What
>    it needs and did not get is a robust matte across all 196 frames — the
>    athlete's black tights cross the dark chassis for the first third of the
>    shot, which wants a segmentation model or hand roto, not a colour key.
>
> **It was fixed by replacement, not repair** — a fixed-camera shot in the T-APEX
> hall, where the wall, branding and lighting hold still and the unit is planted
> for the whole run. If you re-generate this segment, specify a locked-off camera.
> A dolly puts the drag straight back, and none of the above will get it out.

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
  first 18 frames decode, the rest stream in behind.)
- **ACT 1 — SPLIT (3–26%).** The headline parts — `TRAIN BEYOND` rises, `HUMAN
  LIMITS` drops — on a `power2.out` ease so they break apart on contact rather
  than creeping. A blue seam opens across the gap and the film is revealed *by*
  the split: a `clip-path` aperture unclips vertically from that seam.
- **ACT 2 — TRAVEL (3–97%).** Frames scrub to scroll, act by act rather than at
  one flat rate (see `ACT SCRUB` in the component). The machine starts at 0.34
  scale — deep down the lens against its own black plate — and flies in to full
  frame as the panels open. The telemetry HUD lands over the fly-through,
  flanked left and right at 11–13% inset, not centred.
- **ACT 3 — RESOLVE (73–100%).** *DEVELOPED FOR THE NEXT TENTH OF A SECOND*
  lands centre-frame at 75%, just after the tunnel resolves into the hall, and
  clears at 87% so the run and the dispersal close the shot alone; CTAs resolve
  at 92%.

### Where the content sits (scroll progress → shot)

317 frames, scrubbed across `0.03 → 0.97`:

| Progress | Frames | On screen |
|---|---|---|
| 0.03–0.37 | 0–59 | the machine on pure black — travelling in, turning, then ✦ **the panels open**, internals lit |
| 0.37–0.60 | 59–201 | fly-through: cable spool, motor, gears, circuit macro, chip |
| 0.60–0.73 | 201–231 | the red grid tunnel, dissolving out into the T-APEX hall |
| 0.73–0.97 | 231–316 | the sprint on a locked-off camera, resolving as the athlete disperses |

**The tunnel gets 13% of the scroll for 9% of the frames**, and those 30 frames
are real rather than repeats. The source tunnel runs only 0.7s, so it is slowed
3× with motion interpolation in the §6 recipe, which *synthesises* in-betweens.
Plain time-stretching would have duplicated frames instead — and a duplicate
under a scrub is a visible step where a genuine in-between is smooth. That is
the whole reason this hero scrubs a sequence rather than a video: every frame
you spend scroll on has to be a distinct picture.

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
     -vf "fps=14" \
     -f image2 -c:v libwebp -quality 70 \
     public/hero-frames/frame-%03d.webp
   ```
   No `scale` and no `unsharp`: the master is cut at 1600×900, which is the size
   the sequence ships at, so there is nothing to resample. Do the upscaling in
   the *master* (`scale=…:flags=lanczos` in the §6 recipe) where it happens once,
   not here where it would happen again on every frame. `unsharp` was dropped
   because the sources are already-sharpened upscales and it cost 12 KB/frame for
   a worse picture — see §3's weight table.
3. Extract the **phone** sequence into `public/hero-frames-mobile/` — same cut,
   every second frame, 640×360 (see §3b):
   ```bash
   rm -f public/hero-frames-mobile/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=7,scale=640:-1:flags=lanczos" \
     -f image2 -c:v libwebp -quality 56 \
     public/hero-frames-mobile/frame-%03d.webp
   ```
4. Update **both** frame counts in `src/components/ScrollCinemaHero.tsx` —
   `DESKTOP.frameCount` and `MOBILE.frameCount`.
5. Re-measure luma and re-time the `.cine-dim` cue (see §1).
6. `npm run build` to verify, then commit both frame directories + the component.

### 3b. The phone sequence
Phones run the same four acts off their own sequence: **158 frames at 640×360,
2.9 MB**, with `readyFrames: 12` (~96 KB) gating the start. That is not a
downgrade of the mobile hero — it *replaced* a 13 MB looping banner video that
was being loaded through two stacked `<video preload="auto">` elements, so the
phone gained the film and got several times lighter at once.

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

Resolution follows from that: the band draws at ~526 CSS px wide, so at
`maxDpr: 1.25` a 640-wide source is already a mild upscale. Going wider only
burns fill rate on a phone GPU.

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
already been sharpened once. So the sequence lands at ~61 KB/frame and there is
no cheap way down — the weight is the picture. Kept whole rather than traded
away, since frame count is what sells the scrub.

**Current: 317 frames at 1600×900 / q70 = 19 MB** (phones: 158 frames, 2.9 MB).
That is *down* from the previous cut's 318 frames / 24 MB at the same frame
count, and not by trading quality — the new sprint replaced 90 frames of bright,
detailed outdoor tarmac with a darker hall, and dark frames are cheap to encode.
The 30 interpolated tunnel frames are cheaper still (mean luma 37).

Note the shape of the older table: **going from 1440 to 1920 cost only ~2 MB**, because
dropping quality 74 → 70 pays for most of the extra pixels. On this footage that
is a clear win — resolution buys more perceived sharpness than quantisation does,
and q70 shows no banding even on the dark panel gradients (the worst case).

AVIF at 1600px/crf34 measured ~42 KB/frame vs WebP's ~64 KB — about a third
smaller *and* sharper. It was **not** adopted because AVIF decodes considerably
slower than WebP, and a decode stall during a scrub costs smoothness, which is
the more valuable of the two. Revisit if the weight ever has to come down.

That weight is desktop-only (phones fetch the 2.9 MB sequence in §3b instead)
and loads progressively — only `readyFrames` (18, ~456 KB) gate the start of
scrubbing, and a frame that hasn't decoded holds the previous one rather than
flashing black.

**Re-measured on the earlier 318-frame sequence, and the answer was: leave it.**
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
| 5 | Performance centre — sprinter at camera, follow the electric rope, settle on the device trackside | ✅ **covered** by the new sprint (`apexscroll.mp4`): the T-APEX hall, the athlete running at a fixed camera with the rope trailing back to the unit, which stays planted by the wall for the whole run. Closes on him dispersing into red/blue energy with the unit still on the track. |

**The deliberate departure from the storyboard:** the film opens on the product
rather than an athlete, because the priority is that the box you watch is
visibly the box that opens. The holographic athletes running through the black
plate carry the human beat instead, and the film still *ends* trackside on the
hero device with the T-APEX branding.

---

## 6. How the master is cut

Two sources, one dissolve — chosen where the outgoing and incoming frames
already rhyme, so the blend reads as one continuous camera move rather than an
edit. (Segment 1 is itself the older three-source cut, whose recipe and reasoning
are kept below under *How the front section was built*.)

The master is now **two** sources and **one** dissolve. Everything up to the
tunnel is the previous master untouched; the sprint is a new locked-off clip.

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | the previous master | 0–14.35 | black plate → **the same box opens** → fly-through → the tunnel mouth approaching |
| 1b | the previous master, slowed 3× | 14.35–15.05 → 2.125s | the **red grid tunnel**, full frame |
| 2 | `apexscroll.mp4` (1280×720, 24fps) | 4.00–10.75 | the sprint in the T-APEX hall, fixed camera, then the dispersal |

Two passes, because segment 1b has to be interpolated before it can be cut in:

**Yes, this uses `minterpolate`, which the turntable note at the top of this file
tells you not to use.** That warning stands — for a *turntable*. There it has to
invent the far side of a rotating object as new surface swings into view, and it
smears. Here the tunnel is a synthetic grid on a dead-straight constant-velocity
push: every feature in frame N+1 is visibly present in frame N, just larger, so
the motion estimate is trivially correct and the in-betweens are clean. Check any
interpolated frame before trusting this on new footage — the test is whether the
shot contains motion the estimator can actually see through.

```bash
# 1. slow the tunnel 3x — synthesising in-betweens, not repeating frames
ffmpeg -y -ss 14.35 -t 0.70 -i prev-master.mp4 \
  -vf "minterpolate=fps=72:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,\
setpts=3*PTS,fps=24" \
  -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p tunnel_slow.mp4

# 2. assemble
ffmpeg -y -i prev-master.mp4 -i tunnel_slow.mp4 -i apexscroll.mp4 -filter_complex "\
[0:v]trim=0:14.35,setpts=PTS-STARTPTS,fps=24,scale=1600:900:flags=lanczos,\
format=yuv420p,settb=1/24[a];\
[1:v]setpts=PTS-STARTPTS,fps=24,scale=1600:900:flags=lanczos,\
format=yuv420p,settb=1/24[b];\
[a][b]concat=n=2:v=1:a=0,settb=1/24[ab];\
[2:v]trim=4.0:10.75,setpts=PTS-STARTPTS,fps=24,scale=1600:900:flags=lanczos,\
format=yuv420p,settb=1/24[c];\
[ab][c]xfade=transition=fade:duration=0.6:offset=15.875[vx]" \
-map "[vx]" -an -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
public/apex-hero-cinema.mp4
```

`xfade`'s `offset` is measured on the *incoming* chain, so it is
`(length so far) − (dissolve duration)` = `(14.35 + 2.125) − 0.6`.

**`settb=1/24` on every branch is not optional.** `concat` hands on a
microsecond timebase while the trimmed branch keeps 1/24, and `xfade` refuses to
configure when its two inputs disagree — it fails with *"First input link main
timebase do not match"* and writes a zero-byte file.

**Why those numbers:**

- **`trim=0:14.35`, then the slowed tunnel.** 14.35s is where the grid opens out
  to full frame. Everything before it is the tunnel *mouth* approaching through
  black, which is already paced well; only the wide-grid part needed lengthening.
- **The tunnel had to be interpolated, not just given more scroll.** At the
  original speed the whole full-frame grid is 0.7s ≈ 10 frames at 14fps, and the
  0.6s dissolve would have eaten most of them. Slowing it 3× turns those 10 into
  30, so the grid gets a real push of its own *before* the hall arrives.
- **The old portal is gone.** The tunnel used to open onto an inset of the old
  track shot, which first shows content at 15.07s. Cutting the source at 15.05
  takes none of it, so nothing of the dragging machine survives anywhere.
- **`trim=4.0` on segment 2.** The clip opens on the athlete far down the hall
  barely changing size — weak under a scrub, and the tunnel already supplies the
  sense of distance. Starting at 4.0s brings him in mid-hall and already moving.
- **`10.75`, not the full 11.04.** The last ~0.3s is a frozen near-black hold
  (luma flat at 16.0). A frozen tail is dead scroll: you keep scrolling and
  nothing moves.
- **`fps=24`, not 30.** The new clip is natively 24fps and carries the fastest
  motion in the film. Conforming *it* to 30 would duplicate one frame in five
  and the duplicates survive into the 14fps extraction as judder; conforming the
  slow front section down to 24 costs nothing visible.

### ⭐ Why this dissolve works

The tunnel ends on a red grid corridor receding to a dark centre; the new clip
opens on a dark hall whose blue lane lines recede to a lit far wall. **The two
vanishing points coincide and the grid lines run parallel to the lane lines**, so
across the 0.7s the red grid reads as a HUD laid over the hall rather than as one
video replacing another — the tunnel appears to *open onto* the hall. That is the
same principle as the older joins: dissolve between frames that already share
structure. Here the palettes differ (red grid vs blue track) and it still holds,
because the shared perspective is doing more work than shared colour would.

## 6b. How the front section was built

Segment 1 above is the previous master, kept whole. It was itself cut from three
sources with two dissolves — `V1` (`Apex_Vid_1`, 0.30–6.60, the black plate),
`A` (`hf_20260722_125532…`, 1.85–4.75, **the same box opens**, graded to black)
and `C` (`…101435_Lumina_1`, 5.40–14.60, circuit macro → spool + gears → the red
tunnel). Its reasoning is kept here because it still governs everything before
the sprint, and because re-cutting the front means re-deriving all of it.

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

**The front section's second join** cuts interior→interior. Both sides are
blue-lit macro circuitry, so it reads as the camera diving deeper into the board.
Essentially invisible.

The rule behind all three joins in the film: **dissolve between frames that
already share structure — subject, scale, perspective, and where you can get it,
palette.** A dissolve between mismatched frames is just a slow cut, and a scrub
makes that worse than a hard one, not better.

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
