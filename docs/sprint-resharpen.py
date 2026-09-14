#!/usr/bin/env python3
"""
Re-derive the sprint act from a higher-quality source, without re-rendering the
tunnel fly-through.

    python3 docs/sprint-resharpen.py <sprint-source.mp4>

The cut joins the tunnel to the sprint by FLYING THROUGH the tunnel's far
opening — a real hole rendered frame by frame by portal-transition.py, not a
dissolve. Those frames are a composite:

    existing = sprint * m  +  tunnel * (1 - m)

so they cannot simply be overwritten with new sprint frames: that would throw
away the tunnel layer and the flight through it.

WHAT THIS DOES INSTEAD
Inside the hole the composite is *pure sprint* (m == 1 exactly), so those pixels
can be swapped for the new source with no loss of anything else. The replacement
mask is therefore the portal mask SHRUNK by 1/(1+EDGE), which makes it reach zero
exactly where the portal mask stops being 1. Nothing in the soft shoulder or the
tunnel is touched — not blended, not approximated, not re-derived.

That matters, and the obvious alternative is wrong. Compositing
`new*m + existing*(1-m)` with the portal mask looks equivalent but double-counts:
`existing` already carries `sprint*m`, so the shoulder ends up at
`s*m*(2-m) + t*(1-m)^2` instead of `s*m + t*(1-m)` — 0.75/0.25 instead of
0.50/0.50 at m = 0.5. The hole edge silently softens and widens. There is no way
to recover the tunnel layer in the shoulder without the ORIGINAL sprint frames
(the equation has two unknowns), and those are not in the repo — hence: replace
only where the mask is already saturated.

Past the transition every pixel is sprint, so the frames are replaced outright.

Geometry is not re-guessed: the portal constants below are portal-transition.py's,
and the transition's start frame and length were recovered by fitting its own
growth curve to the shipped frames (measured hole half-widths over f241–f265,
best fit f233 + 38 frames, RMS error 0.037 in z).
"""
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# ── portal-transition.py's constants, at desktop scale ───────────────────────
K, EASE, EDGE = 6.0, 1.6, 0.22
SPRINT_SETTLE = 0.12
CX0, CY0 = 960.0, 592.0
HW0, HH0 = 215.0, 113.0
BASE_W, BASE_H = 1920.0, 1080.0

# Replacement mask shrink: makes it reach 0 exactly where the portal mask stops
# being 1, so only saturated (pure-sprint) pixels are ever touched.
SHRINK = 1.0 / (1.0 + EDGE)

TRANS_START, TRANS_N = 233, 38      # desktop frames f233..f270
SPRINT_ENTRY = 234                  # desktop frame the source's first frame lands on
FPS = 16

DESK = dict(dir=ROOT / "public/hero-frames", size=(1920, 1080), count=357, q=86)
MOB = dict(dir=ROOT / "public/hero-frames-mobile", size=(960, 540), count=268, q=84)


def extract(src: Path, out: Path, size, n: int) -> None:
    out.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(src),
         "-vf", f"fps={FPS},scale={size[0]}:{size[1]}:flags=lanczos",
         "-frames:v", str(n), "-f", "image2", str(out / "s-%03d.png")],
        check=True,
    )


def scale_about(img: Image.Image, z: float, cx: float, cy: float) -> Image.Image:
    """portal-transition.py's scale_about, verbatim — scale about a fixed point."""
    w, h = img.size
    if abs(z - 1.0) < 1e-4:
        return img
    big = img.resize((max(1, round(w * z)), max(1, round(h * z))), Image.LANCZOS)
    return big.crop((round(cx * z - cx), round(cy * z - cy),
                     round(cx * z - cx) + w, round(cy * z - cy) + h))


def portal_mask(w: int, h: int, hw: float, hh: float) -> np.ndarray:
    """The superellipse with the soft shoulder, at this frame size."""
    s = w / BASE_W
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx, dy = xx - CX0 * s, yy - CY0 * s
    r = ((np.abs(dx) / hw) ** 4 + (np.abs(dy) / hh) ** 4) ** 0.25
    return np.clip((1.0 + EDGE - r) / EDGE, 0.0, 1.0)


def rebuild(cfg: dict, frames: Path, desk_of) -> int:
    w, h = cfg["size"]
    s = w / BASE_W
    touched = 0
    for i in range(1, cfg["count"] + 1):
        d = desk_of(i)                        # the desktop frame this one shows
        if d < SPRINT_ENTRY:
            continue
        src = frames / f"s-{d - SPRINT_ENTRY + 1:03d}.png"
        if not src.exists():
            continue
        new = Image.open(src).convert("RGB")
        dst = cfg["dir"] / f"frame-{i:03d}.webp"

        if d <= TRANS_START + TRANS_N - 1:
            # Inside the fly-through: the sprint layer is pushed in slightly and
            # settles to 1.0 exactly as the tunnel clears (SPRINT_SETTLE), and
            # only the saturated core of the portal is ours to replace.
            t = (d - TRANS_START) / (TRANS_N - 1)
            z = K ** (t ** EASE)
            new = scale_about(new, 1.0 + SPRINT_SETTLE * (1.0 - t), w / 2, h / 2)
            m = portal_mask(w, h, HW0 * s * z * SHRINK, HH0 * s * z * SHRINK)[..., None]
            old = np.asarray(Image.open(dst).convert("RGB"), np.float32)
            out = np.asarray(new, np.float32) * m + old * (1.0 - m)
            new = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

        new.save(dst, "WEBP", quality=cfg["q"], method=6)
        touched += 1
    return touched


def main(src: Path) -> None:
    need = DESK["count"] - SPRINT_ENTRY + 1
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        extract(src, tmp / "d", DESK["size"], need)
        extract(src, tmp / "m", MOB["size"], need)
        nd = rebuild(DESK, tmp / "d", lambda i: i)
        # Mobile is a 3/4 subsample of the same cut: frame m shows desktop frame
        # round(m * 357/268). Verified against the shipped frames at NCC > 0.99.
        nm = rebuild(MOB, tmp / "m",
                     lambda i: round(i * DESK["count"] / MOB["count"]))
    print(f"re-sharpened {nd} desktop and {nm} mobile frames")
    print("now re-measure the luma under each copy beat (docs/motion-scroll-brief.md §1)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
