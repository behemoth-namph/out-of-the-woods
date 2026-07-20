# Feature — Free Spins (`free_spins`)

## Trigger
Land **3, 4 or 5 Scatter symbols anywhere** on the visible grid in a single spin.

| Scatters | Free spins awarded |
|---|---|
| 3 | 10 |
| 4 | 15 |
| 5 | 20 |

Source: paytable page 2 `[t11]`. The feature **did trigger live** during this session: a scatter hit awarded 10 Free Spins ("CONGRATULATIONS YOU HAVE WON 10 FREE SPINS"), and the round completed for a total of $138.40 with the Wild Multiplier stack reaching 11× by the final spin.
## Parameters
| Constant | Value | Source |
|---|---|---|
| Award 3 / 4 / 5 scatters | 10 / 15 / 20 free spins | `[t11]` |
| Retrigger (during feature) | 3/4/5 scatters award 10/15/20 **additional** free spins | `[t11]` |
| Retrigger cap | none stated `[ASSUMPTION]` unlimited (bounded by win cap) | `[t11]` |
| First stack ladder | 1×/2×/3×/4× bottom-to-top | `[t11]` |
| Subsequent stacks | start from the **highest multiplier reached earlier in the round**, placed at the top of the new stack | `[t11]` |
| Reels | special reels in play during the feature | `[t11]` |
| Bought Super FS first stack | 10×/11×/12×/13× | `[t13]` |

## Algorithm
1. On base-spin evaluation, count Scatters. If ≥3, award `10/15/20` free spins per the table, then enter the feature.
2. Switch to **special reels** for the feature duration.
3. Initialize `highestMultiplierReached = 0`.
4. For each free spin:
   a. Spin the special reels.
   b. If a Multiplier Wild stack lands: if it is the **first** stack of the round, ladder = `[1,2,3,4]` (or `[10,11,12,13]` in bought Super FS); else the new stack's **top** cell = `highestMultiplierReached`, filling down by −1 per row `[ASSUMPTION on fill direction — paytable states "highest at the top of the stack"]`.
   c. Run [[wild_respin-mechanics]] respin chain; update `highestMultiplierReached = max(highestMultiplierReached, any multiplier that paid)`.
   d. Count Scatters this spin; if ≥3, retrigger (add 10/15/20 free spins).
   e. Decrement remaining free spins.
5. When free spins reach 0 (and no respin chain is active), end the feature and return the accumulated win to base game.
6. Apply [[max_win_cap-mechanics]] throughout.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Feature: `freeSpinsRemaining`, `highestMultiplierReached`, `featureTotalWin`, `specialReels=true`.
- Per spin: inherits [[multiplier_wild_stack-mechanics]] and [[wild_respin-mechanics]] state.

## Interactions
- **[[multiplier_wild_stack-mechanics]] / [[wild_respin-mechanics]]:** core payout engine inside the feature; multipliers persist across spins.
- **[[ante_bet-mechanics]]:** Ante Bet raises FS trigger chance 12×; Super Spin **disables** FS triggering entirely.
- **[[buy_feature-mechanics]]:** buys direct entry (FS or Super FS).
- **[[max_win_cap-mechanics]]:** caps the feature at 10,000× bet.

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Scatter count is per spin, not accumulated across spins (`[t33]` shows 2 scatters not banking toward a later spin).
- Retrigger during the feature adds spins; the persistent `highestMultiplierReached` is **not** reset on retrigger.
- Free spins that end mid-respin-chain: complete the active chain before ending the feature `[ASSUMPTION]`.
- Under Super Spin special bet, this feature can never start (see [[ante_bet-mechanics]]).

## QA checklist
- [ ] 3/4/5 scatters award exactly 10/15/20 free spins respectively.
- [ ] The first Multiplier Wild stack of a bought Super FS round is `[10,11,12,13]`; of a normal FS round is `[1,2,3,4]`.
- [ ] A subsequent stack in the same round starts with top-cell = highest multiplier previously reached (accumulation across spins).
- [ ] A retrigger adds the correct spin count without resetting the accumulated multiplier.

## References
- Paytable page 2 `[t11]`, page 3 `[t13]`; live play `[t28]`,`[t33]`.