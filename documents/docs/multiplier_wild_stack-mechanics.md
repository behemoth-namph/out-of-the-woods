# Feature — Multiplier Wild Stack (`multiplier_wild_stack`)

## Trigger
A **Multiplier Wild** lands as a **full vertical stack that covers all 4 rows of a single reel**. It never appears partially — it is all-or-nothing per reel. It can appear on **any reel (1–5)** — observed on reel 4 (`[t29]`), reel 1 (`[t48]`), reel 2 (`[t55]`). More than one reel may carry a stack simultaneously `[ASSUMPTION — not directly observed, implied by "The next stacks that hit" wording in the paytable]`.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Rows covered per stack | 4 (full reel) | paytable `[t11]` |
| Base multiplier ladder (first hit) | bottom→top: **1×, 2×, 3×, 4×** | `[t11]`, `[t50]` |
| Substitution | all symbols except `scatter` | `[t11]` |
| Line pay if wild forms own combo | pays as top symbol (`rabbit_man`: 1.6×/4.8×/24×) | `[t09]`,`[t11]` |
| Golden-rim marker | exactly one wild in the stack bears a golden glowing rim (the shift anchor) | `[t29]`,`[t39]` |
| First stack in Free Spins | 1×/2×/3×/4× | `[t11]` |
| First stack in Super Free Spins (bought) | 10×/11×/12×/13× | `[t13]` |
| First stack under Super Spin special bet | guaranteed every spin, 1×/2×/3×/4× | `[t13]`,`[t50]` |

## Algorithm
1. On reel-land, for each reel check whether **all 4 cells are Multiplier Wild**. If yes, that reel is a **multiplier-wild reel**.
2. Assign per-cell multipliers bottom-to-top from the current ladder start: first hit in a round → `[1,2,3,4]` (index by row, row 3 = bottom = 1×, row 0 = top = 4×).
   - In a Free Spins round, a subsequent stack starts from the **highest multiplier reached earlier in the round**, placed at the top of the new stack (see [[free_spins-mechanics]]).
   - In a bought Super Free Spins round, the first stack starts `[10,11,12,13]`.
3. Mark the wild that begins on the **bottom row** as the **golden-rim** anchor for shift bookkeeping.
4. Evaluate paylines normally; each winning line that crosses a multiplier-wild reel is multiplied by that cell's multiplier (see [[wild_respin-mechanics]] for the multiplication rule and respin follow-on).
5. If the spin produced a win, hand off to [[wild_respin-mechanics]] to shift the stack and respin.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Per spin: `stackReels[]` (which reels hold a stack), `stackMultipliers[reel][row]` (4-length ladder per stacked reel), `goldenRimRow[reel]`.
- Across a Free Spins round: `highestMultiplierReached` (seeds the next fresh stack's top).
- Mode flags: `superFreeSpins`, `superSpinActive`.

## Interactions
- **Grid:** occupies an entire reel column; other reels spin normally.
- **Math:** wild substitutes for all regulars (not scatter); its multiplier feeds line-win multiplication in [[wild_respin-mechanics]] and [[math-and-rtp]].
- **[[wild_respin-mechanics]]:** a winning stack triggers the respin/shift loop.
- **[[free_spins-mechanics]]:** stack multipliers persist and accumulate across the round.
- **[[buy_feature-mechanics]] / [[ante_bet-mechanics]]:** alter the starting ladder / guarantee a stack.

## Edge cases
- A **single lone owl wild** (not a full stack) carries **no multiplier** — confirmed `[t32]`.
- Two stacks on the same spin: each applies its own ladder; a line crossing both reels multiplies both cell multipliers `[ASSUMPTION]`.
- A stack that lands but produces **no win** does **not** respin and does **not** shift (`[t48]`, `[t50]`).
- Multiplier cap: bounded only by the 10,000× win cap — see [[max_win_cap-mechanics]].

## QA checklist
- [ ] A Multiplier Wild reel always fills exactly 4 cells; assert no partial stacks are ever generated.
- [ ] First stack of a base round is ladder `[1,2,3,4]` bottom-to-top; a bought Super Free Spins first stack is `[10,11,12,13]`.
- [ ] A lone (non-stack) owl wild applies a multiplier of exactly 1× (i.e. none).

## References
- Paytable pages 1–2 `[t09]`, `[t11]`; page 3 `[t13]`.
- Live play `[t29]`,`[t30]`,`[t32]`,`[t48]`,`[t50]`,`[t55]`.