"""Generate the Out of the Woods logo → public/assets/chrome/logo.webp.

Guided by the reference wordmark in refs/logo/logo.png: chunky carved-wood 3D
letters with an icy-blue crackled top edge and blue flames behind, matted to a
clean alpha channel. A cool-gold FREE SPINS variant (logo_fs) is available too.

Usage:
    python logo.py            # base logo
    python logo.py fs         # free-spins gold variant
    python logo.py all        # both
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import ASSETS_DIR, REFS_DIR, alpha_report, get_client, matted_retry  # noqa: E402

CHROME_DIR = ASSETS_DIR / "chrome"
REF = REFS_DIR / "logo" / "logo.png"
ASPECT = "21:9"  # ref is ~2.49:1 → nearest wide enum

BASE_PROMPT = (
    "A cartoon slot-game LOGO wordmark that reads exactly 'OUT OF THE WOODS', "
    "matching the reference image's exact style and layout. 'OUT OF THE' in small "
    "cream/white comic caps arced across the TOP; 'WOODS' huge below in chunky "
    "carved-wood 3D block letters — warm orange-gold woodgrain face (#E8801C) with a "
    "cold ICY-BLUE crackled frost top edge and a blue keyline, thick dark-brown ink "
    "outline, extruded 3D wooden body with visible plank grain and metal rivets. "
    "COOL-BLUE flames lick upward behind the letters; a warm amber glow sits behind "
    "the whole wordmark. Bold, rowdy, dark-comic woodland-survival vibe. "
    "Spell the words correctly: O-U-T O-F T-H-E W-O-O-D-S. "
    "The wordmark is centred and complete, filling ~92% of the frame width, "
    "orthographic dead-on view, nothing else in the scene — no board, no UI, no "
    "extra text, no drop shadow onto the background."
)

FS_PROMPT = (
    BASE_PROMPT
    + " FREE SPINS variant: render the WOODS letters in bright polished GOLD "
    "(gradient #F6C63A → #C8891C) instead of wood-orange, keep the icy-blue frost top "
    "edge and the cool-blue flames behind."
)

VARIANTS = {
    "logo": BASE_PROMPT,
    "logo_fs": FS_PROMPT,
}


def trim_wide(img: Image.Image, target_w: int = 1024, pad: int = 8) -> Image.Image:
    """Crop to the alpha bounding box (keeping the logo's wide aspect) and scale
    to `target_w` — unlike the square tile finisher, this preserves a banner shape."""
    a = np.array(img.convert("RGBA"))[:, :, 3]
    ys, xs = np.where(a > 8)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    crop = img.crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad + 1, y1 + pad + 1))
    if crop.width != target_w:
        h = round(crop.height * target_w / crop.width)
        crop = crop.resize((target_w, h), Image.LANCZOS)
    return crop


def gen(name: str) -> None:
    print(f"[{name}]  ref={REF.name}")
    ref = (REF.read_bytes(), "image/png")
    rgba = matted_retry(get_client(), VARIANTS[name], refs=[ref],
                        aspect=ASPECT, image_size="1K", tries=4, label=name)
    alpha_report(rgba, name)
    out = trim_wide(rgba, target_w=1024)
    CHROME_DIR.mkdir(parents=True, exist_ok=True)
    p = CHROME_DIR / f"{name}.webp"
    out.save(p, format="WEBP", quality=94, method=6)
    print(f"  wrote {p.relative_to(ASSETS_DIR.parent.parent)}  ({out.size[0]}x{out.size[1]} RGBA)")


def main() -> None:
    arg = sys.argv[1] if len(sys.argv) > 1 else "logo"
    which = ["logo", "logo_fs"] if arg == "all" else [f"logo_fs" if arg == "fs" else "logo"]
    for name in which:
        gen(name)
    print("done.")


if __name__ == "__main__":
    main()
