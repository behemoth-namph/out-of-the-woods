// 25 fixed paylines for a 4-row × 5-reel grid.
// Each line is the row index (0 = top … 3 = bottom) taken at each of the 5 reels.
// The 4 straight horizontals (rows 0..3) are lines 1-4 — canonical members of any
// 25-line map (docs/test-vectors.md relies only on those). The remaining 21 are a
// standard mix of Vs, zig-zags and chevrons so every payline is distinct.

export const PAYLINES: number[][] = [
  [0, 0, 0, 0, 0], // 1  ── top row
  [1, 1, 1, 1, 1], // 2  ── row 2
  [2, 2, 2, 2, 2], // 3  ── row 3
  [3, 3, 3, 3, 3], // 4  ── bottom row
  [0, 1, 2, 1, 0], // 5  V
  [3, 2, 1, 2, 3], // 6  ^
  [1, 2, 3, 2, 1], // 7  V (lower)
  [2, 1, 0, 1, 2], // 8  ^ (upper)
  [0, 0, 1, 0, 0], // 9
  [1, 1, 2, 1, 1], // 10
  [2, 2, 3, 2, 2], // 11
  [1, 0, 0, 0, 1], // 12
  [2, 1, 1, 1, 2], // 13
  [3, 2, 2, 2, 3], // 14
  [0, 1, 1, 1, 0], // 15
  [1, 2, 2, 2, 1], // 16
  [2, 3, 3, 3, 2], // 17
  [0, 1, 0, 1, 0], // 18  zig-zag
  [1, 2, 1, 2, 1], // 19  zig-zag
  [2, 3, 2, 3, 2], // 20  zig-zag
  [3, 3, 2, 3, 3], // 21
  [0, 0, 1, 2, 3], // 22  diagonal down
  [3, 2, 1, 0, 0], // 23  diagonal up
  [1, 0, 1, 2, 1], // 24
  [2, 3, 2, 1, 2], // 25
];
