#!/usr/bin/env python3
"""Splice a new sprint clip into the scroll-cinema's closing act.

    python3 scripts/splice-sprint.py /path/to/sprint.mp4

The hero scrubs a WebP still sequence, not a video (see
docs/motion-scroll-brief.md). This replaces only the closing act — the red grid
tunnel's opening and everything after it — and leaves frames 1–211 untouched, so
the machine, the panels opening and the fly-through are bit-identical.

WHY THIS IS NOT A STRAIGHT FRAME SWAP
The tunnel does not cut to the sprint: its opening is a rectangular aperture that
grows over ~15 frames and the sprint is what you see through it. Replacing only
the frames after the aperture finishes would leave the OLD footage playing inside
it — so frames 212–226 have to be recomposited, new clip through the same hole.

The aperture is a clip-path over full-size footage, not a scaled window (checked:
NCC 0.83 against 0.42 for the scaled-window model). Reproducing that verbatim
still fails, though, because it only ever worked on footage that framed the
athlete far down the track: a 145px slit held all of him. Footage that frames him
closer gets decapitated by the same slit. So the geometry is kept and the CONTENT
is scaled with it — the scene grows from 0.23x to full size as the hole widens,
which reproduces the original's *look* (a small complete shot seen through a small
window, opening to full frame) and is anyway what flying at a portal looks like.

Needs ffmpeg on PATH and Pillow.
"""
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DESK = ROOT / "public/hero-frames"
MOB = ROOT / "public/hero-frames-mobile"

FPS = 14                 # the sequence's frame rate; mobile is every second frame
FIRST = 212              # first sequence frame the splice touches (the aperture)
LAST_COMPOSITE = 226     # last blended frame; FIRST..here are tunnel + new clip
TOTAL = 318              # desktop frame count — keep it, or DESKTOP.frameCount moves
DESK_SIZE, MOB_SIZE = (1600, 900), (640, 360)
DESK_Q, MOB_Q = 82, 80

# Aperture rect per desktop frame, measured off the original frames by bounding
# the non-red (i.e. content) pixels inside the red grid tunnel.
APERTURE = {
    212: (619,  983, 386, 531), 213: (600, 1004, 378, 539),
    214: (590, 1014, 373, 544), 215: (577, 1026, 369, 548),
    216: (549, 1053, 357, 558), 217: (513, 1091, 339, 574),
    218: (458, 1141, 317, 594), 219: (406, 1187, 298, 610),
    220: (343, 1254, 276, 629), 221: (298, 1294, 258, 644),
    222: (183, 1403, 221, 679), 223: (183, 1409, 219, 682),
    224: ( 19, 1570, 144, 744), 225: (  4, 1589,  79, 799),
    226: (  4, 1589,  14, 855),
}
DILATE = 7     # px — guarantees no sliver of the outgoing footage survives at the edge
FEATHER = 1.6  # px — antialiases the mask edge the way the original render does


def extract(src: Path, out: Path, size: tuple[int, int], count: int) -> None:
    """Lossless PNG intermediates, so compositing does not compound WebP loss."""
    out.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(src),
         "-vf", f"fps={FPS},scale={size[0]}:{size[1]}:flags=lanczos",
         "-frames:v", str(count), "-f", "image2", str(out / "n-%03d.png")],
        check=True,
    )


def outgoing_mask(arr: np.ndarray) -> np.ndarray:
    """Pixels that are the OUTGOING footage: bright and not red-dominant. The
    tunnel itself is only red grid lines on black, so this catches whatever the
    rect misses — edge spill, a corner the bounding box clipped."""
    r, g, b = (arr[..., i].astype(np.int32) for i in range(3))
    return (g > 50) & (b > 40) & ((g + b) > r * 0.85)


def composite(frame: int, plate_path: Path, clip_path: Path, out_path: Path, scale: float) -> None:
    tun = Image.open(plate_path).convert("RGB")
    w, h = tun.size
    ax0, ax1, ay0, ay1 = (v * scale for v in APERTURE[frame])
    cx, cy = (ax0 + ax1) / 2, (ay0 + ay1) / 2

    # Content scale tracks the opening. The margin means the scaled frame always
    # overshoots the dilated mask, so no black creeps in at the edge.
    s = min(1.0, (ax1 - ax0 + (2 * DILATE + 6) * scale) / (DESK_SIZE[0] * scale))
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    plate = Image.new("RGB", (w, h), (0, 0, 0))
    plate.paste(Image.open(clip_path).convert("RGB").resize((nw, nh), Image.LANCZOS),
                (round(cx - nw / 2), round(cy - nh / 2)))

    m = np.zeros((h, w), dtype=bool)
    m[max(0, round(ay0 - DILATE * scale)):min(h, round(ay1 + DILATE * scale)),
      max(0, round(ax0 - DILATE * scale)):min(w, round(ax1 + DILATE * scale))] = True
    m |= outgoing_mask(np.asarray(tun))

    mask = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(FEATHER))
    Image.composite(plate, tun, mask).save(out_path)


def main(src: Path) -> None:
    count = TOTAL - FIRST + 1                       # new-clip frames needed
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        extract(src, tmp / "desk", DESK_SIZE, count)
        extract(src, tmp / "mob", MOB_SIZE, count)

        for d in range(FIRST, TOTAL + 1):           # new-clip index k = d - FIRST
            clip = tmp / "desk" / f"n-{d - FIRST + 1:03d}.png"
            if d <= LAST_COMPOSITE:
                composite(d, DESK / f"frame-{d:03d}.webp", clip, tmp / f"d-{d:03d}.png", 1.0)
                clip = tmp / f"d-{d:03d}.png"
            Image.open(clip).convert("RGB").save(
                DESK / f"frame-{d:03d}.webp", "WEBP", quality=DESK_Q, method=6)

        scale = MOB_SIZE[0] / DESK_SIZE[0]
        for m in range((FIRST + 1) // 2 + 1, TOTAL // 2 + 1):   # mobile m == desktop 2m-1
            d = 2 * m - 1
            clip = tmp / "mob" / f"n-{d - FIRST + 1:03d}.png"
            if d <= LAST_COMPOSITE:
                composite(d, MOB / f"frame-{m:03d}.webp", clip, tmp / f"m-{m:03d}.png", scale)
                clip = tmp / f"m-{m:03d}.png"
            Image.open(clip).convert("RGB").save(
                MOB / f"frame-{m:03d}.webp", "WEBP", quality=MOB_Q, method=6)

    print(f"spliced frames {FIRST}–{TOTAL} (desktop) and "
          f"{(FIRST + 1) // 2 + 1}–{TOTAL // 2} (mobile)")
    print("now re-measure the luma under each copy beat and re-time `.cine-dim` "
          "in ScrollCinemaHero.tsx — see docs/motion-scroll-brief.md §1")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
