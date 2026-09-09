# T-Apex Scroll-Cinema — AI Video Shot Brief & Pipeline

This is the production brief for the **pinned, scroll-scrubbed hero** built in
`src/components/ScrollCinemaHero.tsx`. It tells you exactly what footage to
generate (Higgsfield / Seedance 2.0) and how to drop it into the site.

> **Current footage:** `public/apex-hero-cinema.mp4` — **11.75s, 282 frames at
> 24fps**, cut from two sources with one dissolve (§6). Extracted at native
> `fps=24`, `scale=1920` (lanczos + light unsharp) → **282 frames at 1920×1080,
> 14.4 MB**, plus a phone sequence at 960×540, 5.5 MB.
>
> **The read the whole cut exists to protect:**
>
> > **You watch the machine. That machine opens. The athlete comes out of it.**
>
> - **0.0–2.9s** — the T-APEX machine alone on a pure black plate, deep down the
>   lens, travelling in and turning to face camera.
> - **2.9–3.9s** — ✦ **the panels open**, internals lit: cable spool, motor,
>   gears. This is the centrepiece of the hero and nothing may be written over it.
> - **3.9–4.8s** — a 0.9s dissolve carries the camera *through* the open machine
>   and into an indoor training hall.
> - **4.8–10.5s** — the athlete drives out of the far end of that hall toward the
>   lens, the same machine now trackside paying out its cable; the ARI overlay
>   floods his musculature in red and blue.
> - **10.5–11.75s** — he comes apart into particles and the frame fades to black.
>
> **The tail problem is solved, and the fix must be preserved.** An earlier cut
> ended with the sprinter still half in shot — a body frozen mid-stride at the
> frame edge — and no amount of scrub timing hid it. This one ends on the second
> source's own **fade to black**, so the last frame of the film and the last pixel
> of the pin are the same moment: the hero resolves to black and releases into
> `<ScrollExpandVideo/>` black-to-black. Do not trim that fade off to reclaim the
> ~10 % of scroll it costs — that 10 % *is* the transition. Any replacement
> footage needs the same property: something to rest on after the subject clears.
>
> **Two exposures in one film.** Acts A–B are a near-black product plate; acts
> C–E are a lit hall (Y≈55, rising to 73 under the charge). That single fact
> drives two things that would otherwise look arbitrary — the camera push has to
> cross 1.0 partway through (§1) and `.cine-dim` has to be scheduled rather than
> set (§1). Neither is a taste setting.
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

As the visitor scrolls the hero (**4900px pinned, ~5 viewport-heights**), in six
acts. Percentages below are timeline progress, which is also scroll progress
across the pin.

- **ACT 0 — HOLD (0–4.5%).** Pure black, *TRAIN BEYOND HUMAN LIMITS* alone. Kept
  deliberately short: at 10% the headline took five wheel notches to budge and
  read as broken. (It doubles as the loading state — scrubbing arms once the
  first 18 frames decode, the rest stream in behind.)
- **ACT 1 — SPLIT (4.5–25%).** The headline parts — `TRAIN BEYOND` rises, `HUMAN
  LIMITS` drops — on a `power2.out` ease so they break apart on contact rather
  than creeping. A blue seam opens across the gap and the film is revealed *by*
  the split: a `clip-path` aperture unclips vertically from that seam.
- **ACT A — INTRO (4.5–25%).** The machine on its black plate, deep down the lens
  at 0.34 scale, travelling in and turning to face camera.
- **ACT B — OPEN (25–42%).** ✦ **The panels open.** Then the push carries on
  through the 0.9s dissolve into the hall. The headline halves clear at 25%,
  immediately before the panels move.
- **ACT C — APPROACH (42–60%).** The athlete drives out of the far end toward the
  lens. Telemetry HUD lands at 53%, flanked left and right at 11–13% inset, not
  centred — he owns the middle of frame the whole way.
- **ACT D/E — CHARGE & DISSOLVE (60–100%).** The ARI overlay floods him; *WHEN
  PERFORMANCE MEETS INTELLIGENCE* lands at 78% and holds through the peak,
  clearing at 95% as he comes apart into particles and the frame falls to black
  on the last pixel of the pin.

### ⭐ The camera push has to cross 1.0, and only once

This is the one number that a future edit is most likely to get wrong, because
the correct value is *opposite* at the two ends of the film:

- **Acts A–B sit on a pure black plate.** Drawing the frame *under* 1.0 puts
  black around it, which reads as **distance** — the machine is a long way down
  the lens and flies in. Nothing else can buy that: the footage holds the machine
  at a constant size, so the travel is entirely the push. This is why it starts
  at **0.34**.
- **From act C on it is a lit hall**, and `fit: 'cover'` sizes the frame to
  exactly fill the screen at 1.0. Anything under it letterboxes, and on a lit
  shot a letterbox reads as **black bars**, not as distance.

So the push must reach 1.0 by the end of act B and must never go back. Past 1.0
keep the increments small (1.06 → 1.22 across the rest) — the athlete is already
sprinting at the lens, and a push-in on top of a push-in is two motions fighting.

That crossing does a second job: the camera is still moving *through* the
dissolve, and continuous motion across a join is what makes two generations read
as one move rather than as two clips.

### Where the content sits (scroll progress → shot)

282 frames, scrubbed across `0.045 → 1.0`. The act boundaries are stored as
**ratios** of the sequence, not frame indices, so the phone — same frames,
shorter pin — lands every cut on the same moment of the film.

| Progress | Frames | On screen | px/frame |
|---|---|---|---:|
| 0.045–0.25 | 1–70 | the machine alone on black, travelling in and turning | ~14.6 |
| 0.25–0.42 | 70–116 | ✦ **the panels open**, internals lit — then the dissolve through into the hall | ~18.1 |
| 0.42–0.60 | 116–164 | the athlete driving out of the far end, machine trackside | ~18.4 |
| 0.60–0.90 | 164–253 | the charge — the ARI overlay floods his musculature | ~16.5 |
| 0.90–1.0 | 253–282 | particles, then black on the last frame of the pin | ~16.9 |

**The allocation is deliberately uneven, and the shape is the inverse of the
footage's own speed.** The coarsest rate goes on the act that moves least; the
finest on the dissolve, where the picture changes fastest. A flat allocation
would have spent 26 px/frame on act A and starved act E.

**Two layout rules this footage forces:**

1. **Nothing goes on screen during the box opening.** It is the centrepiece; the
   headline halves are timed to clear at 25%, immediately before it starts.
2. **Copy can't just sit on the film, and one dim level cannot serve it.** This
   cut has two exposures in it. `.cine-dim` is therefore scheduled like a
   lighting cue, and its levels are **derived, not eyeballed**: measure the mean
   luma of the zone each beat actually occupies, then solve for the opacity that
   lands the backdrop near **Y≈32**, which is where the metallic type holds its
   contrast.

   | beat | act | backdrop | measured Y | → dim |
   |---|---|---|---:|---:|
   | split headline | A | black plate | ~8 | 0.16 |
   | telemetry HUD | C | hall, left/right flank | 63 | 0.46 |
   | closing statement | D | hall, centre band | 73 | 0.56 |

   Between the beats it drops to **0.05** over the panels opening — the film at
   full strength, and it can go that far because a near-black plate has nothing
   to lift off — and to **0.14** between the HUD and the closing line, which is
   as clear as a lit hall gets without the shot flaring.

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

**One continuous 10–15s clip at the highest fps the tool offers**, 16:9. Length
and frame rate are the budget the entire scrub is spent from, and neither can be
topped up afterwards. The 7.8s second source used on its own would have forced
the pin down to ~3400px; it takes the 4.8s product segment joined in front of it
to get the hero back to a full 4900.

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
   `DESKTOP.frameCount` and `MOBILE.frameCount` — re-check `pinDistance` against
   the new count (see the px/frame rule below), and re-derive the `ACTS` table:
   the frame ratios have to land on the new cut's actual beats.
5. Re-measure luma and re-time the `.cine-dim` cue (see §1). If the new cut also
   mixes a dark plate with a lit environment, re-check the `zoom` crossing too.
6. `npm run build` to verify, then commit both frame directories + the component.

### ⭐ Sizing the pin to the frame count
This is the number that decides whether the scrub reads as motion or as stepping,
and it is a **consequence of the footage, not a taste setting**:

```
pinDistance ÷ frameCount  →  keep it in the 15–20 px/frame band
```

282 frames × ~17 px = 4900 desktop; × ~13 px = 3600 phone (finer, because touch
has no Lenis interpolation upstream of it — see §8). Note the desktop figure is a
*different* 4900 from the pin an earlier cut used: that one carried 318 frames
extracted at `fps=14` from a 22.7s film, where this carries every real frame of
an 11.75s cut at 24fps. Same scroll distance, considerably more film per pixel.

Verify it rather than trusting it. Hook `drawImage` and record which sequence
frame is painted on each animation frame; under a slow, deliberate scroll the
film should never advance **more than one frame per painted frame**:

| scroll | paints over the pin | median jump | p95 | max jump | stalls |
|---|---:|---:|---:|---:|---|
| deliberate (~330 px/s) | 593 | 0 | 1 | **2** | none |
| brisk (~1800 px/s) | 175 | 2 | 3 | 4 | none |

(Measured in headless Chromium, whose software renderer caps rAF at ~18 fps — so
the paint counts are a floor, and the jumps a ceiling, versus real hardware.)

### 3b. The phone sequence
Phones run the same acts off their own sequence: **282 frames at 960×540,
5.5 MB** (WebP q66), with `readyFrames: 12` (~240 KB) gating the start.

It is the **same frame count as desktop, not half of it.** The phone used to run
every second frame because an older desktop cut had 318 to spare; this one does
not — halving it would put ~26 px of scroll on every frame against a shorter pin,
which steps.

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

960 is also a *downscale* from the 1280-wide sources rather than an upscale,
which is why 282 frames cost only 5.5 MB.

### Sizing the sequence — the real trade-off
Frame **count** sells smoothness far more than frame **resolution**: the scrub is
a temporal effect, and a soft frame in motion reads fine where a chunky one does
not. So when the budget gets tight, drop `scale` before you drop `fps` — and on a
cut this short, never drop `fps` at all: 24 is every real frame the source has.

Measured on the current 282-frame master (WebP, lanczos, light unsharp above
1280):

| desktop | KB/frame | sequence | note |
|---|---:|---:|---|
| 1280×720 q76 (native, no upscale) | 40.2 | 11.1 MB | softest — the browser still upscales it to ~1920 at draw time |
| 1600×900 q72 | 53.0 | 14.6 MB | better, but still under-supplies the canvas |
| **1920×1080 q70 — shipped** | **52.5** | **14.4 MB** | pixel-for-pixel on a 1080p desktop |

| phone | KB/frame | sequence |
|---|---:|---:|
| 640×360 q68 | 14.1 | 4.0 MB |
| **960×540 q66 — shipped** | **19.8** | **5.5 MB** |

(The 1920 row landing at roughly the same KB/frame as 1600 is not a mistake: a
third of this cut is a black plate with a single object on it, which costs almost
nothing to encode at any resolution.)

**The resolution question is settled by where the canvas draws, not by the source
size.** A 1280-wide source into a ~1920-wide backing store gets upscaled either
way; the only choice is whether lanczos does it once, offline, or the browser
does it every frame. Rendered to the same 1920 output and compared side by side,
the pre-upscaled frames hold the wall texture and the T-APEX lettering that the
browser path smears. That is why 1920 is the right extraction size here, and it is the first time
this pipeline's extraction and §7's recommendation have agreed.

Net against what this replaced: **22.4 MB → 14.4 MB desktop**, despite this cut
carrying every real frame of its sources at 24fps where the old one sampled a
22.7s film at `fps=14`. The phone sequence went the other way — 2.7 → 5.5 MB —
buying both the extra frames and the 960/DPR-2 pairing in §3b, which is a visible
sharpness win on the screens that can show it.

AVIF at comparable quality measures about a third smaller than WebP *and*
sharper. It is still **not** adopted: AVIF decodes considerably slower, and a
decode stall during a scrub costs smoothness, which is the more valuable of the
two. Revisit only if the weight has to come down.

Neither number decides how the page *feels*. Only `readyFrames` gate the start
(18 desktop ≈ 950 KB, 12 phone ≈ 240 KB) and the rest streams in behind Act 0's
black hold, so time-to-interactive beats the contiguously-buffered video the hero
originally ran. If the weight ever genuinely has to come down, take **frames out
of act A** before you take pixels out of every frame — the machine turning on
black is the least eventful stretch in the cut and the cheapest to thin.

### Load ordering
The opening frames are fetched at `fetchPriority: 'high'` and the rest at
`'low'`, so frame 4 doesn't queue behind frame 150 — which nobody sees for
another three thousand pixels of scroll. The ready gate counts the **first** N
frames specifically, not any N completions; counting completions let a scattered
set of late arrivals satisfy it while the opening was still in flight.

### Optional tuning knobs (the `DESKTOP` / `MOBILE` configs in `ScrollCinemaHero.tsx`)
- `pinDistance` — px of scroll the hero stays pinned (`'+=4900'` desktop,
  `'+=3600'` phone). Keep it near **15–20 px of scroll per frame** or the scrub
  changes feel — it is a function of `frameCount`, not a free parameter. Phones
  get less because a thumb covers ground far faster than a wheel, and a 4900px
  pin on a phone reads as the page having stopped.
- `ACTS` — the act table: `[frame ratio, scroll progress]` at the end of each
  act. The frame scrub *and* the camera push are both generated from it, one leg
  per act, precisely so they cannot drift apart — a push that changes gear at a
  different scroll position from the footage visibly slides against it.
- `zoom` — the camera push, per device, as the scale at each of the six act
  boundaries (`[0.34, 0.62, 1.06, 1.10, 1.16, 1.22]` desktop; the phone's is
  multiplied by `baseScale: 1.35` before it hits the canvas). Read §1 before
  touching it — the sub-1.0 opening and the crossing to ≥1.0 are both load-bearing
  and for opposite reasons.
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

Two sources, one dissolve. The join is the whole design, so it gets its own
notes below.

| Segment | Source | In–out | What it gives |
|---|---|---|---|
| 1 | the previous master (`old-master.mp4`, 1600×900 / 30fps) | **0.00–4.80** | the machine on black, turning, then ✦ the panels opening |
| 2 | `apexscroll.mp4` (1280×720 / 24fps) | **3.00–10.80** | the hall, the run, the charge, the fade to black |

```bash
ffmpeg -y -i old-master.mp4 -i apexscroll.mp4 -filter_complex "\
[0:v]trim=0:4.80,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos[v0];\
[1:v]trim=3.0:10.80,setpts=PTS-STARTPTS,fps=24[v1];\
[v0][v1]xfade=transition=fade:duration=0.9:offset=3.9[x]" \
-map "[x]" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
public/apex-hero-cinema.mp4
```

`xfade`'s `offset` is measured on the *incoming* chain: `4.80 − 0.90 = 3.90`.

**Output at 24fps, not 30.** Segment 1 is a 30fps source and segment 2 a 24fps
one. Going to 24 *drops* frames from segment 1, which a scrub does not mind —
there is no playback rate, so fewer distinct frames simply means a slightly
coarser act. Going to 30 would *duplicate* frames in segment 2, and a duplicated
frame under a scrub reads as the film stalling. Always resample down to the
slowest source, never up.

(Segment 1 also comes down 1600×900 → 1280×720. That is not a loss: every
original source in this project is 1280×720, so the old master was itself an
upscale — see §7.)

**Why 3.00s on segment 2.** Its first three seconds hold the athlete a long way
off and barely growing. At ~17 px of scroll per frame that is a large slice of
the pin spent on a shot that hardly changes, and it would arrive right after the
dissolve, killing the momentum the join builds.

**Why 10.80s and not 11.04s.** The source fades to black at ~10.75s and then
holds pure black for another seven frames. Those are identical, so scrolling
through them is scrolling through nothing. 10.80 keeps the fade and one frame of
black to land on.

### ⭐ Why this particular join survives a scrub

A dissolve in a video is seen once, at a fixed speed. A dissolve in a *scrub* can
be stopped on, reversed, and crawled through — so every intermediate frame has to
be an image you would be happy to publish. Four things make this one work, in
order of importance:

1. **Both halves are centre-weighted with dark surrounds.** The open machine sits
   dead centre on black; the hall is a dark box with the athlete and the lit
   T-APEX wall in the middle. The dissolve therefore blends subject onto subject
   and edge onto edge, instead of smearing a bright frame over a dark one.
2. **The camera never stops.** The push runs straight through the join (§1).
   Continuous motion across a dissolve is what makes it read as one move; a
   dissolve between two *static* framings always reads as an edit.
3. **The mid-dissolve frames are the best argument for the cut.** Around 50 % the
   athlete appears to be running out through the machine's own interior, with the
   cable spool and motor ghosting over the track. That is the product story in one
   frame, and a scrub is the only medium that lets anyone dwell on it.
4. **0.9s, not 0.5s.** Held that long with both subjects in frame, the change of
   environment reads as a transformation rather than as a cut. Short dissolves
   under a scrub just look like a dirty edit.

### Checking a source before you cut it
Scene-detect first — a hard cut mid-segment will wreck the scrub:
```bash
ffmpeg -v error -i clip.mp4 -vf "select='gt(scene,0.2)',metadata=print:file=-" \
  -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"
```
On the old master this is also how the segment-1 out-point was found: it reports a
clean break at 2.9s (the panels starting to move) and then a dense run from 4.4s
onward, which is the *previous* cut's own dissolve into its fly-through. 4.80 sits
just inside that, so segment 1 ends on the machine wide open with the camera
already moving in — exactly the energy the new dissolve needs to inherit.

### If you have to join two clips again
The rules this project has paid for, in order:

1. **Grade the environments to match — that is the big one.** A change of
   *location* is what makes an edit read as "different video"; a change of angle
   is not. An earlier cut crushed a lit hall to black with `curves` + a double
   `vignette` and that did more than any other single change. This join needed no
   grade only because segment 1 *is* a black void and segment 2 is genuinely dark.
2. **Zoom and re-centre** so the subject lands at a comparable size and the
   frame-edge giveaways are pushed out.
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
