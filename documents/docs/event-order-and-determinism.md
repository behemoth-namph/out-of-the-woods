# Event Order & Determinism — Out of the Woods

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | init | `seed, stake, betMode, mode` | player/auto initiates a spin |
| `stake_commit` | init | `stake, balanceAfter` | stake deducted from balance |
| `reels_land` | reveal | `board[4][5]` | reels stop and board is final |
| `stack_detect` | reveal | `stackReels[], stackMultipliers[][]` | full-reel Multiplier Wild stacks identified |
| `scatter_check` | reveal | `scatterCount` | scatters counted on the landed board |
| `win_evaluate` | eval | `lineWins[], rawWin` | 25 paylines evaluated |
| `multiplier_apply` | eval | `multipliedWin` | stack multipliers applied to crossing lines |
| `win_present` | present | `winAmount, tier` | win amount shown / counter rolls up |
| `respin_check` | loop | `willRespin` | tests win>0 AND a stack reel present |
| `stack_shift` | loop | `shiftN, newMultipliers[][]` | stack moves down (1, or random 2–10 if golden-rim exits) |
| `respin_spin` | loop | `board[4][5]` | non-stack reels respin |
| `fs_trigger` | feature | `scatterCount, spinsAwarded` | 3/4/5 scatters (base) → Free Spins |
| `fs_retrigger` | feature | `scatterCount, spinsAdded` | 3/4/5 scatters during Free Spins |
| `win_cap_check` | guard | `roundTotal, capped` | running total tested vs 10,000× |
| `round_end` | end | `totalWin, balanceAfter` | all wins/respins/free spins resolved |

## Deterministic Spin Event Order
1. `spin_start`
2. `stake_commit`
3. `reels_land` (draw #1 fills the board)
4. `stack_detect`
5. `scatter_check`
6. `win_evaluate`
7. `multiplier_apply` (× stack cell multipliers on crossing lines; if none, identity)
8. `win_present`
9. `win_cap_check` → if capped, jump to `round_end`
10. `respin_check` → if `win>0 AND stack present`:
    **RESPIN LOOP (repeat while each respin wins):**
    a. `stack_shift` (N=1 normally; N=randInt(2,10) if golden-rim on bottom row would exit)
    b. `respin_spin` (draw refills non-stack reels)
    c. `win_evaluate`
    d. `multiplier_apply`
    e. `win_present`
    f. `win_cap_check` → if capped, break to `round_end`
    g. `respin_check` → if the respin won, repeat a–g; else exit loop
11. If `scatter_check` ≥ 3 (base mode, not Super Spin): `fs_trigger`
    **FREE SPINS MODE:** repeat steps 3–10 per free spin on special reels; a spin with ≥3 scatters emits `fs_retrigger`; `highestMultiplierReached` persists across spins (seeds fresh stack tops).
12. `round_end`

**Per-mode notes**
- **Base:** as above; scatters may trigger `fs_trigger`.
- **Free Spins / bought:** first stack ladder `[1,2,3,4]` (normal) or `[10,11,12,13]` (Super FS); multipliers accumulate; `fs_trigger` skipped (already inside), `fs_retrigger` possible.
- **Super Spin special bet:** one stack guaranteed each spin; `fs_trigger` is **suppressed** (Free Spins disabled).

## Ordering Invariants
- `multiplier_apply` MUST run **after** `win_evaluate` and **before** `win_present` every spin — stack multipliers scale the raw line win, they are not a separate award (see [[wild_respin-mechanics]]).
- A `stack_shift` MUST only occur **after** a winning `win_present`; a no-win spin with a stack present emits no shift and no respin (see [[wild_respin-mechanics]] — chain ends on a no-win respin).
- `win_cap_check` MUST be evaluated after **every** `win_present` and before any subsequent `stack_shift`/`respin_spin`, so no draws happen once 10,000× is reached (see [[max_win_cap-mechanics]]).
- `scatter_check` MUST NOT emit `fs_trigger` while `betMode == superSpin` (see [[ante_bet-mechanics]]).
- The golden-rim random shift (2–10) MUST draw from the seeded RNG at the fixed draw position (see RNG Contract); `[ASSUMPTION]` it is drawn immediately at `stack_shift`, before `respin_spin`.
- `[ASSUMPTION]` Line evaluation order is reel-1-anchored, lines 1→25 ascending; chosen order, not pinned by spec.

## RNG Contract
- **PRNG stub:** a deterministic seeded generator (reference: `mulberry32(seed)` or equivalent). The **contract is the property, not the algorithm**: the same `(seed, stake, mode)` MUST produce an identical event stream and outcome.
- **Symbol WEIGHTS / reel-strip distribution are NOT part of this contract** — proprietary and not-derivable. The stub is **uniform** over the symbol set unless the spec supplies weights (it does not); real reel strips must be injected to hit RTP without changing draw positions.

**Draw-order table**
| draw # | purpose | when |
|---|---|---|
| 1 | initial board fill (5 reels, row-major or reel-major, fixed) | `reels_land` |
| 2 | stack placement (which reel(s) carry a guaranteed/landed Multiplier Wild stack) | `stack_detect` (Super Spin / feature guarantees) |
| 3 | golden-rim random shift distance (integer 2–10) — only when golden-rim on bottom row | each `stack_shift` where the condition holds |
| 4..n | respin refills of non-stack reels, in fixed reel order | each `respin_spin` |

Any new draw MUST be appended at a fixed, documented position; inserting a draw mid-sequence invalidates all golden snapshots.

## Replay & Golden Snapshots
- A spin is reproduced from `(seed, stake, mode)` → identical `board`, event stream, multipliers, and total.
- Golden snapshots capture the full ordered event list + final total for a set of seeds. **Changing any rule, multiplier ladder, evaluation order, or draw position invalidates the snapshots** and requires an intentional, reviewed regeneration (documented in the PR).

## References
- Paytable pages 1–3 `[t09]`,`[t11]`,`[t13]`; live play `[t29]`–`[t31]`.
- [[wild_respin-mechanics]], [[multiplier_wild_stack-mechanics]], [[free_spins-mechanics]], [[max_win_cap-mechanics]], [[ante_bet-mechanics]].