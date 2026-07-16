// ── Core domain types for Out of the Woods ──────────────────────────────────

/** Symbol ids as used across the engine and art layer. */
export type SymbolId =
  | "wild"
  | "bunny"
  | "blue-girl"
  | "bear"
  | "deer"
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "scatter";

export type BetMode = "normal" | "ante" | "super-spin";
export type BuyMode = "standard" | "super";
export type GameMode = "base" | "free";

/** ROWS = 4 (top→bottom, row 0 is top), COLS/REELS = 5 (left→right, reel 0 left). */
export const ROWS = 4;
export const REELS = 5;

/** A single landed cell. `wild` cells carry a multiplier and possibly a gold rim. */
export interface Cell {
  sym: SymbolId;
  /** Only meaningful for wild cells: the medallion multiplier (>=1). */
  mult?: number;
  /** Only for the wild sitting on the bottom row of a stack: the "jump" trigger. */
  gold?: boolean;
}

/** board[row][reel] */
export type Board = Cell[][];

export interface WinningLine {
  line: number; // 1-based payline index
  sym: SymbolId;
  count: number; // 3..5
  basePay: number; // paytable value * totalBet (before line multiplier)
  lineMult: number; // product of stack multipliers the winning portion crosses
  linePay: number; // basePay * lineMult
  /** [row, reel] cells that make up the win (for highlight). */
  cells: [number, number][];
}

export interface SpinResult {
  board: Board;
  stackReels: number[];
  winningLines: WinningLine[];
  spinWin: number;
  scatterCount: number;
}

/** One fully-resolved (re)spin step, for the presentation layer to replay. */
export interface RespinStep {
  board: Board;
  stackReels: number[];
  winningLines: WinningLine[];
  stepWin: number;
  topMultiplier: number; // highest multiplier visible after this step
  shiftN: number; // amount the ladder climbed to REACH this step (0 for first)
  goldJump: boolean; // whether this step's climb was a gold-rim jump
}

/** The complete outcome of one player action (a base spin or one free spin). */
export interface RoundStep {
  kind: "base" | "free";
  steps: RespinStep[]; // step 0 = initial land, then each respin
  chainWin: number; // sum over all steps
  scatterCount: number; // scatters on the initial settled board
  freeSpinsAwarded: number; // 0, 10, 15 or 20
  spinIndex?: number; // for free spins: 1-based
  spinsRemaining?: number; // for free spins after this spin
}
