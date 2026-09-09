# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` — **22.29s, 535 frames at
> 24fps**, cut from two sources plus a rendered transition (§6). Extracted at
> `fps=16`, `scale=1920` (lanczos + light unsharp) → **357 frames at 1920×1080,
> 25.9 MB**, plus a phone sequence at 960×540 / `fps=12`, 268 frames, 7.5 MB.
>
> **The read the whole cut exists to protect:**
>
> > **You watch the machine. It opens. You fly through it, and out the far end an
> > athlete is running at you.**
>
> - **0.0–2.9s** — the T-APEX machine alone on a pure black plate, deep down the
>   lens, turning to face camera.
> - **2.9–4.8s** — ✦ **the panels open**, internals lit.
> - **4.8–13.4s** — the fly-through: spool, motor, gears, copper, circuit macros,
>   the chip. The longest act, and the brightest.
> - **13.4–14.5s** — the camera banks up and out into a red grid tunnel.
> - **14.5–17.0s** — ✦ **it flies THROUGH the opening at the end of the tunnel**
>   and out into an indoor training hall. Rendered frame by frame, not dissolved
>   — see §6.
> - **17.0–20.3s** — the athlete drives toward the lens, the same machine
>   trackside paying cable; the ARI overlay floods his musculature.
> - **20.3–22.29s** — he comes apart into particles and the frame fades to black.
>
> **The tail problem is solved, and the fix must be preserved.** An earlier cut
> ended with the sprinter still half in shot — a body frozen mid-stride at the
> frame edge — and no amount of scrub timing hid it. This one ends on the second
> source's own **fade to black**, so the last frame of the film and the last pixel
> of the pin are the same moment: the hero resolves to black and releases into
> `<ScrollExpandVideo/>` black-to-black. Do not trim that fade off to reclaim the
> ~9 % of scroll it costs — that 9 % *is* the transition.
>
> **Two exposures in one film.** Acts A–B are a near-black product plate;
> everything after is lit, and the *fly-through* is the brightest thing in the cut
> (mean Y≈72 in the HUD's flank), not the hall (61 under the closing statement).
> That drives two things that would otherwise look arbitrary — the camera push has
> to cross 1.0 partway through (§1) and `.cine-dim` has to be scheduled rather
> than set (§1). Neither is a taste setting.
>
> **⚠ Check every source for duplicate frames before you cut it.** The upscaled
> sprint arrived as a 30fps file whose real content was 24fps — **one frame in
> five was an exact duplicate**, the signature of a 24fps timeline exported at 30.
> In a video nobody notices. In a scrub a duplicate is a *stall at a fixed scroll
> position*, hit on every pass, in the same place every time. The check is cheap
> and there is a script for it in §6; `fps=<true rate>` removes them.
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

As the visitor scrolls the hero (**6100px pinned, ~6 viewport-heights**), in
nine acts. Percentages below are timeline progress, which is also scroll progress
across the pin.

- **ACT 0 — HOLD (0–4.5%).** Pure black, *TRAIN BEYOND HUMAN LIMITS* alone. Kept
  deliberately short — it doubles as the loading state, and scrubbing arms once
  the first 18 frames decode.
- **ACT 1 — SPLIT (4.5–17%).** The headline parts on a `power2.out` ease. A blue
  seam opens across the gap and the film is revealed *by* the split: a `clip-path`
  aperture unclips vertically from that seam.
- **ACT A — INTRO (4.5–17%).** The machine on its black plate, at 0.34 scale,
  travelling in and turning to face camera.
- **ACT B — OPEN (17–26%).** ✦ **The panels open.** The headline halves clear at
  17%, immediately before they move.
- **ACT C — FLY (26–62%).** Through the interior. The longest act, and where the
  telemetry HUD lives (34–53%) — a live instrument readout means something over
  the machine's own internals, which is a better home for it than over an athlete.
- **ACT D — THROUGH (62–76%).** The red grid tunnel, then ✦ **the flight through
  its far opening.**
- **ACT E — RUN (76–85%).** The athlete driving toward the lens.
- **ACT F/G — CHARGE & DISSOLVE (85–100%).** The ARI overlay; *WHEN PERFORMANCE
  MEETS INTELLIGENCE* lands at 84.5% and clears at 95.5% as he comes apart into
  particles and the frame falls to black on the last pixel of the pin.

### ⭐ The camera push has to cross 1.0, and only once

This is the number a future edit is most likely to get wrong, because the correct
value is *opposite* at the two ends of the film:

- **Acts A–B sit on a pure black plate.** Drawing the frame *under* 1.0 puts black
  around it, which reads as **distance** — the machine is a long way down the lens
  and flies in. Nothing else can buy that: the footage holds the machine at a
  constant size, so the travel is entirely the push. Hence **0.34**.
- **From act C on the frame is filled** — interior, then tunnel, then hall — and
  `fit: 'cover'` sizes the frame to exactly fill the screen at 1.0. Anything under
  it letterboxes, and on a filled shot a letterbox reads as **black bars**.

So the push must reach 1.0 by the end of act B and must never go back. Past 1.0
keep the increments small (1.06 → 1.24 across the rest): act D contains a rendered
fly-through of its own, and a push-in on top of a push-in is two motions fighting.

### Where the content sits (scroll progress → shot)

357 frames, scrubbed across `0.045 → 1.0`. Act boundaries are stored as **ratios**
of the sequence, not frame indices, so the phone — 268 frames, a shorter pin —
lands every cut on the same moment of the film.

| Progress | Frames | On screen | px/frame |
|---|---|---|---:|
| 0.045–0.170 | 1–47 | the machine alone on black, turning to face camera | ~16.6 |
| 0.170–0.262 | 47–78 | ✦ **the panels open**, internals lit | ~18.1 |
| 0.262–0.615 | 78–215 | the fly-through — spool, gears, copper, circuits, the chip | ~15.7 |
| 0.615–0.760 | 215–272 | the red tunnel, then ✦ **through its far opening** | ~15.5 |
| 0.760–0.845 | 272–304 | the athlete driving out of the far end | ~16.2 |
| 0.845–0.905 | 304–326 | the charge — the ARI overlay | ~16.6 |
| 0.905–1.0 | 326–357 | particles, then black on the last frame of the pin | ~18.7 |

**The allocation is deliberately near-flat** — every leg between 15.5 and 18.7
px/frame. Earlier cuts of this hero spent 24px/frame on the opening to "give the
hero shot room"; that trade made sense when the opening was 19 % of the sequence,
but this film is long enough that every act gets real screen time from a
proportional split, and flat scrubs smoother.

**The flight through the tunnel gets 39 frames and ~605px of scroll.** The first
cut of it was 12 frames and 200px and flashed past. It is the signature shot of
the hero and the only one that exists in neither source, so it was made *longer in
the master* rather than given more scroll — more scroll across 12 frames only
makes 12 frames step.

**Two layout rules this footage forces:****Two layout rules this footage forces:**

1. **Nothing goes on screen during the box opening.** It is the centrepiece; the
   headline halves are timed to clear at 25%, immediately before it starts.
2. **Copy can't just sit on the film, and one dim level cannot serve it.** This
   cut has two exposures in it. `.cine-dim` is therefore scheduled like a
   lighting cue, and its levels are **derived, not eyeballed**: measure the mean
   luma of the zone each beat actually occupies, then solve for the opacity that
   lands the backdrop near **Y≈32**, which is where the metallic type holds its
   contrast.

   | beat | act | zone | measured Y | → dim |
   |---|---|---|---:|---:|
   | split headline | A | centre band, black plate | ~8 | 0.16 |
   | telemetry HUD | C | left / right flank, fly-through | 72 | 0.52 |
   | closing statement | F | centre band, the charge | 61 | 0.50 |

   Note the HUD needs **more** scrim than the closing statement despite being
   smaller type: the circuit macros behind it are brighter than the hall. That is
   exactly why the levels are measured per zone rather than set once.

   Between the beats the scrim drops to **0.05** over the panels opening — the
   film at full strength, affordable only because a near-black plate has nothing
   to lift off — and to **0.10** across the tunnel and the flight through it,
   which is as clear as a lit shot gets without flaring. That second window runs
   from 0.58 to 0.845: about 1600px of scroll with nothing written on it at all,
   covering the tunnel, the flight, and the athlete arriving. The emptiness is
   the point.

   If you recut, **re-measure and re-time the cue**. Crop to the zone the beat
   occupies rather than measuring the whole frame — a centred headline over a
   dark-edged shot is a completely different problem from the frame average:
   ```bash
   # centre band (closing statement); use crop=280:340:0:190 for the left flank
   ffmpeg -v error -i public/apex-hero-cinema.mp4 \
     -vf "fps=6,crop=800:280:240:210,signalstats,\
          metadata=print:key=lavfi.signalstats.YAVG:file=-" -an -f null -
   ```

---

## 2. The ideal footage (what to generate)

**One continuous 10–15s clip at the timeline's true frame rate**, 16:9. Length is
the budget the entire scrub is spent from and it cannot be topped up afterwards:
the sprint source used on its own would have forced the pin down to ~3400px,
where the full cut supports 6100. Frame *rate* is a different matter — export at
the real rate rather than the highest available, because anything above the true
rate is duplicated frames, and this pipeline has to strip them back out (see the
warning at the top).

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
     -vf "fps=16,scale=1920:1080:flags=lanczos,unsharp=5:5:0.4:3:3:0.2" \
     -f image2 -c:v libwebp -quality 70 \
     public/hero-frames/frame-%03d.webp
   ```
   **Never extract at a rate that is not an exact divisor of the master's.** 16
   and 12 both divide 24, so every kept frame is evenly spaced. A non-divisor
   (20 from 24, say) keeps an uneven cadence — one frame in six covers double the
   motion — and never invent frames by extracting *above* the master's rate,
   which duplicates them; a duplicate under a scrub is a stall at a fixed scroll
   position. (Do not reach for `minterpolate` either — on thin limbs and particle
   effects it warps.)

   **Extracting below the master's rate is a legitimate, separate decision.** It
   is how the sequence's weight is controlled, and it costs nothing in scroll
   smoothness, which is governed by px-of-scroll-per-frame, not by source fps —
   see the sizing note below.

   `lanczos` + a light `unsharp` matter: the source is 720p and the canvas asks
   for ~1920, so *something* has to upscale. Doing it once here beats the
   browser's runtime resampler — measured side by side at the same output size,
   the pre-upscale holds wall texture and lettering the browser path smears.
   Keep the unsharp light (0.4/0.2); the previous recipe's 0.7/0.35 was set for
   a source that had already been sharpened by an upscaler.
3. Extract the **phone** sequence into `public/hero-frames-mobile/` — same cut,
   three quarters the frames, 960×540 (see §3b):
   ```bash
   rm -f public/hero-frames-mobile/*.webp
   ffmpeg -y -i public/apex-hero-cinema.mp4 \
     -vf "fps=12,scale=960:540:flags=lanczos" \
     -f image2 -c:v libwebp -quality 66 \
     public/hero-frames-mobile/frame-%03d.webp
   ```
   No `unsharp` here: 960 from a 1280 source is a *downscale*, and sharpening a
   downscale just adds ringing.
4. Update **both** frame counts in `src/components/ScrollCinemaHero.tsx` —
   `DESKTOP.frameCount` and `MOBILE.frameCount` — re-check `pinDistance` against
   the new count (see the px/frame rule below), and re-derive the `ACTS` table:
   the frame ratios have to land on the new cut's actual beats, and `zoom` is a
   parallel array that must stay exactly one entry longer.
5. Re-measure luma and re-time the `.cine-dim` cue (see §1). If the new cut also
   mixes a dark plate with a lit environment, re-check the `zoom` crossing too.
6. `npm run build` to verify, then commit both frame directories + the component.

### ⭐ Sizing the pin to the frame count
This is the number that decides whether the scrub reads as motion or as stepping,
and it is a **consequence of the footage, not a taste setting**:

```
pinDistance ÷ frameCount  →  keep it in the 15–20 px/frame band
```

357 frames × ~17 px = 6100 desktop; 268 × ~15.7 px = 4200 phone (finer, because
touch has no Lenis interpolation upstream of it — see §8).

**6100px is a long hero — about six viewport heights — and that is the honest
cost of a 22-second film.** There is no way to play 22 seconds of footage in less
scroll without either skipping frames or cutting the film. If it ever has to be
shorter, take it out of **act C**, the fly-through, which is 35 % of the pin and
the least load-bearing stretch in the cut.

Verify it rather than trusting it. Hook `drawImage` and record which sequence
frame is painted on each animation frame; under a slow, deliberate scroll the
film should never advance **more than one frame per painted frame**:

| scroll | paints over the pin | median jump | p95 | max jump | stalls |
|---|---:|---:|---:|---:|---|
| deliberate (~330 px/s) | 734 | 0 | 1 | **1** | none |
| brisk (~1800 px/s) | 205 | 2 | 3 | 3 | none |

(Measured in headless Chromium, whose software renderer caps rAF at ~18 fps — so
the paint counts are a floor, and the jumps a ceiling, versus real hardware.)

### 3b. The phone sequence
Phones run the same acts off their own sequence: **268 frames at 960×540,
7.5 MB** (WebP q66, `fps=12`), with `readyFrames: 12` (~340 KB) gating the start.

That is **three quarters of the desktop count, because the phone's pin is three
quarters as long** — 268 frames over 4200px is ~15.7 px/frame against desktop's
~17. Matching desktop's 357 here would buy nothing the shorter pin can reach and
cost 2.5 MB on a phone. Both rates (16 and 12) divide the master's 24 exactly, so
neither sequence has an uneven cadence.

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

960 is also a *downscale* from the 1920-wide master rather than an upscale, which
is why 268 frames cost only 7.5 MB.

### Sizing the sequence — the real trade-off
Frame **count** sells smoothness far more than frame **resolution**: the scrub is
a temporal effect, and a soft frame in motion reads fine where a chunky one does
not. So when the budget gets tight, drop `scale` before you drop `fps` — and on a
cut this short, never drop `fps` at all: 24 is every real frame the source has.

Measured on the current master (28 frames sampled across the whole cut, WebP,
lanczos, light unsharp above 1280):

| desktop | KB/frame | 357-frame sequence | note |
|---|---:|---:|---|
| 1440×810 q70 | 56.3 | 19.7 MB | visibly soft on the circuit macros |
| 1600×900 q68 | 62.0 | 21.7 MB | still blurs the fine copper traces |
| 1920×1080 q58 | 66.9 | 23.4 MB | quality-only cut; buys little, costs visibly |
| **1920×1080 q70 — shipped** | **74.4** | **25.9 MB** | pixel-for-pixel on a 1080p desktop |

| phone | KB/frame | 268-frame sequence |
|---|---:|---:|
| 800×450 q64 | 22.6 | 5.9 MB |
| **960×540 q66 — shipped** | **28.7** | **7.5 MB** |

**On this footage the usual rule inverts, and that is worth understanding.** The
brief has long said *frame count sells smoothness more than resolution, so drop
`scale` before you drop `fps`* — and that was right when the sources were upscaled
from 720p, because resolution there was fake detail. This cut's first source is
**native 1920×1080**, and the fly-through is dense: circuit macros, cable texture,
machined edges. Rendered to the same 1920 canvas and compared side by side, a 1600
sequence visibly blurs the copper traces running into the chip. So here the
resolution is real and the *frame rate* is the cheaper thing to spend: the
sequence is extracted at `fps=16` rather than 24, which costs nothing in scroll
smoothness (that is governed by px-of-scroll-per-frame — 17 either way) and takes
a third off the weight.

Net: **25.9 MB desktop / 7.5 MB phone**, against 22.4 / 2.7 for a cut that was
half the length and had no fly-through in it.

AVIF at comparable quality measures about a third smaller than WebP *and*
sharper. It is still **not** adopted: AVIF decodes considerably slower, and a
decode stall during a scrub costs smoothness, which is the more valuable of the
two. Revisit only if the weight has to come down.

Neither number decides how the page *feels*. Only `readyFrames` gate the start
(18 desktop ≈ 1.3 MB, 12 phone ≈ 340 KB) and the rest streams in behind Act 0's
black hold, so time-to-interactive beats the contiguously-buffered video the hero
originally ran. If the weight genuinely has to come down, **shorten act C** — the
fly-through is 35 % of the pin and the least load-bearing stretch in the cut, and
cutting film beats degrading every frame of it.

### Load ordering
The opening frames are fetched at `fetchPriority: 'high'` and the rest at
`'low'`, so frame 4 doesn't queue behind frame 150 — which nobody sees for
another three thousand pixels of scroll. The ready gate counts the **first** N
frames specifically, not any N completions; counting completions let a scattered
set of late arrivals satisfy it while the opening was still in flight.

### Optional tuning knobs (the `DESKTOP` / `MOBILE` configs in `ScrollCinemaHero.tsx`)
- `pinDistance` — px of scroll the hero stays pinned (`'+=6100'` desktop,
  `'+=4200'` phone). Keep it near **15–20 px of scroll per frame** or the scrub
  changes feel — it is a function of `frameCount`, not a free parameter. Phones
  get less because a thumb covers ground far faster than a wheel, and a 6100px
  pin on a phone reads as the page having stopped.
- `ACTS` — the act table: `[frame ratio, scroll progress]` at the end of each
  act. The frame scrub *and* the camera push are both generated from it, one leg
  per act, precisely so they cannot drift apart — a push that changes gear at a
  different scroll position from the footage visibly slides against it.
- `zoom` — the camera push, per device: the scale at HOLD and then at the end of
  each act, so it is always exactly `ACTS.length + 1` long
  (`[0.34, 0.62, 1.06, 1.10, 1.12, 1.16, 1.20, 1.24]` desktop; the phone's is
  multiplied by `baseScale: 1.35` before it hits the canvas). Read §1 before
  touching it — the sub-1.0 opening and the crossing to ≥1.0 are both
  load-bearing, and for opposite reasons.
- Every leg is **linear**. Pacing lives in how much scroll each act gets, not in
  easing: an eased leg accelerates the film *within* a shot, which reads as the
  video speeding up rather than as the page moving.
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
| 1 | Camera moves toward the T-Apex | ✅ **act A** — the machine on its black plate, flown in by the camera push (§1). |
| 2 | Panels split and open along the seams, glowing internals revealed | ✅ **act B** — the centrepiece of the hero. Nothing is written over it. |
| 3 | Fly-through of the interior — cable spool, machined gears, circuit-lined walls | ⚠️ **glimpsed, not travelled.** The internals are visible as the panels open and again through the dissolve, but the cut no longer flies through them. The full fly-through exists in the previous master if a future cut wants it back — budget ~4s and a longer pin. |
| 4 | Bank up, burst out into black space, dissolve to a scanning-grid HUD tunnel | ❌ never used in any cut. |
| 5 | Performance centre — sprinter at camera, follow the electric rope, settle on the device | ✅ **acts C–E**, plus the ARI overlay beat the storyboard never asked for. |

**What the cut gives up, and where it is covered.** Dropping the interior
fly-through means nobody *travels* through the machine any more. `ProductShowcase`
and `DeviceStructureSection` carry that job further down the page, where a reader
who wants engineering detail is actually looking for it. What the hero keeps is
the part that only a hero can do: the product introduced, opened, and then handed
to a human.

---

## 6. How the master is cut

Two sources and one **rendered** transition. The transition is the whole design,
so it gets its own section below.

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | `Untitled_design.mp4` (1920×1080 / 30fps, 15.03s) | **0.00–14.53** | the machine on black, the panels opening, the fly-through, and the red tunnel |
| 2 | *rendered* — `docs/portal-transition.py` | 58 frames | ✦ the flight **through** the tunnel's far opening |
| 3 | the upscaled sprint (1920×1080, 24fps content) | **2.4167–7.75** | the run, the charge, the fade to black |

```bash
# 0 — strip the duplicate frames from the sprint FIRST (see the warning up top:
#     it arrived as 24fps content in a 30fps wrapper, 1 frame in 5 a duplicate)
ffmpeg -y -i sprint-upscaled.mp4 -vf "fps=24" -an \
  -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p spr24.mp4

# 1 — the two layers the transition composites, both at the master's rate
mkdir -p ptun pspr
ffmpeg -v error -ss 14.53 -i Untitled_design.mp4 -vf "fps=24" -f image2 ptun/f-%03d.png
ffmpeg -v error -t 2.6         -i spr24.mp4      -vf "fps=24" -f image2 pspr/f-%03d.png

# 2 — render the flight through the opening
python3 docs/portal-transition.py ptun pspr pout 58

# 3 — concatenate. No dissolves anywhere: segment 2 already IS the transition.
ffmpeg -y -i Untitled_design.mp4 -framerate 24 -i pout/t-%03d.png -i spr24.mp4 \
  -filter_complex "\
[0:v]trim=0:14.53,setpts=PTS-STARTPTS,fps=24,format=yuv420p[a];\
[1:v]format=yuv420p[b];\
[2:v]trim=2.4167:7.75,setpts=PTS-STARTPTS,fps=24,format=yuv420p[c];\
[a][b][c]concat=n=3:v=1:a=0[out]" \
  -map "[out]" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  public/apex-hero-cinema.mp4
```

**Why the master is 24fps when one source is a real 30.** Segment 1 is genuinely
30fps; segment 3's real content is 24. Going to 30 would mean duplicating frames
in segment 3 — a stall at a fixed scroll position on every pass. Going to 24 means
dropping 1 real frame in 5 from segment 1, which a scrub does not care about
because it has no clock: fewer distinct frames simply makes that act sample the
motion slightly more coarsely, and the site extracts at 16 anyway. **Always
resample down to the slowest true rate, never up.**

### ⭐ The flight through the tunnel

The tunnel clip ends looking down a red grid corridor whose far end is a soft dark
opening, measured at **(960, 592)** with a half-extent of **215 × 113** on the last
frame. `docs/portal-transition.py` continues that flight *through* the opening:

- **back** — the sprint frame, cover-fit, settling from a slight over-scale to 1.0
- **mask** — a soft-edged superellipse at the opening, growing with the flight
- **front** — the tunnel frame, scaled about the *same* point so the geometry
  tracks, knocked out by the mask

Growth is exponential and **eased in** (`K**(t**1.6)`, K=6). Constant-velocity
approach is exponential in apparent size, so a plain `K**t` is the honest curve —
but only about a dozen real tunnel frames exist before the layer has to hold its
last one, and a plain curve spends them in the first fifth. Easing the growth in
keeps the real footage carrying the opening and holds the athlete framed inside
the tunnel mouth long enough to be a composition rather than a flash.

**Nothing crossfades.** The tunnel leaves the screen by being flown past; by t=1
the mask covers the frame and the tunnel layer is fully knocked out. That is what
makes it survive being scrubbed, which no video transition ever has to: a viewer
can stop anywhere in it, and every intermediate frame is a real composition —
around 50 % the athlete is framed dead centre in the red tunnel mouth.

**Two things that will bite whoever edits this next:**

1. **The far scene must land on scale 1.0 on the final frame**, because segment 3
   continues from there at 1.0. The first version pushed it 1.0 → 1.10 and left a
   **20/255 jump** at the seam. It now settles 1.12 → 1.0 instead — which also
   reads better, as arriving rather than still travelling.
2. **Doing this in Python is deliberate.** Two time-varying scales about an
   off-centre point plus a soft procedural mask is a lot of ffmpeg expression
   syntax to get subtly wrong, and every frame here can be eyeballed before it is
   committed to.

### Checking a source before you cut it

Two checks, both cheap, both of which have caught a real defect in this project:

```bash
# 1 — hard cuts. Scrubbing amplifies every jump.
ffmpeg -v error -i clip.mp4 -vf "select='gt(scene,0.2)',metadata=print:file=-" \
  -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"

# 2 — duplicate frames. A 24fps timeline exported at 30 has 20% of them, and in
#     a scrub each one is a stall at a fixed scroll position.
ffmpeg -v error -ss 4 -t 2 -i clip.mp4 -vf scale=480:-1 -vsync 0 dq/f-%03d.png
python3 - <<'EOF'
import numpy as np, pathlib
from PIL import Image
prev = None; dup = n = 0
for f in sorted(pathlib.Path("dq").glob("*.png")):
    im = np.asarray(Image.open(f).convert("L"), np.float32)
    if prev is not None:
        n += 1
        if np.abs(im - prev).mean() < 0.15: dup += 1
    prev = im
print(f"{dup}/{n} duplicates ({100*dup/n:.0f}%)")
EOF
```

Check 1 is also how segment 1's out-point was found: it reports a clean break at
2.9s (the panels starting to move) and a dense run from 4.4s, which is the *old*
master's own dissolve. 14.53 sits at the end of the tunnel, one frame before the
opening starts to fill.

### If you have to join two clips with a dissolve

Sometimes there is no portal to fly through. The rules this project has paid for,
in order:

1. **Grade the environments to match — that is the big one.** A change of
   *location* is what makes an edit read as "different video"; a change of angle
   is not.
2. **Zoom and re-centre** so the subject lands at a comparable size.
3. **Make the dissolve long** — 0.7–0.9s, not 0.5s.
4. **Dissolve between frames that already share subject, scale and palette.** A
   dissolve between mismatched frames is just a slow cut, and a scrub makes that
   worse than a hard one, not better.

**Constraints for anything new you generate:**
- **One continuous move, no hard cuts.** Scrubbing amplifies every jump.
- **Constant camera speed** — the scroll supplies the pacing.
- **No on-screen text** — all copy is live HTML over the top.
- **Leave a tail.** Something to rest on after the subject clears frame: a fade,
  or ~1.5–2s of held shot. The hero's release lands on the last frame.
- **Export at the timeline's true frame rate.** Not 30 "because it's smoother" —
  that only duplicates frames, and this pipeline has to strip them back out.
- **The longest duration the tool allows.** Frame count is the budget the whole
  scrub is spent from, and it cannot be topped up later.
- Watch the luma: bright footage forces `.cine-dim` to work harder and leaves
  less room for copy.

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
maps straight onto film frames (~17px of scroll per frame), so **one notch used
to jump ~7 frames at once**. No amount of extra frames fixes that; the input
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
