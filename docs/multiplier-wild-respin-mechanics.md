# Multiplier Wild Respin — Mechanics

## Trigger
A respin is awarded whenever **both** hold after reels settle:
1. At least **one winning payline** exists on the board (3+ matching left-to-right from reel 1), AND
2. A **full-reel Multiplier Wild stack** is present on the board.

The respin loop repeats: each respin re-evaluates; while a win still occurs with the stack present, another respin is granted. The loop ends on the first respin that produces **no win** (`no_more_wins`). (Splash: "INCREASING WILD MULTIPLIER WITH EACH WINNING RESPIN" [t03]; observed climbing stacks [t26→t28→t29].)

## Parameters
| Constant | Value | Source |
|---|---|---|
| Stack shape | Full reel = 4 wild cells (one per row) | grid 4 rows [t26] |
| Initial multipliers (bottom→top) | 1× / 2× / 3× / 4× | paytable page 2 [t08] |
| Normal shift per respin | +1 to every visible multiplier | spec behavior; [t42] start config |
| Gold-rim jump | Random integer **N ∈ [2,10]**, added to every multiplier, triggered when a **gold-rimmed** wild occupies the **bottom row** | paytable page 2 [t08]; observed +3 jump [t28] |
| Multiplier application | **Per line** — each winning line uses the multiplier of the stack cell it passes through | observed "$0.80 × 5 = $4.00" [t54] |
| Wild substitution | Substitutes for all symbols **except** `scatter` | paytable [t07] |
| Wild line pay | `wild-multiplier` pays 1.6/4.8/24.0 (×bet) at 3/4/5 — estimated, see [[math-and-rtp]] | spec |
| Win cap | 10,000× total bet — estimated (confidence: 0.60, sources: 4) | [t09] |

## Algorithm
```
1. Land reels. Detect any reel that is entirely wild-multiplier → mark as STACK reel(s).
   Assign that reel's multipliers bottom→top = 1,2,3,4 on first appearance.
2. Evaluate the 25 paylines (see [[math-and-rtp]] for pay + [[event-order-and-determinism]] for order):
   for each line L with a 3+ left-to-right win of symbol S:
     basePay = paytable[S][count-3] * totalBet
     if L passes through a stack cell at row r:
         mult = multiplier(stackReel, r)     // that cell's value
     else:
         mult = 1
     linePay = basePay * mult
   spinWin = sum(linePay over all winning lines)
3. If spinWin > 0 AND a stack reel is present:
     award a RESPIN:
       a. Determine shift N:
            if a gold-rimmed wild is on the bottom row → N = randInt(2,10)   [1 RNG draw]
            else → N = 1
       b. For every visible multiplier on every stack reel: value += N
          (Stack visually shifts down; bottom cells may exit off-screen, shrinking the stack.) [ASSUMPTION: exact off-screen/shrink bookkeeping]
       c. Hold the stack reel(s); respin all OTHER reels (injected fill). [ASSUMPTION: held-reel model]
       d. Go to step 2.
   Else:
     emit no_more_wins; the respin chain ends; proceed to scatter_check/round end.
4. Clamp cumulative round win to 10,000 × totalBet.
```

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Within a spin: `stackReels[]`, per-cell `multiplier[reel][row]`, `spinWin`, `winningLines[]`.
- Within the respin chain: `chainWin` (cumulative), `shiftN`, `goldRimBottom` flag, `respinIndex`.
- Across the feature (free spins only): `storedTopMultiplier` — highest multiplier reached, carried into the next free spin (see [[free-spins-mechanics]]).

## Interactions
- **Grid / math:** multiplier is applied **per intersecting line**, never as one flat total multiplier (observed: Line 3 crossing the 5× row multiplied only that line by 5 [t54]). See [[math-and-rtp]].
- **[[free-spins-mechanics]]:** the highest multiplier reached persists; subsequent free-spin stacks start at the stored top value instead of resetting to 4×.
- **[[super-spin-mechanics]]:** Super Spin guarantees a stack every base spin (but disables free spins).
- **[[buy-feature-mechanics]]:** Super Free Spins buy starts the first stack at 10×–13×.

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Retrigger of respin:** each respin that still wins grants another respin — no fixed cap other than the win cap. [ASSUMPTION: no hard respin-count cap stated]
- **Win cap:** cumulative round win is clamped to 10,000× total bet.
- **Empty/no-win board with stack:** if a stack is present but no line wins, no respin is granted (loop ends).
- **Multiple stack reels on one line:** if a line crosses two wild cells, multipliers multiply together. [ASSUMPTION]
- **Gold-rim only at bottom:** the random 2–10 jump fires only when the gold-rimmed wild is on the bottom row.

## QA checklist
1. Board with `deer,deer,W` on reel 3 (row-1 wild = 4×) → line pays `0.4 × bet × 4`; a no-win respin ends the chain.
2. Two consecutive winning respins increase every stack multiplier by exactly +1 each (no gold rim).
3. A gold-rimmed wild landing on the bottom row raises every multiplier by a value in [2,10] (never 1, never >10).
4. A line NOT crossing the stack pays base × 1 while a same-symbol line crossing a 5× cell pays base × 5 in the same evaluation.
5. Cumulative round win never exceeds 10,000 × total bet after clamping.

## References
- game-brief.md; paytable pages 2–3 (in-game, [t07]–[t09]); PLAYER LOG [t26], [t28], [t29], [t42], [t54]
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
<<<END-OF-FILE>>>