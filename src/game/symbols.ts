import type { SymbolId } from "./types";

/** Paytable — × total bet, indexed [3ofa, 4ofa, 5ofa]. Source: docs/math-and-rtp.md. */
export const PAYTABLE: Record<SymbolId, [number, number, number] | null> = {
  wild: [1.6, 4.8, 24.0],
  bunny: [1.6, 4.8, 24.0],
  "blue-girl": [1.2, 3.6, 18.0],
  bear: [0.8, 2.4, 12.0],
  deer: [0.4, 1.2, 6.0],
  A: [0.24, 0.72, 3.6],
  K: [0.2, 0.6, 3.0],
  Q: [0.16, 0.48, 2.4],
  J: [0.12, 0.36, 1.8],
  "10": [0.08, 0.24, 1.2],
  scatter: null, // no line pay — triggers free spins only
};

export interface SymbolMeta {
  id: SymbolId;
  name: string;
  tier: "wild" | "high" | "low" | "scatter";
  /** Emoji used as the recognizable subject inside the procedural art. */
  glyph: string;
  /** Body gradient stops (top → bottom) from docs/art-design.md. */
  grad: [string, string];
  accent: string;
  rim: string;
  /** Frame colour for the four framed "camper" character symbols; null = bare icon. */
  frame: string | null;
}

export const SYMBOLS: Record<SymbolId, SymbolMeta> = {
  wild: { id: "wild", name: "Multiplier Wild", tier: "wild", glyph: "◎", grad: ["#7FD6F0", "#3FA6D0"], accent: "#5CC6E8", rim: "#2A6E8E", frame: null },
  bunny: { id: "bunny", name: "Bunny Camper", tier: "high", glyph: "🐰", grad: ["#7AA84E", "#3E6A2C"], accent: "#5C8A3C", rim: "#24401C", frame: "#5C8A3C" },
  "blue-girl": { id: "blue-girl", name: "Blue Girl Camper", tier: "high", glyph: "👧", grad: ["#5AA0E0", "#2A5C9E"], accent: "#3A7FC4", rim: "#183A66", frame: "#3A7FC4" },
  bear: { id: "bear", name: "Bear Camper", tier: "high", glyph: "🐻", grad: ["#C6463A", "#7E211C"], accent: "#B23530", rim: "#4A130F", frame: "#B23530" },
  deer: { id: "deer", name: "Deer Camper", tier: "high", glyph: "🦌", grad: ["#EE7FB0", "#C24A82"], accent: "#E266A0", rim: "#7A2450", frame: "#E266A0" },
  A: { id: "A", name: "Ace", tier: "low", glyph: "A", grad: ["#C060D6", "#8E2FB0"], accent: "#AE44C4", rim: "#4A1560", frame: null },
  K: { id: "K", name: "King", tier: "low", glyph: "K", grad: ["#F09030", "#C05E12"], accent: "#E8801C", rim: "#5A2606", frame: null },
  Q: { id: "Q", name: "Queen", tier: "low", glyph: "Q", grad: ["#F8D24A", "#D89A1E"], accent: "#F0C838", rim: "#6A4408", frame: null },
  J: { id: "J", name: "Jack", tier: "low", glyph: "J", grad: ["#4A8ED8", "#245C9E"], accent: "#2E78C0", rim: "#12345E", frame: null },
  "10": { id: "10", name: "Ten", tier: "low", glyph: "10", grad: ["#E8483E", "#A81E18"], accent: "#D8352E", rim: "#4A0F0C", frame: null },
  scatter: { id: "scatter", name: "Scatter", tier: "scatter", glyph: "🌄", grad: ["#FFC24A", "#E8601C"], accent: "#F5901E", rim: "#2A1206", frame: null },
};

export function payFor(sym: SymbolId, count: number, totalBet: number): number {
  const row = PAYTABLE[sym];
  if (!row || count < 3) return 0;
  return row[count - 3] * totalBet;
}
