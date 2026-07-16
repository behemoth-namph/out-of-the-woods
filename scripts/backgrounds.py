"""Build the Out of the Woods background pack → public/assets/backgrounds/.

Most backgrounds already exist as finished art in refs/backgrounds/ — those are
re-encoded to web-ready WebP (optionally downscaled). The one missing piece, a
moonlit-night FREE SPINS variant of the base forest, is generated with Gemini
using the base forest as a style/composition reference.

  bg_base            ← refs background_pc      (landscape forest, base game)
  bg_base_sp         ← refs background_sp      (portrait / mobile)
  bg_freespins       GENERATED                 (landscape moonlit night)
  win_big / mega / super / sensational  ← refs *_win_bg   (win-tier backdrops)

Usage:
    python backgrounds.py            # everything
    python backgrounds.py convert    # only the ref → webp conversions (no network)
    python backgrounds.py freespins  # only the generated night background
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from PIL import Image  # noqa: E402

from _common import REFS_DIR, ASSETS_DIR, gen_once, get_client  # noqa: E402

BG_DIR = ASSETS_DIR / "backgrounds"

# ref filename → (out name, max width) for straight re-encodes.
CONVERSIONS = {
    "background_pc.jpeg": ("bg_base", 2000),
    "background_sp.jpeg": ("bg_base_sp", 1200),
    "big_win_bg.jpeg": ("win_big", 1100),
    "mega_win_bg.jpeg": ("win_mega", 1100),
    "super_win_bg.jpeg": ("win_super", 1100),
    "sensational_win_bg.jpeg": ("win_sensational", 1100),
}

FS_PROMPT = (
    "Repaint this exact forest scene as a MOONLIT NIGHT during a free-spins bonus, "
    "same hand-painted 2D cartoon style, same composition and camera. Shift the "
    "palette from warm magenta-day to a COOL MOONLIT BLUE-PURPLE: deep blue night "
    "sky with a large pale full MOON and a few bats, silver-blue rim light on the "
    "pine trunks, cool blue shadows on the forest floor, with a few planted TORCHES "
    "burning warm orange at the edges for contrast. Keep the centre of the frame "
    "calm and relatively empty (a game grid overlays there). Richer and cooler, not "
    "muddier. No text, no UI, no game grid, no characters in the centre."
)


def convert_one(ref_name: str) -> None:
    out_name, max_w = CONVERSIONS[ref_name]
    src = REFS_DIR / "backgrounds" / ref_name
    im = Image.open(src).convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    out = BG_DIR / f"{out_name}.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, format="WEBP", quality=88, method=6)
    print(f"  {ref_name} → backgrounds/{out_name}.webp  ({im.size[0]}x{im.size[1]})")


def convert_all() -> None:
    print(f"Re-encoding {len(CONVERSIONS)} reference background(s) → {BG_DIR}")
    for ref_name in CONVERSIONS:
        convert_one(ref_name)


def gen_freespins() -> None:
    print("[bg_freespins]  generating moonlit night (ref=background_pc)")
    ref_bytes = (REFS_DIR / "backgrounds" / "background_pc.jpeg").read_bytes()
    img = gen_once(
        get_client(), FS_PROMPT, refs=[(ref_bytes, "image/jpeg")],
        aspect="21:9", image_size="2K", temperature=0.45, mode="RGB",
    )
    out = BG_DIR / "bg_freespins.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, format="WEBP", quality=88, method=6)
    print(f"  wrote backgrounds/bg_freespins.webp  ({img.size[0]}x{img.size[1]})")


def main() -> None:
    arg = sys.argv[1] if len(sys.argv) > 1 else "all"
    if arg in ("all", "convert"):
        convert_all()
    if arg in ("all", "freespins"):
        gen_freespins()
    print("done.")


if __name__ == "__main__":
    main()
