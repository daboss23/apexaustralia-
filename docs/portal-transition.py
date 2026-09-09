#!/usr/bin/env python3
"""
Render the tunnel -> sprint transition frame by frame.

The tunnel clip ends flying down a red grid corridor whose far end is a soft
dark opening centred at (960, 592). This continues that flight THROUGH the
opening and out the other side into the sprint footage:

  back   the sprint frame, cover-fit, settling from a slight over-scale to 1.0
  mask   a soft-edged superellipse at the opening, growing with the flight so
         it is a hole you are travelling toward
  front  the tunnel frame, scaled about the SAME point (so the geometry tracks)
         and knocked out by the mask

Growth is exponential and eased-in (K**(t**EASE)), not linear-in-time. Two
reasons. Constant-velocity approach is exponential in apparent size, so a plain
K**t is the physically honest curve — but only about a dozen real tunnel frames
exist before the layer has to hold its last one, and a plain curve spends them in
the first fifth of the transition. Easing the growth in keeps the real footage
carrying the opening, and holds the athlete framed inside the tunnel mouth long
enough to be a composition rather than a flash. The mask is sized so it covers
the whole frame by t=1 — at which
point the tunnel layer is fully masked away and the sprint owns the screen. No
crossfade anywhere: the tunnel leaves because you have flown past it.

Doing this in Python rather than an ffmpeg filter graph is deliberate. Two
time-varying scales about an off-centre point plus a soft procedural mask is a
lot of expression syntax to get subtly wrong, and every frame here can be
eyeballed before it is committed to.
"""
import sys, math, pathlib
import numpy as np
from PIL import Image

W, H = 1920, 1080
CX, CY = 960, 592          # the tunnel's far opening (measured, not guessed)
HW0, HH0 = 215.0, 113.0    # half-extent of that opening on the last tunnel frame
K = 6.0                    # total growth; needs >=5.3 for the mask to clear the corners
EASE = 1.6                 # >1 delays the growth; see the note above
EDGE = 0.22                # mask edge softness, as a fraction of its half-width
# The far scene is seen through a hole, so it starts slightly enlarged (you see
# a centre crop of it) and SETTLES to its true framing exactly as the tunnel
# clears. It must land on 1.0 on the final frame: the clip continues from there
# at 1.0, and ending anywhere else pops. Measured as a 20/255 jump at the seam
# when this ran the other way (0 -> +0.10).
SPRINT_SETTLE = 0.12       # scale the far scene starts at, above 1.0

TUN = pathlib.Path(sys.argv[1])      # dir of real tunnel frames (tail of the clip)
SPR = pathlib.Path(sys.argv[2])      # dir of sprint frames, from the entry point
OUT = pathlib.Path(sys.argv[3])
N   = int(sys.argv[4])               # transition length in frames
OUT.mkdir(parents=True, exist_ok=True)

tun_files = sorted(TUN.glob("*.png"))
spr_files = sorted(SPR.glob("*.png"))
assert tun_files and spr_files, "missing input frames"

# ── the mask: superellipse, soft edge, centred on the opening ────────────────
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
dx = xx - CX
dy = yy - CY

def mask_at(hw, hh):
    """1 inside the opening, 0 outside, with a soft shoulder."""
    r = ((np.abs(dx) / hw) ** 4 + (np.abs(dy) / hh) ** 4) ** 0.25
    return np.clip((1.0 + EDGE - r) / EDGE, 0.0, 1.0)

def scale_about(img, z, cx, cy):
    """Scale `img` by z about (cx, cy), keeping the frame size."""
    if abs(z - 1.0) < 1e-4:
        return img
    big = img.resize((max(1, int(round(W * z))), max(1, int(round(H * z)))), Image.LANCZOS)
    # the point (cx,cy) must stay put after scaling
    left = int(round(cx * z - cx))
    top = int(round(cy * z - cy))
    return big.crop((left, top, left + W, top + H))

def cover(img):
    if img.size == (W, H):
        return img
    return img.resize((W, H), Image.LANCZOS)

for i in range(N):
    t = i / (N - 1)
    z = K ** (t ** EASE)             # eased exponential approach

    # tunnel: real frames while they last, then hold the final one
    tun = Image.open(tun_files[min(i, len(tun_files) - 1)]).convert("RGB")
    tun = scale_about(cover(tun), z, CX, CY)

    # the scene beyond, pushing in gently as we arrive
    spr = cover(Image.open(spr_files[min(i, len(spr_files) - 1)]).convert("RGB"))
    spr = scale_about(spr, 1.0 + SPRINT_SETTLE * (1.0 - t), W / 2, H / 2)

    m = mask_at(HW0 * z, HH0 * z)[..., None]
    out = np.asarray(spr, np.float32) * m + np.asarray(tun, np.float32) * (1.0 - m)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT / f"t-{i:03d}.png")

print(f"rendered {N} frames  z: 1.00 -> {K:.2f}  mask: {HW0*K:.0f}x{HH0*K:.0f} half-extent")
