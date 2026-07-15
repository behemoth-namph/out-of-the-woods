# Event Order & Determinism — Out of the Woods

This game is a **25-fixed-payline** game with a **Multiplier Wild respin** loop and a **free-spins** feature. **There is no cascade/tumble** — symbols do not drop to refill after a win; the "loop" is the respin chain, not a tumble (confirmed [t43]).

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | spin init | `spinId, mode, stake, betMode` | player presses spin / feature spin begins |
| `bet_commit` | spin init | `stake, balanceAfter` | stake deducted (base spins only) |
| `board_fill` | draw | `board[4][5], drawCount` | RNG fills the board |
| `reels_land` | land | `board[4][5]` | reels stop, symbols visible |
| `wild_stack_detect` | evaluate | `stackReels[], multipliers[reel][row]` | full-reel wild stacks identified |
| `line_evaluate` | evaluate | `winningLines[]{line,symbol,count,basePay}` | 25 paylines scanned L→R |
| `multiplier_apply` | evaluate | `winningLines[]{lineMult, linePay}` | per-line wild multiplier applied |
| `win_tally` | evaluate | `spinWin, chainWin` | line pays summed for this (re)spin |
| `win_present` | present | `spinWin, tier` | win banner/highlight shown |
| `respin_check` | loop ctrl | `respinGranted, shiftN, goldRimBottom` | decide whether a respin follows |
| `stack_shift` | respin | `multipliers[reel][row], shiftN` | stack multipliers increased before respin |
| `respin_land` | respin | `board[4][5]` | held stack + injected non-held reels land |
| `no_more_wins` | loop end | `chainWin` | a respin produced no win → chain ends |
| `scatter_check` | evaluate | `scatterCount` | scatters counted on settled board |
| `fs_trigger` | feature | `scatterCount, spinsAwarded` | 3/4/5 scatters award free spins |
| `fs_spin_start` | feature | `spinsRemaining, storedTopMultiplier` | each free spin begins |
| `win_cap_clamp` | settle | `rawWin, cappedWin` | cumulative win clamped to 10,000× |
| `round_end` | settle | `totalWin, balanceAfter` | round fully resolved |

## Deterministic Spin Event Order
```
1. spin_start
2. bet_commit                         (base spins only; buy/free-spin spins skip)
3. board_fill                         (RNG — see draw table)
4. reels_land
5. wild_stack_detect
6. line_evaluate                      (25 lines, L→R from reel 1, using the pay RULE not grid.type)
7. multiplier_apply                   (per-line stack multiplier; ×1 if line misses stack)
8. win_tally                          (spinWin; chainWin += spinWin)
9. win_present
10. respin_check
    RESPIN LOOP (repeat while spinWin>0 AND a stack is present):
        a. stack_shift   (N=1, or N=randInt(2,10) if gold-rim on bottom row)
        b. respin_land   (hold stack reels; inject other reels)
        c. wild_stack_detect
        d. line_evaluate
        e. multiplier_apply
        f. win_tally
        g. win_present
        h. respin_check
    → on first respin with spinWin==0: no_more_wins
11. scatter_check
12. fs_trigger                        (only if scatterCount>=3 AND freeSpinsEnabled)
13. win_cap_clamp
14. round_end
```
Per-mode notes:
- **Base:** as above. Steps 2 runs; 12 runs only if `betMode != super-spin`.
- **Free spins:** entered after `fs_trigger`; loop of `fs_spin_start` → (3)…(11) per spin; `bet_commit` skipped; `storedTopMultiplier` seeds each stack; retrigger adds spins at step 11.
- **Buy:** skip natural trigger — deduct buy cost, then jump straight to `fs_spin_start` loop.
- **Super Spin:** step 5 always finds a stack; step 12 always yields 0 spins (feature disabled).

## Ordering Invariants
- **`multiplier_apply` MUST run after `wild_stack_detect` and before `win_tally`** — per-line multipliers depend on which cell each winning line crosses (observed "$0.80 × 5 = $4.00" is a per-line, not per-total, product) — see [[multiplier-wild-respin-mechanics]].
- **`stack_shift` MUST occur once per respin, before `respin_land`, and only after a winning `win_tally`** — the ladder climbs on *winning* respins only; no win ⇒ no shift ⇒ `no_more_wins` — see [[multiplier-wild-respin-mechanics]].
- **`scatter_check`/`fs_trigger` MUST run after the entire respin loop ends (`no_more_wins`), not per respin** [ASSUMPTION: scatter evaluation timing not directly observed; chosen to evaluate on the final settled board].
- **`win_cap_clamp` MUST be the last computation before `round_end`**, applied to the cumulative round total (base + all respins + free spins) — see [[math-and-rtp]].
- **Line evaluation MUST use the left-to-right 3+-from-reel-1 RULE**, never a cluster/ways interpretation of `grid.type` (confirmed [t20]).
- **`bet_commit` MUST NOT fire on free-spin or respin steps** — only the initiating base spin (or buy deduction) charges the player.

## RNG Contract
Use a deterministic seeded PRNG **stub** (reference: `mulberry32` or equivalent). **Contract, not algorithm:** the same `(seed, stake, mode)` MUST produce an identical event stream and outcome. Symbol **weights/distribution are NOT part of this contract** — they are proprietary and `not-derivable`; the stub draws **uniformly** unless the spec supplies weights. Any new draw MUST be appended at a fixed, documented position.

| draw # | purpose | when |
|---|---|---|
| 1..20 | initial board fill — reel-major (reel 1 rows top→bottom, then reel 2 …, reel 5) | `board_fill` |
| next | (respin) fill of each non-held cell, reel-major over non-held reels only | each `respin_land` |
| next | gold-rim jump size `N = 2 + floor(u × 9)` ∈ [2,10] — only when a gold-rimmed wild is on the bottom row | before `stack_shift` |
| next | (free spins) special-reel board fill per spin, reel-major | each `fs_spin_start` |

Detection, evaluation, multiplier application, tallying, and capping consume **no draws** (pure functions of the board + state).

## Replay & Golden Snapshots
A spin is reproduced from `(seed, stake, mode, betMode)`: seed the stub, replay draws in the exact order above, run the deterministic event sequence, emit the event stream. Golden snapshots capture the full ordered event list + final board(s) + totals. **Changing any rule (pay, multiplier ladder, shift amount, cap) or any draw position invalidates all golden snapshots and requires an intentional, reviewed regeneration.**

## References
- game-brief.md; PLAYER LOG [t20], [t43], [t54]
- [[multiplier-wild-respin-mechanics]], [[free-spins-mechanics]], [[math-and-rtp]]
- https://slotcatalog.com/en/slots/out-of-the-woods
<<<END-OF-FILE>>>