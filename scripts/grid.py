"""Generate the reel grid frame → public/assets/chrome/grid_frame.webp.

Guided by refs/grid/grid_background.png: heavy red-brown timber posts lashed with
rope at the corners, a spread red-feathered wing crest at each top corner, and a
dark plum board void with five vertical column dividers. Matted so the area
OUTSIDE the frame is transparent while the dark board panel inside stays opaque
(the difference matte keys only the true background, not the dark board).

Usage:
    python grid.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import ASSETS_DIR, REFS_DIR, alpha_report, get_client, matted_retry  # noqa: E402

CHROME_DIR = ASSETS_DIR / "chrome"
REF = REFS_DIR / "grid" / "grid_background.png"
ASPECT = "1:1"  # ref is ~1.14:1 → nearest square enum

PROMPT = (
    "A cartoon slot-game REEL FRAME panel, matching the reference image's exact "
    "style and layout. A heavy dark RED-BROWN carved TIMBER frame — four thick log "
    "posts with visible woodgrain and knots — lashed together with pale ROPE wraps "
    "at all four corners. At the TOP-LEFT and TOP-RIGHT corners, a spread RED-"
    "FEATHERED wooden WING crest fans outward. Inside the frame is a flat, near-"
    "uniform DARK PLUM board void (#3a2a4a) split into FIVE tall vertical columns by "
    "thin warm-red divider lines. Thick dark-brown ink outlines, warm rim light on "
    "the timber, rowdy dark-comic woodland-survival vibe. "
    "The frame is centred and complete, filling ~95% of the frame, orthographic "
    "dead-on view. Nothing else: no symbols, no letters, no UI, no logo, no text, "
    "no scene behind it — only the wooden frame and its dark board panel."
)


def trim(img: Image.Image, target_w: int = 1280, pad: int = 6) -> Image.Image:
    """Crop to the alpha bounding box (keeping aspect) and scale to `target_w`."""
    a = np.array(img.convert("RGBA"))[:, :, 3]
    ys, xs = np.where(a > 8)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    crop = img.crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad + 1, y1 + pad + 1))
    if crop.width != target_w:
        h = round(crop.height * target_w / crop.width)
        crop = crop.resize((target_w, h), Image.LANCZOS)
    return crop


def main() -> None:
    print(f"[grid_frame]  ref={REF.name}")
    ref = (REF.read_bytes(), "image/png")
    rgba = matted_retry(get_client(), PROMPT, refs=[ref],
                        aspect=ASPECT, image_size="1K", tries=4, label="grid_frame")
    alpha_report(rgba, "grid_frame")
    out = trim(rgba, target_w=1280)
    CHROME_DIR.mkdir(parents=True, exist_ok=True)
    p = CHROME_DIR / "grid_frame.webp"
    out.save(p, format="WEBP", quality=94, method=6)
    print(f"  wrote {p.relative_to(ASSETS_DIR.parent.parent)}  ({out.size[0]}x{out.size[1]} RGBA)")
    print("done.")


if __name__ == "__main__":
    main()
