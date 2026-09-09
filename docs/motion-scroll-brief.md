# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` — the 3.00s–10.80s window of
> a single continuous 1280×720 / 24fps generation, trimmed and re-encoded, no
> other edit. **7.8s, 188 frames**, extracted at native `fps=24`, `scale=1920`
> (lanczos + light unsharp) → **188 frames at 1920×1080, 11.4 MB**, and a phone
> sequence at 960×540, 4.3 MB.
>
> The spine is one unbroken shot: **an athlete drives out of the far end of an
> indoor hall toward the lens**, the T-APEX machine trackside paying out its
> cable behind him; the ARI overlay floods his musculature in red and blue; he
> comes apart into particles and the frame falls to black.
>
> **The tail problem is solved, and the fix must be preserved.** The previous cut
> ended with the sprinter still half in shot — a body frozen mid-stride at the
> frame edge — and no amount of scrub timing hid it. This one ends on the
> source's own **fade to black**, so the last frame of the film and the last
> pixel of the pin are the same moment: the hero resolves to black and releases
> into `<ScrollExpandVideo/>` black-to-black. Do not trim that fade off to
> reclaim the ~10 % of scroll it costs — that 10 % *is* the transition. Any
> replacement footage needs the same property: something to rest on after the
> subject clears.
>
> **⚠ Do not try to stabilise a subject with a whole-frame transform.** Learned
> on the previous cut, and it generalises to any frame-scrub: that footage read
> as though the athlete were towing the machine, and the obvious fix — track the
> machine and warp each frame so it holds a fixed screen position — was tried and
> **made it dramatically worse**. It was shipped briefly and reverted.
>
> The reason is geometric, so no amount of tuning rescues it. The camera dollies
> down the track, so a *planted* object must travel across the frame. Pinning it
> to the frame therefore forces it to slide across the tarmac. Measured as the
> distance between where the machine actually sat and where the ground plane said
> it should (per-frame RANSAC homography on the tarmac, machine and athlete
> masked out of the fit):
>
> | | slip vs tarmac, mean | slip, final frame |
> |---|---|---|
> | generation as delivered | 92 px | 219 px |
> | whole-frame "lock" | 276 px | **1605 px** |
>
> A whole-frame warp moves the ground and the subject *together*, so it can never
> change their relative motion — it only adds its own. Fixing that properly means
> matting the subject out, re-compositing it at the homography-predicted
> transform, and inpainting the vacated ground — or, far cheaper, re-generating
> the shot. Reach for one of those, not a stabiliser.

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

As the visitor scrolls the hero (**3400px pinned, ~3.5 viewport-heights**), in
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
- **ACT 2 — APPROACH / RUN (4.5–62%).** Frames scrub to scroll, act by act
  rather than at one flat rate (see `ACT SCRUB` in the component). The camera
  push is a *drift*, 1.06 → 1.22 across the whole pin, because the subject is
  already sprinting at the lens and a push-in on top of a push-in is two motions
  fighting. The telemetry HUD lands at 43%, flanked left and right at 11–13%
  inset, not centred — the athlete owns the middle of frame for the whole clip.
- **ACT 3 — CHARGE / RESOLVE (62–100%).** The ARI overlay floods his
  musculature; *WHEN PERFORMANCE MEETS INTELLIGENCE* lands centre-frame at 71%
  and holds through the peak, clearing at 93% as he comes apart into particles
  and the frame falls to black on the last pixel of the pin.

**Never let the desktop camera push go below 1.0.** `fit: 'cover'` sizes the
frame to exactly fill the screen at 1.0, so anything under it letterboxes — and
this footage is a lit hall, so a letterbox reads as black bars. (The previous cut
opened at 0.34 for the opposite reason: its subject sat on pure black, so drawing
it small read as distance.)

### Where the content sits (scroll progress → shot)

188 frames, scrubbed across `0.045 → 1.0`:

| Progress | Frames | On screen |
|---|---|---|
| 0.045–0.32 | 1–46 | the hall — the athlete driving out of the far end of the track, the T-APEX wall behind him, the machine trackside paying cable |
| 0.32–0.62 | 46–106 | the run — he closes on the lens, the cable draws taut, blue tracing appears on his legs |
| 0.62–0.90 | 106–160 | ✦ **the charge** — the ARI overlay floods his musculature in red and blue |
| 0.90–1.0 | 160–188 | he comes apart into particles, the hall blurs out, the frame falls to black |

The act boundaries are stored as **ratios** of the sequence, not frame indices,
so a re-cut at a different length lands them on the same moments of the film.

**Two layout rules this footage forces:**

1. **The charge is the centrepiece.** Nothing but the closing statement goes over
   it, and that line is placed to sit clear of his torso.
2. **Copy can't just sit on the film.** This footage is lit end to end, where the
   previous cut opened near-black. `.cine-dim` is therefore scheduled like a
   lighting cue, and its levels are **derived, not eyeballed**: measure the mean
   luma of the zone each beat actually occupies, then solve for the opacity that
   lands the backdrop near **Y≈32**, which is where the metallic type holds its
   contrast.

   | beat | zone | measured Y | → dim |
   |---|---|---|---|
   | split headline | centre band | 55 | 0.42 |
   | telemetry HUD | left / right flank | 63 | 0.46 |
   | closing statement | centre band | 73 | 0.56 |

   Between the beats it drops to 0.09 (the reveal) and 0.24 (the charge igniting)
   so the film plays at full strength when nothing is written over it. The second
   one is deliberately a *partial* lift: there is only ~0.08 of pin between the
   HUD leaving and the closing line arriving, and taking the scrim all the way
   down and straight back up across that gap strobes rather than breathes.

   If you recut, **re-measure and re-time the cue**. Crop to the zone the beat
   occupies rather than measuring the whole frame — a centred headline over a
   dark-edged shot is a completely different problem from the frame average:
   ```bash
   # centre band (closing statement); use crop=280:340:0:190 for the left flank
   ffmpeg -v error -i public/apex-hero-cinema.mp4 \
     -vf "fps=6,crop=800:280:240:210,signalstats,\
          metadata=print:key=lavfi.signalstats.YAVG:file=-" -an -f null -
   ```

The single most important property of the footage: it must be a **slow,
continuous, single-motion push** with **no hard cuts** — scrubbing amplifies any
jump. Think one uninterrupted camera move.

---

## 2. The ideal footage (what to generate)

**One continuous 10–15s clip at the highest fps the tool offers**, 16:9. Length
and frame rate are the budget the entire scrub is spent from, and neither can be
topped up afterwards — a 7.8s clip is about the floor, and it is why the pin came
down from 4800px to 3400.

The shape that currently works, and the one to beat:

| Time | On screen |
|------|-----------|
| 0.0–2.0s | Subject far off, the environment establishing. **Expect to trim most of this** — at ~18px of scroll per frame, a shot that barely changes eats a third of the pin. |
| 2.0–6.0s | The subject closes on the lens. Continuous, constant speed, the product legible in shot. |
| 6.0–8.5s | The payoff beat — the thing the product does, made visible. This is where the closing statement lands, so keep the frame's centre readable under type. |
| 8.5–10s | The subject clears, then **a tail**: a fade, or the camera holding on the empty scene. The hero's release lands on the last frame; without a tail it lands on a freeze. |

If you can only make shorter clips, generate segments separately — but understand
that every join is a liability under a scrub (see §6), and a single unbroken
generation is worth more than a longer stitched one.

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

### Prompt starter (the shape currently shipped — athlete-led)
```
Elite sprinter driving out of the far end of a dark indoor track hall toward a
locked-off camera, a matte-black resistance training device trackside paying out
a taut red cable behind him, hard rim lighting, electric-blue accent glow,
volumetric haze; as he closes, glowing red and blue energy traces his
musculature; he dissolves into drifting particles and the frame fades to black,
one continuous shot, locked camera, no cuts, photoreal, cinematic, 24fps, 12s.
```
Two things this prompt is buying that are easy to lose: the **product legible in
shot the whole time** (otherwise it is an athlete film, not a product film), and
the **fade at the end** (otherwise the pin releases on a freeze).

**Seedance tips for scrubbing:** ask for *constant camera speed*, *no cuts*,
*no motion blur on the whole frame* (per-object is fine), and the **longest
duration** the tool allows. Higher fps source = smoother scrub.

---

## 3. How to drop footage into the pipeline

The site scrubs a **numbered WebP image sequence** in `public/hero-frames/`
(`frame-001.webp … frame-NNN.webp`), NOT a video file. To swap footage:

1. Cut your clip to the master (see §6) at `public/apex-hero-cinema.mp4`.
2. Extract the desktop sequence (ffmpeg):
   ```bash
   rm -f public/hero-frames/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=24,scale=1920:1080:flags=lanczos,unsharp=5:5:0.4:3:3:0.2" \
     -f image2 -c:v libwebp -quality 70 \
     public/hero-frames/frame-%03d.webp
   ```
   **Extract at the source's own frame rate.** `fps=24` on a 24fps master takes
   every real frame and invents none; anything lower throws away smoothness you
   have already paid for, and anything higher duplicates frames, which the scrub
   shows as a stall. (Do not reach for `minterpolate` to manufacture more — on
   thin limbs and particle effects it warps.)

   `lanczos` + a light `unsharp` matter: the source is 720p and the canvas asks
   for ~1920, so *something* has to upscale. Doing it once here beats the
   browser's runtime resampler — measured side by side at the same output size,
   the pre-upscale holds wall texture and lettering the browser path smears.
   Keep the unsharp light (0.4/0.2); the previous recipe's 0.7/0.35 was set for
   a source that had already been sharpened by an upscaler.
3. Extract the **phone** sequence into `public/hero-frames-mobile/` — same cut,
   **same frame count**, 960×540 (see §3b):
   ```bash
   rm -f public/hero-frames-mobile/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=24,scale=960:540:flags=lanczos" \
     -f image2 -c:v libwebp -quality 68 \
     public/hero-frames-mobile/frame-%03d.webp
   ```
   No `unsharp` here: 960 from a 1280 source is a *downscale*, and sharpening a
   downscale just adds ringing.
4. Update **both** frame counts in `src/components/ScrollCinemaHero.tsx` —
   `DESKTOP.frameCount` and `MOBILE.frameCount` — and re-check `pinDistance`
   against the new count (see the px/frame rule below).
5. Re-measure luma and re-time the `.cine-dim` cue (see §1).
6. `npm run build` to verify, then commit both frame directories + the component.

### ⭐ Sizing the pin to the frame count
This is the number that decides whether the scrub reads as motion or as stepping,
and it is a **consequence of the footage, not a taste setting**:

```
pinDistance ÷ frameCount  →  keep it in the 15–20 px/frame band
```

188 frames × 18 px = 3400 desktop; × 17 px = 3200 phone. Holding the previous
4800px pin against this 188-frame cut would have spent 26 px of scroll on each
frame — past the point where a single wheel notch skips a frame.

Verify it rather than trusting it. Hook `drawImage` and record which sequence
frame is painted on each animation frame; under a slow, deliberate scroll the
film should never advance **more than one frame per painted frame**:

| scroll | paints | median jump | max jump | stalls |
|---|---|---|---|---|
| deliberate (~330 px/s) | 401 over the pin | 0 | **1** | none |
| brisk (~1800 px/s) | 122 | 2 | 5 | none |

(Measured in headless Chromium, whose software renderer caps rAF at ~18 fps — so
the paint counts are a floor, and the jumps a ceiling, versus real hardware.)

### 3b. The phone sequence
Phones run the same four acts off their own sequence: **188 frames at 960×540,
4.3 MB**, with `readyFrames: 12` (~280 KB) gating the start.

It is the **same frame count as desktop, not half of it.** The phone used to run
every second frame because the desktop cut had 318 to spare; a 188-frame cut does
not — halving it would put ~34 px of scroll on every frame, which steps.

The framing could not carry across unchanged. The footage is 16:9 and a phone is
about 9:19.5, so cover-fitting shows a ~26 % wide slice of every shot — the run
would be cropped to a strip of the athlete's torso. Mobile therefore uses
`fit: 'width'` and plays the film as a **band across the middle of a black
screen**, which is exactly where the headline splits apart: the type parts and
the band opens in the seam. `baseScale: 1.35` sizes that band; above ~1.5 the run
starts cropping his arms at the frame edge. The band's top and bottom edges are
faded **in the canvas itself** (see `draw()`), not with an overlay, so the fade
tracks the camera push — a fixed CSS gradient cannot.

Resolution follows from that, and the first pass got it wrong. The sequence used
to be 640 wide with `maxDpr: 1.25`, which on a DPR-3 handset made the backing
store 488px against a 390pt box — the browser then stretched that 2.4× to fill
it, so the film was resampled twice and looked soft on precisely the screens that
could have shown it sharp. It is now **960 wide at `maxDpr: 2`**: a 780px buffer,
the band drawn ~1150px from a 960px source, once. **Those two numbers have to
move together** or the canvas upscales twice.

960 is also a *downscale* from this 1280-wide source rather than an upscale,
which is why it costs only 4.3 MB for 188 frames.

### Sizing the sequence — the real trade-off
Frame **count** sells smoothness far more than frame **resolution**: the scrub is
a temporal effect, and a soft frame in motion reads fine where a chunky one does
not. So when the budget gets tight, drop `scale` before you drop `fps` — and on a
cut this short, never drop `fps` at all: 24 is every real frame the source has.

Measured on the current 188-frame master (WebP, lanczos, light unsharp above
1280):

| desktop | KB/frame | sequence | note |
|---|---:|---:|---|
| 1280×720 q76 (native, no upscale) | 40.2 | 7.4 MB | softest — the browser still upscales it to ~1920 at draw time |
| 1600×900 q72 | 53.0 | 9.7 MB | better, but still under-supplies the canvas |
| **1920×1080 q70 — shipped** | **62.1** | **11.4 MB** | pixel-for-pixel on a 1080p desktop |

| phone | KB/frame | sequence |
|---|---:|---:|
| 640×360 q68 | 14.1 | 2.6 MB |
| **960×540 q68 — shipped** | **23.4** | **4.3 MB** |

**The resolution question is settled by where the canvas draws, not by the source
size.** A 1280-wide source into a ~1920-wide backing store gets upscaled either
way; the only choice is whether lanczos does it once, offline, or the browser
does it every frame. Rendered to the same 1920 output and compared side by side,
the pre-upscaled frames hold the wall texture and the T-APEX lettering that the
browser path smears. That is why 1920 is worth +1.7 MB over 1600, and it is the
first time this pipeline's extraction size and §7's recommendation have agreed.

Net against what this replaced: **22.4 MB → 11.4 MB desktop**, roughly half,
because 188 frames of a 7.8s cut is a lot less film than 318 frames of a 22.7s
one. The phone sequence went the other way — 2.7 → 4.3 MB — buying the 960/DPR-2
pairing in §3b, which is a visible sharpness win on the screens that can show it.

AVIF at comparable quality measures about a third smaller than WebP *and*
sharper. It is still **not** adopted: AVIF decodes considerably slower, and a
decode stall during a scrub costs smoothness, which is the more valuable of the
two. Revisit only if the weight has to come down.

Neither number decides how the page *feels*. Only `readyFrames` gate the start
(18 desktop ≈ 1.1 MB, 12 phone ≈ 280 KB) and the rest streams in behind Act 0's
black hold, so time-to-interactive beats the contiguously-buffered video the hero
originally ran. If the weight ever genuinely has to come down, take **frames out
of the slow acts** before you take pixels out of every frame — the approach act
spends 28 % of the scroll on 24 % of the sequence and can afford it.

### Load ordering
The opening frames are fetched at `fetchPriority: 'high'` and the rest at
`'low'`, so frame 4 doesn't queue behind frame 150 — which nobody sees for
another three thousand pixels of scroll. The ready gate counts the **first** N
frames specifically, not any N completions; counting completions let a scattered
set of late arrivals satisfy it while the opening was still in flight.

### Optional tuning knobs (the `DESKTOP` / `MOBILE` configs in `ScrollCinemaHero.tsx`)
- `pinDistance` — px of scroll the hero stays pinned (`'+=3400'` desktop,
  `'+=3200'` phone). Keep it near **15–20 px of scroll per frame** or the scrub
  changes feel — it is a function of `frameCount`, not a free parameter. Phones
  get less because a thumb covers ground far faster than a wheel, and a 4800px
  pin on a phone reads as the page having stopped.
- `zoom` — the camera push, per device, as `{ start, open, end, tail }` scale
  multipliers (`1.06 → 1.22` desktop, `1.0 → 1.10` phone, the phone's multiplied
  by `baseScale: 1.35` before it hits the canvas). Two rules: **never below 1.0
  on desktop** (`fit: 'cover'` letterboxes under it) and keep the whole span
  small when the footage already flies — the two motions fight otherwise.
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
  still (`<Hero still />`), because a two-hundred-image preload is exactly what
  those settings ask you not to do.
- The same `still` flag covers the moment before the hero has decided which mode
  it's in. That first paint is what the static export ships, so without it every
  visitor on every device kicked off the 13 MB banner video for a hero that was
  replaced milliseconds later.
- Frames **preload** in the background; Act 0 is black-and-type by design, so it
  covers the load. Scrubbing arms at `readyFrames` (18 desktop / 12 phone) and a
  frame that hasn't decoded yet holds the previous one rather than flashing
  black.

---

## 5. Storyboard coverage

| # | Shot | Status |
|---|------|--------|
| 1 | Camera moves toward the T-Apex | ⚠️ **inverted.** The camera holds; the *athlete* closes the distance. Same effect on the viewer, and it makes the human the subject rather than the box. |
| 2 | Panels split and open along the seams, glowing internals revealed | ❌ **not in this cut.** It lived in the previous three-source edit; recover it from that master if a future cut wants it. |
| 3 | Fly-through of the interior — cable spool, gears, circuit-lined walls | ❌ **not in this cut**, same as above. |
| 4 | Bank up, burst out into black space, dissolve to a scanning-grid HUD tunnel | ❌ never used in any cut. |
| 5 | Performance centre — sprinter at camera, follow the electric rope, settle on the device | ✅ **this is now the whole film**, plus the ARI overlay beat the storyboard never asked for. |

**The deliberate departure from the storyboard:** the film is now one shot of one
athlete rather than a journey through the product. The machine is present and
legible the whole time — trackside, paying out the cable that is visibly loading
him — so the product story is told *through* the human rather than instead of him.
What the cut gives up is the interior: nobody sees inside the box any more. The
`DeviceStructureSection` and `ProductShowcase` sections carry that job, further
down the page, where a reader who wants engineering detail is actually looking
for it.

**What this cut buys, and why it is worth the trade:** the previous edit was
three generations joined by two dissolves, and holding "one continuous shot"
together across those joins took a grade, a re-centre and a 0.7s dissolve. This
is a single unbroken generation. There is nothing to reconcile, no join that can
drift, and the scrub cannot amplify a cut that is not there.

---

## 6. How the master is cut

One source, one trim, no dissolves:

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | `apexscroll.mp4` (1280×720, 24fps, 11.04s) | **3.00–10.80** | the whole film |

```bash
ffmpeg -y -ss 3.0 -to 10.80 -i apexscroll.mp4 -an \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  public/apex-hero-cinema.mp4
```

Re-encoded rather than stream-copied: `-ss` at a non-keyframe cannot be
frame-accurate on a copy, and the sequence's first frame has to be exactly the
one the aperture opens on.

**Why 3.00s.** The source spends its first three seconds with the athlete a long
way off and barely growing — at ~18 px of scroll per frame that is a third of the
pin spent on a shot that hardly changes, and the reveal lands on something too
small to read. Entering at 3.00s puts the aperture on a frame where he is already
driving and the T-APEX wall behind him is legible at a glance.

**Why 10.80s and not 11.04s.** The source fades to black at ~10.75s and then
holds pure black for another seven frames. Those are identical, so scrolling
through them is scrolling through nothing. 10.80 keeps the fade and one frame of
black to land on.

**Verify the trim before extracting.** Both ends are decisions the whole timeline
is built on, so look at them:
```bash
ffmpeg -v error -ss 3.0 -to 10.80 -i apexscroll.mp4 -vf "fps=1,scale=480:-1" \
  -q:v 3 /tmp/probe-%02d.jpg -y
```

### Checking a source before you cut it
Scene-detect first — a hard cut mid-segment will wreck the scrub:
```bash
ffmpeg -v error -i clip.mp4 -vf "select='gt(scene,0.2)',metadata=print:file=-" \
  -an -f null - 2>&1 | grep pts_time
```
This source is continuous across all 11s, which is why it needs no joins. Its
luma curve is the confirmation: a smooth 51 → 64 rise across the run and a clean
fall to 16 (video black) at the end, with no step anywhere.

### If you ever have to join two clips again
The previous cut did, and the rules it paid for are worth keeping:

1. **Grade the environments to match — that is the big one.** A change of
   *location* is what makes an edit read as "different video"; a change of angle
   is not. Crushing a lit hall to black with `curves` + a double `vignette` did
   more than any other single change.
2. **Zoom and re-centre** so the subject lands at a comparable size and the
   frame-edge giveaways are pushed out.
3. **Make the dissolve long** — 0.7s rather than 0.5s. Held over that duration
   the change of angle reads as the camera moving, not as a cut.
4. **Dissolve between frames that already share subject, scale and palette.** A
   dissolve between mismatched frames is just a slow cut, and a scrub makes that
   worse than a hard one, not better.
5. `xfade`'s `offset` is measured on the *incoming* chain, so each one is
   `(length so far) − (dissolve duration)`.

**Constraints for anything new you generate:**
- **One continuous move, no hard cuts.** Scrubbing amplifies every jump.
- **Constant camera speed** — the scroll supplies the pacing.
- **No on-screen text** — all copy is live HTML over the top.
- **Leave a tail.** Something to rest on after the subject clears frame: a fade,
  or ~1.5–2s of held shot. The hero's release lands on the last frame.
- **The longest duration the tool allows, at the highest fps.** Frame count is
  the budget the whole scrub is spent from, and it cannot be topped up later.
- Watch the luma: bright footage forces the `.cine-dim` cue to work harder and
  leaves less room for copy.

---

## 7. The resolution ceiling — read this before chasing sharpness

**Every source clip is 1280×720.** There is no 1080p in the material, so the
hero cannot be truly 1080p; any larger frame is interpolated. What was fixed
was the *avoidable* softness stacked on top of that:

| Cause | Fix |
|---|---|
| Frames extracted **below the width the canvas actually draws at** — 1152, then 1440, then 1600, against a backing store asking for ~1920 | Extract at **1920** with `lanczos` + a light `unsharp`. Now shipped, and §3's recipe and this section finally agree. |
| Canvas used the browser's default (cheap) resampler | `ctx.imageSmoothingQuality = 'high'` |
| Canvas backing store ran at DPR 2 — 4× the pixels with no extra detail to show for it | Capped at 1.5; costs nothing visually, gives the fill rate back to framerate |
| Phone sequence 640 wide behind a `maxDpr: 1.25` cap, so the band was resampled twice | 960 wide at `maxDpr: 2` — see §3b. **Both numbers have to move together.** |

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
standard 1080p desktop the backing store asks for 1920px and was being handed
1152, then 1440, then 1600. Extracting at 1920 makes it pixel-for-pixel on the
most common desktop configuration, using only pixels lanczos can honestly
interpolate. Measured side by side at that output size, the difference between a
1600 sequence and a 1920 one is visible on wall texture and small lettering, and
it costs 1.7 MB.

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
maps straight onto film frames (~18px of scroll per frame), so **one notch used
to jump ~6 frames at once**. No amount of extra frames fixes that; the input
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
