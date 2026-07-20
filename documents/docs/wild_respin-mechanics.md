# Feature — Wild Respin (`wild_respin`)

## Trigger
After **any spin or respin that (a) contains at least one Multiplier Wild reel AND (b) produced at least one winning payline**, the game **automatically respins** (no player input). Confirmed auto-fire `[t30]`. The loop repeats while each respin keeps producing a win.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Shift per respin (normal) | stack moves **down 1 position** | `[t11]`,`[t30]` |
| Multiplier increment | **+1× per position moved down**, applied to every visible cell | `[t11]`,`[t30]` |
| Golden-rim off-screen rule | when the golden-rim wild is on the bottom row and would exit at the next respin, the shift is a **random integer 2–10 positions** (inclusive) instead of 1 | `[t11]` |
| Respin end condition | a respin that produces **no win** | `[t31]` |
| Line-win multiplication | winning line crossing a stacked reel × that cell's multiplier | `[t29]`,`[t39]` |
| Retrigger | yes — the loop self-chains indefinitely while wins continue | spec |

## Algorithm
1. After a winning spin/respin containing a Multiplier Wild reel, pay the win (with multipliers applied — step 6).
2. **Shift:** determine `N`:
   - If the golden-rim wild is on the bottom row (row 3) → `N = randInt(2,10)` (seeded RNG, see [[event-order-and-determinism]]).
   - Else → `N = 1`.
3. Move the whole stack **down `N` rows**; cells pushed below row 3 leave the screen. Reveal `N` new Multiplier Wild cells on top.
4. **Increment:** add `+N` to every remaining and newly revealed cell's multiplier (equivalently, the whole ladder rises by `N`). Example: `[2,3,4,5]` bottom→top with `N=1` → `[3,4,5,6]` (`[t29]`→`[t30]`).
5. Re-spin the non-stacked reels; keep stacked reel(s) fixed except for the shift.
6. **Evaluate:** for each winning payline, compute base line pay from [[math-and-rtp]]; if the line passes through a stacked reel, multiply the line pay by that reel-cell's multiplier at the line's row. If it passes through multiple stacked reels, multiply the applicable cell multipliers together `[ASSUMPTION]`. Sum all line pays into the respin win.
7. If this respin produced a win → go to step 1 (chain continues). Else → end the respin loop (`[t31]`).
8. At any point, if the running round total reaches the cap, invoke [[max_win_cap-mechanics]].

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Within respin: `N` (shift amount), `stackMultipliers[reel][row]`, `goldenRimRow[reel]`, `respinWin`.
- Across the chain: `roundRunningTotal`, `respinCount`, `highestMultiplierReached` (feeds [[free_spins-mechanics]]).

## Interactions
- **[[multiplier_wild_stack-mechanics]]:** provides the stack and starting ladder.
- **Math / [[math-and-rtp]]:** line pays are the base; multipliers scale them.
- **[[free_spins-mechanics]]:** respins occur inside free spins too; the highest multiplier reached persists to seed later stacks.
- **[[max_win_cap-mechanics]]:** a runaway chain is clamped at 10,000× bet.
- Presentation: the WILD MULTIPLIER badge updates live and the counter rolls up during the chain (`[t57]`,`[t61]`) — see [[presentation-and-feel]].

## Edge cases
- Respin producing **no win** ends the chain, keeping the last paid total (`[t31]`).
- Golden-rim reaching the bottom → random 2–10 shift, jumping multipliers by that amount (a single respin can add +10× to the ladder).
- If the shift pushes the entire prior stack off-screen and reveals a full fresh stack of new wilds, all are incremented consistently.
- Multiple stacked reels each shift independently but simultaneously per respin `[ASSUMPTION]`.
- Cap during chain: the round ends immediately, remaining respins forfeited (see [[max_win_cap-mechanics]]).

## QA checklist
- [ ] A winning spin with a Multiplier Wild reel triggers exactly one auto-respin per win; a no-win spin with a stack does not respin.
- [ ] After a normal shift, every visible multiplier is exactly the pre-shift value +1.
- [ ] When the golden-rim is on the bottom row, the shift is an integer in [2,10] drawn from the seeded RNG, and every multiplier rises by that same amount.
- [ ] A respin that yields no win terminates the chain and preserves the accumulated total.

## References
- Paytable page 2 `[t11]`; live play `[t29]`,`[t30]`,`[t31]`,`[t39]`,`[t57]`,`[t61]`.