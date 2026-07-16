"""Scan public/assets/ and emit pack_manifest.json + a coverage report.

Maps what was generated against the asset set the React game consumes, so a human
can see at a glance what is present / missing.

Usage:  python manifest.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import ASSETS_DIR, GAME_ROOT  # noqa: E402

TARGETS: dict[str, str] = {
    # symbol tiles (matted RGBA)
    "tile_bunny": "tiles/tile_bunny.webp",
    "tile_bluegirl": "tiles/tile_bluegirl.webp",
    "tile_bear": "tiles/tile_bear.webp",
    "tile_deer": "tiles/tile_deer.webp",
    "tile_a": "tiles/tile_a.webp",
    "tile_k": "tiles/tile_k.webp",
    "tile_q": "tiles/tile_q.webp",
    "tile_j": "tiles/tile_j.webp",
    "tile_ten": "tiles/tile_ten.webp",
    "tile_scatter": "tiles/tile_scatter.webp",
    "tile_wild": "tiles/tile_wild.webp",
    "tile_wild_gold": "tiles/tile_wild_gold.webp",
    # backgrounds
    "bg_base": "backgrounds/bg_base.webp",
    "bg_base_sp": "backgrounds/bg_base_sp.webp",
    "bg_freespins": "backgrounds/bg_freespins.webp",
    "win_big": "backgrounds/win_big.webp",
    "win_mega": "backgrounds/win_mega.webp",
    "win_super": "backgrounds/win_super.webp",
    "win_sensational": "backgrounds/win_sensational.webp",
}


def main() -> None:
    entries, present, missing = {}, [], []
    for name, rel in TARGETS.items():
        p = ASSETS_DIR / rel
        ok = p.exists()
        entry = {"file": rel, "present": ok}
        if ok:
            entry["bytes"] = p.stat().st_size
            present.append(name)
        else:
            missing.append(name)
        entries[name] = entry

    manifest = {
        "game_id": "out-of-the-woods",
        "source": "refs/ (reference art) via slot-dynamic-grid pipeline",
        "generated_by": "scripts/*.py",
        "count": {"present": len(present), "missing": len(missing), "total": len(TARGETS)},
        "assets": entries,
    }
    (ASSETS_DIR / "pack_manifest.json").write_text(json.dumps(manifest, indent=2))
    rel = (ASSETS_DIR / "pack_manifest.json").relative_to(GAME_ROOT)
    print(f"{rel} → {len(present)}/{len(TARGETS)} present")
    if missing:
        print("MISSING:")
        for m in missing:
            print(f"  - {m}  ({TARGETS[m]})")


if __name__ == "__main__":
    main()
