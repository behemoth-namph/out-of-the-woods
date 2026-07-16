"""Shared harness for generating the *Out of the Woods* asset pack.

Mirrors the proven pattern in the pipeline's ``scripts/gatesofolympus/_common.py``:
hit the Gemini image model directly (``genai.Client``), extract a real alpha
channel with the pipeline's ``difference_matting`` processor (white render minus
black render), and validate the matte before writing.

Unlike the Olympus scripts, every tile here is guided by a REFERENCE CROP taken
from the actual game art in ``refs/`` — the model reproduces that exact
hand-painted comic-woodland symbol, isolated, so the generated pack matches the
source game rather than re-inventing it.

Run every script with the pipeline venv, from anywhere::

    cd <game>/scripts
    /Users/namph/Documents/projects/ebisu/slot-dynamic-grid/pipeline/executor/.venv/bin/python tiles.py

Override the pipeline location with ``PIPELINE_EXECUTOR=/path/to/executor``.

Network is REQUIRED — these are image-generation tools, not tests. Nothing is
written on provider failure (no placeholder garbage); the script raises instead.
"""
from __future__ import annotations

import io
import os
import sys
from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image

# ── locate the game repo + the pipeline executor (importable pipeline package) ──
GAME_ROOT = Path(__file__).resolve().parents[1]
REFS_DIR = GAME_ROOT / "refs"
ASSETS_DIR = GAME_ROOT / "public" / "assets"

EXECUTOR_ROOT = Path(
    os.environ.get(
        "PIPELINE_EXECUTOR",
        "/Users/namph/Documents/projects/ebisu/slot-dynamic-grid/pipeline/executor",
    )
).resolve()
if not (EXECUTOR_ROOT / "pipeline").is_dir():
    raise SystemExit(
        f"pipeline package not found under {EXECUTOR_ROOT}. "
        "Set PIPELINE_EXECUTOR to the executor dir."
    )
sys.path.insert(0, str(EXECUTOR_ROOT))

from pipeline.processors.image_processors import (  # noqa: E402
    difference_matting,
    strip_transparent_padding,
)
from pipeline.providers.gemini_provider import _nearest_valid_aspect  # noqa: E402

# Default image-gen model (pipeline default). Override with OOW_IMG_MODEL.
MODEL = os.environ.get("OOW_IMG_MODEL", "gemini-3-pro-image-preview")

# ── Art DNA prompt spine (docs/art-design.md — Out of the Woods) ──────────────
# Leads with the isolation constraint so the model returns ONE symbol on a flat
# field (not a re-drawn reel grid). The reference crop supplies the exact art.
STYLE = (
    "Dark-comic woodland-survival slot art: hand-painted 2D cartoon illustration, "
    "thick dark-brown ink outlines, cel-shaded painterly volume, warm firelight vs "
    "cold moonlight, rowdy bug-eyed caricature energy. Match the reference image's "
    "exact style, colors, linework and character design."
)

ISOLATE = (
    "Reproduce EXACTLY ONE symbol from the reference, isolated and centred, filling "
    "~90% of the frame, orthographic dead-on view. NOTHING else: no reel grid, no "
    "neighbouring symbols, no board, no UI, no text captions, no drop shadow."
)

WHITE_SUFFIX = (
    "Place the isolated symbol on a pure FLAT WHITE (#FFFFFF) background. No shadow "
    "cast onto the background, no vignette, no gradient — only the symbol over flat white."
)
BLACK_SUFFIX = (
    "Render the EXACT same symbol — identical shapes, colours, position, scale and "
    "framing — but on a pure FLAT BLACK (#000000) background. No shadow, no vignette, "
    "no gradient — only the symbol over flat black."
)


def load_env() -> str:
    """Load GOOGLE_API_KEY from the executor's .env (no extra deps). Returns the key."""
    env_path = EXECUTOR_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise SystemExit("GOOGLE_API_KEY not set (executor/.env)")
    return api_key


def get_client():
    from google import genai

    return genai.Client(api_key=load_env())


# ── reference-crop loading ────────────────────────────────────────────────────
def ref_crop(sheet: str, col: int, row: int, cols: int = 5, rows: int = 4,
             pad: float = 0.02) -> tuple[bytes, str]:
    """Crop cell (col,row) from a refs/tiles/<sheet> grid → (png_bytes, mime).

    Coordinates are fractional so they survive the sheets' differing pixel sizes.
    `pad` grows the box slightly to keep a symbol's frame/trap fully inside.
    """
    img = Image.open(REFS_DIR / "tiles" / sheet).convert("RGB")
    w, h = img.size
    x0 = max(0.0, (col - pad) / cols) * w
    y0 = max(0.0, (row - pad) / rows) * h
    x1 = min(1.0, (col + 1 + pad) / cols) * w
    y1 = min(1.0, (row + 1 + pad) / rows) * h
    crop = img.crop((int(x0), int(y0), int(x1), int(y1)))
    buf = io.BytesIO()
    crop.save(buf, format="PNG")
    return buf.getvalue(), "image/png"


def ref_full(rel: str) -> tuple[bytes, str]:
    """Load a full reference image from refs/<rel> → (bytes, mime)."""
    p = REFS_DIR / rel
    data = p.read_bytes()
    mime = "image/jpeg" if p.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    return data, mime


# ── Gemini image calls ────────────────────────────────────────────────────────
def gen_once(client, prompt: str, refs: Iterable[tuple[bytes, str]] = (),
             aspect: str = "1:1", image_size: str = "1K",
             temperature: float = 0.3, mode: str = "RGB") -> Image.Image:
    """Single Gemini image call; returns a PIL image. Raises on no image."""
    from google.genai import types

    contents = [types.Part.from_text(text=prompt)]
    for data, mime in refs:
        contents.append(types.Part.from_bytes(data=data, mime_type=mime))

    resp = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config={
            "response_modalities": ["IMAGE", "TEXT"],
            "temperature": temperature,
            "image_config": {
                "image_size": image_size,
                "aspect_ratio": _nearest_valid_aspect(aspect),
            },
        },
    )
    for candidate in resp.candidates or []:
        content = getattr(candidate, "content", None)
        if not content or not getattr(content, "parts", None):
            continue
        for part in content.parts:
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                return Image.open(io.BytesIO(bytes(inline.data))).convert(mode)
    raise RuntimeError("Gemini returned no image data")


def matted(client, base_prompt: str, refs: Iterable[tuple[bytes, str]] = (),
           aspect: str = "1:1", image_size: str = "1K",
           temperature: float = 0.3) -> Image.Image:
    """Generate the subject on white then black and difference-matte to RGBA."""
    refs = list(refs)
    white = gen_once(client, f"{base_prompt}\n\n{WHITE_SUFFIX}", refs, aspect, image_size, temperature)
    black = gen_once(client, f"{base_prompt}\n\n{BLACK_SUFFIX}", refs, aspect, image_size, temperature)
    if white.size != black.size:
        black = black.resize(white.size, Image.LANCZOS)
    return difference_matting(white, {"black_bg": black})


def is_matted(img: Image.Image) -> bool:
    """True if the difference-matte actually keyed the background.

    Requires a fully-opaque subject (max 255), some transparency (min 0), AND all
    four corners transparent — the last catches the common failure where the
    black-bg render came back light, so the diff key leaves an opaque white box
    with only a few stray transparent edge pixels."""
    a = np.array(img.convert("RGBA"))[:, :, 3]
    corners = [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]
    return bool(a.min() == 0 and a.max() == 255 and max(corners) < 16)


def matted_retry(client, base_prompt: str, refs: Iterable[tuple[bytes, str]] = (),
                 aspect: str = "1:1", image_size: str = "1K",
                 tries: int = 3, label: str = "tile") -> Image.Image:
    """matted() with a retry loop — a clean white/black render pair is not
    guaranteed on the first shot (occasional gray-veil wash breaks the diff key).
    Bumps temperature each retry for fresh variation. Raises after `tries`."""
    refs = list(refs)
    last = None
    for attempt in range(1, tries + 1):
        rgba = matted(client, base_prompt, refs, aspect, image_size,
                      temperature=0.3 + 0.1 * (attempt - 1))
        if is_matted(rgba):
            if attempt > 1:
                print(f"    {label}: matte ok on attempt {attempt}")
            return rgba
        last = rgba
        print(f"    {label}: matte failed (attempt {attempt}/{tries}) — retrying")
    raise RuntimeError(f"{label}: matting failed after {tries} attempts") from None


def finish(img: Image.Image, size: int = 320, preserve_aspect: bool = True) -> Image.Image:
    """Trim transparent padding and fit into a square `size` canvas."""
    return strip_transparent_padding(
        img, {"target_size": size, "preserve_aspect": preserve_aspect, "alpha_threshold": 8}
    )


def save_webp(img: Image.Image, path: Path, quality: int = 92) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, format="WEBP", quality=quality, method=6)
    rel = path.relative_to(GAME_ROOT)
    print(f"  wrote {rel}  ({img.size[0]}x{img.size[1]} {img.mode})")


def alpha_report(img: Image.Image, label: str, require_matte: bool = True) -> None:
    arr = np.array(img.convert("RGBA"))
    a = arr[:, :, 3]
    transparent = int((a == 0).sum())
    total = a.size
    print(
        f"  {label}: size={img.size} transparent_px={transparent} "
        f"({100 * transparent / total:.1f}%) min_alpha={a.min()} max_alpha={a.max()}"
    )
    if require_matte:
        if a.min() != 0:
            raise RuntimeError(f"{label}: no fully-transparent pixels — matting failed")
        if a.max() != 255:
            raise RuntimeError(f"{label}: no fully-opaque pixels — subject missing")
