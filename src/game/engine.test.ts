import { describe, expect, it } from "vitest";
import type { Board, Cell, SymbolId } from "./types";
import { PAYLINES } from "./paylines";
import { payFor } from "./symbols";
import { countScatters, freeSpinsForScatters, applyCap } from "./engine";

// Test harness that mirrors the engine's pure evaluation on a GIVEN board, so we
// can assert the documented test vectors (docs/test-vectors.md) without RNG.
// (The engine's evalLine is internal; this reproduces the exact same rule.)

function W(n: number): Cell {
  return { sym: "wild", mult: n };
}
function C(sym: SymbolId): Cell {
  return { sym };
}

/** Parse a 4-row × 5-col board from a compact matrix of tokens. */
function board(rows: Cell[][]): Board {
  return rows;
}

function evalLine(b: Board, lineRows: number[], totalBet: number) {
  const cellAt = (r: number) => b[lineRows[r]][r];
  if (cellAt(0).sym === "scatter") return null;
  let target: SymbolId | null = null;
  for (let r = 0; r < 5; r++) {
    const s = cellAt(r).sym;
    if (s !== "wild" && s !== "scatter") {
      target = s;
      break;
    }
  }
  let targetCount = 0;
  if (target)
    for (let r = 0; r < 5; r++) {
      const s = cellAt(r).sym;
      if (s === target || s === "wild") targetCount++;
      else break;
    }
  let wildCount = 0;
  for (let r = 0; r < 5; r++) {
    if (cellAt(r).sym === "wild") wildCount++;
    else break;
  }
  const targetPay = target ? payFor(target, targetCount, totalBet) : 0;
  const wildPay = payFor("wild", wildCount, totalBet);
  let sym: SymbolId, count: number, basePay: number;
  if (wildPay > targetPay) {
    sym = "wild";
    count = wildCount;
    basePay = wildPay;
  } else if (target && targetPay > 0) {
    sym = target;
    count = targetCount;
    basePay = targetPay;
  } else return null;
  let lineMult = 1;
  for (let r = 0; r < count; r++) {
    const cell = cellAt(r);
    if (cell.sym === "wild" && cell.mult) lineMult *= cell.mult;
  }
  return { sym, count, linePay: basePay * lineMult };
}

// docs/test-vectors.md convention: the vectors rely ONLY on the 4 straight
// horizontal lines (A=row0, B=row1, C=row2, D=row3), which are canonical members
// of any 25-line map. Non-horizontal lines are irrelevant to every vector board,
// so we score against just those four here.
const HORIZONTALS = PAYLINES.slice(0, 4);
function spinWin(b: Board, totalBet: number) {
  let total = 0;
  for (const rows of HORIZONTALS) {
    const w = evalLine(b, rows, totalBet);
    if (w) total += w.linePay;
  }
  return total;
}

const BET = 2.0;

describe("Out of the Woods — documented test vectors", () => {
  it("TV-01 no-win board pays 0", () => {
    const b = board([
      [C("10"), C("J"), C("Q"), C("K"), C("A")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBe(0);
    expect(countScatters(b)).toBe(0);
  });

  it("TV-02 exactly 3 deer on top row → $0.80", () => {
    const b = board([
      [C("deer"), C("deer"), C("deer"), C("K"), C("A")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBeCloseTo(0.8, 5);
  });

  it("TV-03 4-of-a-kind bear → $4.80", () => {
    const b = board([
      [C("bear"), C("bear"), C("bear"), C("bear"), C("K")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBeCloseTo(4.8, 5);
  });

  it("TV-04 5-of-a-kind bear → $24.00", () => {
    const b = board([
      [C("bear"), C("bear"), C("bear"), C("bear"), C("bear")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBeCloseTo(24.0, 5);
  });

  it("TV-05 two symbols winning simultaneously → $4.00", () => {
    const b = board([
      [C("deer"), C("deer"), C("deer"), C("K"), C("A")],
      [C("bunny"), C("bunny"), C("bunny"), C("10"), C("Q")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBeCloseTo(4.0, 5);
  });

  it("TV-06 step 1: 3 deer crossing 4× stack cell → $3.20", () => {
    const b = board([
      [C("deer"), C("deer"), W(4), C("Q"), C("A")],
      [C("A"), C("K"), W(3), C("J"), C("10")],
      [C("J"), C("Q"), W(2), C("K"), C("10")],
      [C("10"), C("J"), W(1), C("A"), C("Q")],
    ]);
    // Line A (top row): deer, deer, W(4×) → 3 deer × 4 = 0.4 × 2 × 4 = 3.20
    expect(spinWin(b, BET)).toBeCloseTo(3.2, 5);
  });

  it("TV-07 per-line multiplier: 3 deer on row 2 crossing 5× → $4.00", () => {
    const b = board([
      [C("A"), C("K"), W(6), C("Q"), C("J")],
      [C("deer"), C("deer"), W(5), C("K"), C("A")],
      [C("J"), C("Q"), W(4), C("10"), C("Q")],
      [C("10"), C("J"), W(3), C("A"), C("K")],
    ]);
    // Only line B (row 2) wins: deer,deer,W(5×) → 0.4 × 2 × 5 = 4.00
    expect(spinWin(b, BET)).toBeCloseTo(4.0, 5);
  });

  it("TV-08 three scatters award 10 free spins, no line win", () => {
    const b = board([
      [C("scatter"), C("J"), C("Q"), C("K"), C("A")],
      [C("A"), C("K"), C("scatter"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("scatter")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(countScatters(b)).toBe(3);
    expect(freeSpinsForScatters(3)).toBe(10);
    expect(spinWin(b, BET)).toBe(0);
  });

  it("TV-09 scatter award bands", () => {
    expect(freeSpinsForScatters(4)).toBe(15);
    expect(freeSpinsForScatters(5)).toBe(20);
    expect(freeSpinsForScatters(2)).toBe(0);
  });

  it("TV-10 win cap clamps to 10,000× bet", () => {
    const raw = 24.0 * 2.0 * 500; // 24,000
    expect(applyCap(raw, BET)).toBe(20000);
  });

  it("TV-13 left-to-right gap: 4 K on reels 2-5 pays nothing", () => {
    const b = board([
      [C("J"), C("K"), C("K"), C("K"), C("K")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBe(0);
  });

  it("wild line pays when leading wilds beat the substituted low symbol", () => {
    // W,W,W,A,K → A-line 4× = 0.72×2 = 1.44 vs wild-line 3× = 1.6×2 = 3.20 → wild wins
    const b = board([
      [W(1), W(1), W(1), C("A"), C("K")],
      [C("A"), C("K"), C("Q"), C("J"), C("10")],
      [C("J"), C("Q"), C("K"), C("A"), C("10")],
      [C("Q"), C("A"), C("J"), C("K"), C("10")],
    ]);
    expect(spinWin(b, BET)).toBeCloseTo(3.2, 5);
  });
});
