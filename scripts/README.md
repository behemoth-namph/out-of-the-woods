# Asset generation scripts

Generate the game's image assets from the reference art in [`../refs/`](../refs/)
using the **slot-dynamic-grid pipeline** (Gemini image model + the pipeline's
difference-matting / trim / WebP processors).

Each symbol tile is guided by a **reference crop** of the actual game art, so the
generated pack reproduces the source game's hand-painted comic-woodland symbols —
isolated and matted to a clean alpha channel — rather than re-inventing them.

## Prerequisites

The pipeline lives at:

```
/Users/namph/Documents/projects/ebisu/slot-dynamic-grid/pipeline/executor
```

It already has a `.venv` (Python 3.11) and a `.env` with `GOOGLE_API_KEY`. Run the
scripts with **that venv's python** (they import the `pipeline` package and read
its `.env`). Override the location with `PIPELINE_EXECUTOR=/path/to/executor`.

```bash
PY=/Users/namph/Documents/projects/ebisu/slot-dynamic-grid/pipeline/executor/.venv/bin/python
cd scripts
```

## Generate

```bash
$PY tiles.py            # 12 matted symbol tiles → ../public/assets/tiles/
$PY tiles.py bear deer  # a subset (validation / re-run failures)
$PY tiles.py --list     # list tile ids

$PY backgrounds.py          # convert ref backgrounds → webp + generate FS night bg
$PY backgrounds.py convert  # only the ref → webp re-encodes (no network)
$PY backgrounds.py freespins# only the generated moonlit night background

$PY manifest.py         # write ../public/assets/pack_manifest.json + coverage report
```

Output lands directly in [`../public/assets/`](../public/assets/), which Vite
serves at `/assets/...`. The React game loads each tile by convention and falls
back to its built-in procedural art if a file is missing, so a partial pack still
runs.

## How it works

- `_common.py` — the harness. Loads the pipeline package + `.env`, crops a cell
  from a `refs/tiles/*.png` grid (`ref_crop`), calls Gemini (`gen_once`), and
  difference-mattes white/black renders into RGBA (`matted` / `matted_retry`, with
  a retry loop because a clean matte pair isn't guaranteed every shot).
- `tiles.py` — per-symbol subject clauses + which reference cell each comes from.
- `backgrounds.py` — re-encodes the finished ref backgrounds and generates the one
  missing piece (a moonlit free-spins forest) from the base forest as reference.
- `manifest.py` — coverage report against the asset set the game consumes.

## Cost / determinism note

These are **networked image-generation** tools (unlike the pipeline's offline
tests) — each matted tile is 2+ Gemini calls. Nothing is written on provider
failure. Re-runs overwrite in place; pass specific ids to regenerate only those.
