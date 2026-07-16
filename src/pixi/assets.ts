// PixiJS texture loading for Out of the Woods.
// Loads the generated .webp art (tiles + backgrounds). Missing files resolve to
// null so the renderer can fall back to procedural drawing.
import { Assets, Texture } from "pixi.js";
import type { SymbolId } from "../game/types";
import {
  BG,
  GRID_FRAME_SRC,
  LOGO_FS_SRC,
  LOGO_SRC,
  TILE_SRC,
  WILD_GOLD_SRC,
  WILD_MULTIPLIER_SRC,
  WILD_SRC,
} from "../game/assets";

export interface GameTextures {
  tiles: Partial<Record<SymbolId, Texture>>;
  wild: Texture | null;
  wildGold: Texture | null;
  wildMultiplier: Texture | null;
  bg: Partial<Record<keyof typeof BG, Texture>>;
  gridFrame: Texture | null;
  logo: Texture | null;
  logoFs: Texture | null;
}

async function tryLoad(url: string): Promise<Texture | null> {
  try {
    const tex = await Assets.load(url);
    return tex ?? null;
  } catch {
    return null;
  }
}

export async function loadTextures(): Promise<GameTextures> {
  const tiles: Partial<Record<SymbolId, Texture>> = {};
  const tileEntries = Object.entries(TILE_SRC) as [SymbolId, string][];
  const bg: Partial<Record<keyof typeof BG, Texture>> = {};
  const bgEntries = Object.entries(BG) as [keyof typeof BG, string][];

  const [tileResults, wild, wildGold, wildMultiplier, bgResults, gridFrame, logo, logoFs] =
    await Promise.all([
      Promise.all(tileEntries.map(([, url]) => tryLoad(url))),
      tryLoad(WILD_SRC),
      tryLoad(WILD_GOLD_SRC),
      tryLoad(WILD_MULTIPLIER_SRC),
      Promise.all(bgEntries.map(([, url]) => tryLoad(url))),
      tryLoad(GRID_FRAME_SRC),
      tryLoad(LOGO_SRC),
      tryLoad(LOGO_FS_SRC),
    ]);

  tileEntries.forEach(([id], i) => {
    const t = tileResults[i];
    if (t) tiles[id] = t;
  });
  bgEntries.forEach(([id], i) => {
    const t = bgResults[i];
    if (t) bg[id] = t;
  });

  return { tiles, wild, wildGold, wildMultiplier, bg, gridFrame, logo, logoFs };
}
