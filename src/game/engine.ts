import type {
  Board,
  Cell,
  GameMode,
  RespinStep,
  SymbolId,
  WinningLine,
} from "./types";
import { REELS, ROWS } from "./types";
import { PAYLINES } from "./paylines";
import { payFor } from "./symbols";
import type { Rng } from "./rng";

// ── Tunable reel model ───────────────────────────────────────────────────────
// Reel weights are proprietary and NOT derivable from the docs (confidence 0.05).
// Per the determinism contract the stub may substitute a distribution when none
// is supplied — these weights are chosen so the demo actually surfaces its
// features (wins, stacks, respins, scatters) at a watchable cadence.
const CELL_WEIGHTS: [SymbolId, number][] = [
  ["10", 20],
  ["J", 18],
  ["Q", 16],
  ["K", 14],
  ["A", 12],
  ["deer", 9],
  ["bear", 7],
  ["blue-girl", 5],
  ["bunny", 4],
  ["scatter", 3],
];

// Probability that a spin lands a wild stack AT ALL (board-level). At most ONE
// stack reel exists at a time — every live capture of the game shows a single
// stack column (reels differ between shots but there's only ever one). Allowing
// stacks on alternating reels would make every payline win via wild-substitution
// and the respin chain would never terminate.
const STACK_BOARD_CHANCE: Record<GameMode, number> = { base: 0.17, free: 0.36 };
const GOLD_RIM_CHANCE = 0.22; // chance a landed stack's bottom wild is gold-rimmed
const RESPIN_SAFETY_CAP = 60; // guards against a pathological infinite ladder
export const WIN_CAP_X = 10_000; // × total bet

const SCATTER_AWARD: Record<number, number> = { 3: 10, 4: 15, 5: 20 };

export interface ResolveOpts {
  rng: Rng;
  totalBet: number;
  mode: GameMode;
  /** carried-over top multiplier (free spins). A new stack starts at max(4, this). */
  storedTop?: number;
  /** super-spin / super-buy: guarantee at least one stack every spin. */
  guaranteeStack?: boolean;
}

export interface ResolveResult {
  steps: RespinStep[];
  chainWin: number;
  topMultReached: number;
  scatterCount: number;
  stackPresent: boolean;
}

// ── board construction ───────────────────────────────────────────────────────

function stackCells(ladderTop: number, gold: boolean): Cell[] {
  // top row = highest, descending to bottom row.
  const col: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    const mult = Math.max(1, ladderTop - row);
    col.push({ sym: "wild", mult, gold: gold && row === ROWS - 1 });
  }
  return col;
}

/** Build a fresh board. Reels in `heldStacks` keep their stack (respin holds). */
function fillBoard(
  rng: Rng,
  mode: GameMode,
  ladderTop: number,
  heldStacks: Set<number>,
  guaranteeStack: boolean
): { board: Board; stackReels: number[] } {
  const columns: Cell[][] = [];
  const stackReels: number[] = [];

  // Determine the single stack reel: a held one persists, otherwise maybe one lands.
  let stackReel = heldStacks.size ? [...heldStacks][0] : -1;
  if (stackReel < 0 && (guaranteeStack || rng.next() < STACK_BOARD_CHANCE[mode])) {
    stackReel = rng.int(0, REELS - 1);
  }

  for (let reel = 0; reel < REELS; reel++) {
    if (reel === stackReel) {
      const gold = rng.next() < GOLD_RIM_CHANCE;
      columns[reel] = stackCells(ladderTop, gold);
      stackReels.push(reel);
    } else {
      const col: Cell[] = [];
      for (let row = 0; row < ROWS; row++) col.push({ sym: rng.pick(CELL_WEIGHTS) });
      columns[reel] = col;
    }
  }

  // transpose columns → board[row][reel]
  const board: Board = [];
  for (let row = 0; row < ROWS; row++) {
    board.push(columns.map((c) => c[row]));
  }
  return { board, stackReels };
}

// ── evaluation (pure — consumes no draws) ────────────────────────────────────

function evalLine(board: Board, lineIdx: number, lineRows: number[], totalBet: number): WinningLine | null {
  const cellAt = (r: number) => board[lineRows[r]][r];
  if (cellAt(0).sym === "scatter") return null;

  // target = first non-wild, non-scatter symbol along the line
  let target: SymbolId | null = null;
  for (let r = 0; r < REELS; r++) {
    const s = cellAt(r).sym;
    if (s !== "wild" && s !== "scatter") {
      target = s;
      break;
    }
  }

  let targetCount = 0;
  if (target) {
    for (let r = 0; r < REELS; r++) {
      const s = cellAt(r).sym;
      if (s === target || s === "wild") targetCount++;
      else break;
    }
  }

  let wildCount = 0;
  for (let r = 0; r < REELS; r++) {
    if (cellAt(r).sym === "wild") wildCount++;
    else break;
  }

  const targetPay = target ? payFor(target, targetCount, totalBet) : 0;
  const wildPay = payFor("wild", wildCount, totalBet);

  let sym: SymbolId;
  let count: number;
  let basePay: number;
  if (wildPay > targetPay) {
    sym = "wild";
    count = wildCount;
    basePay = wildPay;
  } else if (target && targetPay > 0) {
    sym = target;
    count = targetCount;
    basePay = targetPay;
  } else {
    return null;
  }

  let lineMult = 1;
  const cells: [number, number][] = [];
  for (let r = 0; r < count; r++) {
    const cell = cellAt(r);
    cells.push([lineRows[r], r]);
    if (cell.sym === "wild" && cell.mult) lineMult *= cell.mult;
  }

  return { line: lineIdx + 1, sym, count, basePay, lineMult, linePay: basePay * lineMult, cells };
}

function evaluate(board: Board, totalBet: number): WinningLine[] {
  const wins: WinningLine[] = [];
  PAYLINES.forEach((rows, i) => {
    const w = evalLine(board, i, rows, totalBet);
    if (w) wins.push(w);
  });
  return wins;
}

export function countScatters(board: Board): number {
  let n = 0;
  for (const row of board) for (const c of row) if (c.sym === "scatter") n++;
  return n;
}

function bottomGoldPresent(board: Board, stackReels: number[]): boolean {
  return stackReels.some((reel) => board[ROWS - 1][reel].gold);
}

// ── full spin + respin chain ─────────────────────────────────────────────────

export function resolveSpin(opts: ResolveOpts): ResolveResult {
  const { rng, totalBet, mode, guaranteeStack = false } = opts;
  let ladderTop = Math.max(4, opts.storedTop ?? 0);

  const steps: RespinStep[] = [];

  // Step 0 — initial land.
  let { board, stackReels } = fillBoard(rng, mode, ladderTop, new Set(), guaranteeStack);
  let wins = evaluate(board, totalBet);
  let stepWin = wins.reduce((s, w) => s + w.linePay, 0);
  steps.push({
    board,
    stackReels,
    winningLines: wins,
    stepWin,
    topMultiplier: stackReels.length ? ladderTop : 0,
    shiftN: 0,
    goldJump: false,
  });

  // Respin loop — continue while (win AND a stack is present).
  let guard = 0;
  while (stepWin > 0 && stackReels.length > 0 && guard++ < RESPIN_SAFETY_CAP) {
    // respin_check → stack_shift: N=1, or N=randInt(2,10) if a gold rim sits on the bottom row
    const goldJump = bottomGoldPresent(board, stackReels);
    const shiftN = goldJump ? rng.int(2, 10) : 1;
    ladderTop += shiftN;

    // hold the stack reel; respin the rest
    const held = new Set<number>(stackReels);
    ({ board, stackReels } = fillBoard(rng, mode, ladderTop, held, guaranteeStack));

    wins = evaluate(board, totalBet);
    stepWin = wins.reduce((s, w) => s + w.linePay, 0);
    steps.push({
      board,
      stackReels,
      winningLines: wins,
      stepWin,
      topMultiplier: stackReels.length ? ladderTop : 0,
      shiftN,
      goldJump,
    });
  }

  const finalBoard = steps[steps.length - 1].board;
  const chainWin = steps.reduce((s, st) => s + st.stepWin, 0);
  const topMultReached = steps.reduce((m, st) => Math.max(m, st.topMultiplier), 0);

  return {
    steps,
    chainWin,
    topMultReached,
    scatterCount: countScatters(finalBoard),
    stackPresent: steps.some((s) => s.stackReels.length > 0),
  };
}

export function freeSpinsForScatters(count: number): number {
  return SCATTER_AWARD[count] ?? 0;
}

/** Clamp a cumulative round/feature win to the 10,000× cap. */
export function applyCap(win: number, totalBet: number): number {
  return Math.min(win, WIN_CAP_X * totalBet);
}
