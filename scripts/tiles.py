"""Generate the 11 Out of the Woods symbol tiles → public/assets/tiles/.

One RGBA WebP per symbol, difference-matted for a real alpha channel, each guided
by a reference of the actual game art in refs/tiles/. Every tile (framed
characters, floating wooden letters, the rope-framed scatter, the carved-wood OWL
wild) is matted so it drops cleanly onto the dark board void.

The WILD is the owl totem, generated from a FULL reference image
(refs/tiles/wild_owl.png) rather than a grid crop. The old cyan scope-lens
medallion now lives under the `multiplier` id (opt-in; the wild-multiplier tile).

Usage:
    python tiles.py                 # all tiles
    python tiles.py bear deer       # a subset (validation)
    python tiles.py --list          # show ids
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import (  # noqa: E402
    ASSETS_DIR, ISOLATE, STYLE, alpha_report, finish, get_client,
    matted_retry, ref_crop, ref_full, save_webp,
)

TILES_DIR = ASSETS_DIR / "tiles"

# id → (sheet, col, row, subject clause). Cells identified from the ref grids.
CHARACTERS = {
    "bunny": ("grid_tiles_2.png", 3, 0,
              "a terrified man wearing a white RABBIT-EAR hood with a green hoodie, "
              "bug-eyes, inside a GREEN rope-lashed wooden picture frame"),
    "bluegirl": ("grid_tiles_1.png", 0, 0,
                 "a blonde girl in a blue BIRD-BEAK sun-hat and a sparkly blue top, "
                 "wide startled eyes, inside a BLUE rope-lashed wooden picture frame"),
    "bear": ("grid_tiles_1.png", 1, 0,
             "a red-bearded man wearing a brown BEAR-fur hat with teeth and a red plaid "
             "shirt, panicked eyes, inside a RED rope-lashed wooden picture frame"),
    "deer": ("grid_tiles_1.png", 1, 1,
             "a girl in a pink DEER-antler fur hood and pink puffy jacket, worried eyes, "
             "inside a PINK/MAGENTA rope-lashed wooden picture frame"),
}

# Wooden card letters, each caught in a woodland trap (no frame — floating icon).
LETTERS = {
    "a": ("grid_tiles_1.png", 4, 0,
          "a chunky carved wooden letter 'A' painted PURPLE, clamped in a grey metal "
          "spring SNARE / bear-trap at its base"),
    "k": ("grid_tiles_1.png", 4, 2,
          "a chunky carved wooden letter 'K' painted ORANGE, tangled in a coiled "
          "brown LASSO rope"),
    "q": ("grid_tiles_1.png", 0, 1,
          "a chunky carved wooden letter 'Q' painted GOLD-YELLOW, mounted on a wooden "
          "spring MOUSETRAP plank"),
    "j": ("grid_tiles_1.png", 2, 0,
          "a chunky carved wooden letter 'J' painted BLUE, dangling on a string from a "
          "little wooden BIRDHOUSE trap above it"),
    "ten": ("grid_tiles_1.png", 3, 2,
            "chunky carved wooden red numerals '10' lashed onto a rope-rung wooden "
            "LADDER trap"),
}

SCATTER = ("scatter", "grid_tiles_2.png", 2, 0,
           "a glowing golden SETTING SUN over a black pine-forest silhouette, framed "
           "like a lit window inside a golden ROPE-LASHED twig frame")

# ── WILD (the owl totem) ──────────────────────────────────────────────────────
# The plain WILD symbol: a carved-wood OWL over firelit planks in a golden frame,
# with the wooden word "WILD" beneath it — reproduced from a full reference image
# (refs/tiles/wild_owl.png), NOT a grid crop. This is a complete framed symbol
# (the "WILD" lettering is part of the art), so it uses its own isolate clause
# that permits the word + frame instead of the generic no-text ISOLATE.
WILD_REF = "tiles/wild_owl.png"
WILD_SUBJECT = (
    "a wise carved-WOOD OWL totem: a plump frontal owl hewn from warm honey-brown "
    "wood with thick dark-brown ink outlines and cel-shaded volume — two huge round "
    "eyes with concentric tree-ring irises and heavy dark brows, a small hooked beak, "
    "and layered wooden shingle-feathers across its chest and folded wings. It sits "
    "against a background of vertical weathered wood PLANKS lit from below by a glowing "
    "orange EMBER firelight, all inside an ornate GOLDEN wooden picture frame with "
    "riveted corner brackets. Beneath the owl, chunky 3D carved wooden block letters "
    "spell the word 'WILD' in golden wood, edge-lit by fiery embers"
)
ISOLATE_WILD = (
    "Reproduce EXACTLY ONE framed WILD symbol from the reference, centred, filling "
    "~92% of the frame, dead-on orthographic view. KEEP the carved wooden 'WILD' "
    "lettering — it is part of the symbol. NOTHING outside the golden frame: no reel "
    "grid, no neighbouring symbols, no board, no UI, no extra captions, no drop shadow."
)

# ── WILD MULTIPLIER (the old cyan medallion) ──────────────────────────────────
# Formerly generated as `wild`. The cyan glass scope-lens in a riveted metal ring,
# EMPTY centre so the game can overlay the live Nx numeral. Kept here so it can be
# regenerated as its own tile (tile_wild_multiplier.webp); not in the default ALL set.
MULTIPLIER = ("multiplier", "grid_tiles_3.png", 2, 1,
              "a polished CYAN glass scope-LENS medallion inside a riveted metal scope-ring "
              "with a faint crosshair, glossy highlight upper-left; the lens centre is EMPTY "
              "with NO number and NO text on it")


def _prompt(subject: str) -> str:
    return f"{STYLE}\n\n{ISOLATE}\n\nSubject: {subject}."


def _prompt_wild(subject: str) -> str:
    return f"{STYLE}\n\n{ISOLATE_WILD}\n\nSubject: {subject}."


def _emit(client, out_name, sheet, col, row, subject, label=None) -> None:
    label = label or out_name
    ref = ref_crop(sheet, col, row)
    rgba = matted_retry(client, _prompt(subject), refs=[ref],
                        aspect="1:1", image_size="1K", label=label)
    alpha_report(rgba, label)
    save_webp(finish(rgba, 320), TILES_DIR / f"tile_{out_name}.webp")


def gen_character_or_letter(client, tid, sheet, col, row, subject) -> None:
    print(f"[{tid}]  ref={sheet}({col},{row})")
    _emit(client, tid, sheet, col, row, subject, label=tid)


def gen_scatter(client) -> None:
    _, sheet, col, row, subject = SCATTER
    print("[scatter]")
    _emit(client, "scatter", sheet, col, row, subject)


def _emit_wild(client, out_name, subject, label=None) -> None:
    """Like _emit but guided by the FULL wild owl reference image, using the
    wild-specific isolate clause that keeps the framed 'WILD' lettering."""
    label = label or out_name
    ref = ref_full(WILD_REF)
    rgba = matted_retry(client, _prompt_wild(subject), refs=[ref],
                        aspect="1:1", image_size="1K", label=label)
    alpha_report(rgba, label)
    save_webp(finish(rgba, 320), TILES_DIR / f"tile_{out_name}.webp")


def gen_wild(client) -> None:
    print("[wild]  ref=refs/" + WILD_REF)
    _emit_wild(client, "wild", WILD_SUBJECT)
    # gold "jump" variant: same owl, brighter blazing gold frame + stronger embers
    print("[wild_gold]")
    gold_subject = (
        WILD_SUBJECT
        .replace("ornate GOLDEN wooden picture frame", "ornate BRIGHT POLISHED-GOLD wooden picture frame")
        .replace("glowing orange EMBER firelight", "intense blazing golden-orange FIRE glow")
    )
    _emit_wild(client, "wild_gold", gold_subject, label="wild_gold")


def gen_multiplier(client) -> None:
    _, sheet, col, row, subject = MULTIPLIER
    print("[multiplier]  (cyan scope-lens; game overlays Nx) -> tile_wild_multiplier.webp")
    _emit(client, "wild_multiplier", sheet, col, row, subject, label="multiplier")
    # gold-ring "jump" variant for the bottom-row wild (docs/art-design.md:101)
    print("[multiplier_gold] -> tile_wild_multiplier_gold.webp")
    gold_subject = subject.replace("riveted metal scope-ring", "riveted GOLD scope-ring")
    _emit(client, "wild_multiplier_gold", sheet, col, row, gold_subject, label="multiplier_gold")


ALL = list(CHARACTERS) + list(LETTERS) + ["scatter", "wild"]
# `multiplier` is opt-in (regenerates the old cyan medallion as tile_multiplier.webp).
EXTRA = ["multiplier"]


def main() -> None:
    args = sys.argv[1:]
    if "--list" in args:
        print("tile ids:", ", ".join(ALL))
        print("extra (opt-in):", ", ".join(EXTRA))
        return
    which = args or ALL
    valid = ALL + EXTRA
    unknown = [w for w in which if w not in valid]
    if unknown:
        raise SystemExit(f"unknown tile id(s): {unknown}\nvalid: {valid}")

    client = get_client()
    print(f"Generating {len(which)} tile(s) → {TILES_DIR}")
    failed = []
    for tid in which:
        try:
            if tid in CHARACTERS:
                gen_character_or_letter(client, tid, *CHARACTERS[tid])
            elif tid in LETTERS:
                gen_character_or_letter(client, tid, *LETTERS[tid])
            elif tid == "scatter":
                gen_scatter(client)
            elif tid == "wild":
                gen_wild(client)
            elif tid == "multiplier":
                gen_multiplier(client)
        except Exception as e:  # noqa: BLE001 — keep the batch going
            print(f"  !! {tid} FAILED: {e}")
            failed.append(tid)
    if failed:
        print(f"\n{len(failed)} tile(s) failed: {failed}\nre-run just those, e.g.:  python tiles.py {' '.join(failed)}")
        raise SystemExit(1)
    print("done.")


if __name__ == "__main__":
    main()
