// Generated-asset paths (produced by scripts/*.py from refs/ via the pipeline).
// Served by Vite from public/assets/. Every consumer falls back to procedural art
// when a file is absent, so a partial pack still runs.
import type { SymbolId } from "./types";

const B = import.meta.env.BASE_URL; // "/" in dev + default build

export const TILE_SRC: Record<SymbolId, string> = {
  bunny: `${B}assets/tiles/tile_bunny.webp`,
  "blue-girl": `${B}assets/tiles/tile_bluegirl.webp`,
  bear: `${B}assets/tiles/tile_bear.webp`,
  deer: `${B}assets/tiles/tile_deer.webp`,
  A: `${B}assets/tiles/tile_a.webp`,
  K: `${B}assets/tiles/tile_k.webp`,
  Q: `${B}assets/tiles/tile_q.webp`,
  J: `${B}assets/tiles/tile_j.webp`,
  "10": `${B}assets/tiles/tile_ten.webp`,
  scatter: `${B}assets/tiles/tile_scatter.webp`,
  wild: `${B}assets/tiles/tile_wild.webp`,
};

export const WILD_SRC = `${B}assets/tiles/tile_wild.webp`;
export const WILD_GOLD_SRC = `${B}assets/tiles/tile_wild_gold.webp`;
// The cyan scope-lens medallion, shown for wilds that carry a real multiplier
// (mult >= 2). The game overlays the live "Nx" numeral on its empty centre.
export const WILD_MULTIPLIER_SRC = `${B}assets/tiles/tile_wild_multiplier.webp`;

export const LOGO_SRC = `${B}assets/chrome/logo.webp`;
export const LOGO_FS_SRC = `${B}assets/chrome/logo_fs.webp`;
export const GRID_FRAME_SRC = `${B}assets/chrome/grid_frame.webp`;

export const BG = {
  base: `${B}assets/backgrounds/bg_base.webp`,
  freespins: `${B}assets/backgrounds/bg_freespins.webp`,
  win_big: `${B}assets/backgrounds/win_big.webp`,
  win_mega: `${B}assets/backgrounds/win_mega.webp`,
  win_super: `${B}assets/backgrounds/win_super.webp`,
  win_sensational: `${B}assets/backgrounds/win_sensational.webp`,
};

// Win-tier wordmark → celebration backdrop.
export const TIER_BG: Record<string, string> = {
  "NICE!": BG.win_big,
  "BIG WIN": BG.win_big,
  "MEGA WIN": BG.win_mega,
  "SUPER WIN": BG.win_super,
};
