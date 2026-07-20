# Feature — Buy Feature (`buy_feature`)

## Trigger
Player opens the "BUY FEATURE — 2 OPTIONS" panel (`[t07]`, opened `[t70]`) and purchases direct feature entry. Two options.

## Parameters
| Option | Cost | Entry | First stack ladder |
|---|---|---|---|
| Buy Free Spins | **100× current total bet** | standard Free Spins | 1×/2×/3×/4× |
| Buy Super Free Spins | **500× current total bet** | Super Free Spins | **10×/11×/12×/13×** bottom-to-top |

Source: paytable page 3 `[t13]`. At $2.00 total bet: Buy FS = **$200.00**, Buy Super FS = **$1,000.00**.

## Algorithm
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. On purchase, compute `cost = totalBet × (100 or 500)`.
2. Balance guard: reject if `balance < cost`.
3. Deduct `cost`, then enter [[free_spins-mechanics]] directly (skip base scatter trigger).
4. If Super FS: set the first Multiplier Wild stack ladder to `[10,11,12,13]` and flag `superFreeSpins = true`.
5. Run the feature; apply [[max_win_cap-mechanics]].

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `buyType ∈ {fs, superFs}`, `cost`, `superFreeSpins` flag → feeds [[free_spins-mechanics]] and [[multiplier_wild_stack-mechanics]].

## Interactions
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **[[free_spins-mechanics]]:** buy enters this feature directly.
- **[[multiplier_wild_stack-mechanics]]:** Super FS sets the elevated starting ladder.
- **[[ante_bet-mechanics]]:** buy cost scales with the current total bet, which the special-bet mode changes.
- **[[max_win_cap-mechanics]]:** bought features are capped at 10,000× bet like any feature.

## Edge cases
- `totalBet` for cost = the currently selected total bet at time of purchase (`[t13]`: "current total bet").
- **A Rebuy Free Spins offer IS presented** after a Free Spins round completes: the left control panel gains a "REBUY FREE SPINS $200.00" button (same cost as a standard Buy Free Spins purchase at the $2.00 base bet), visible in multiple post-feature screenshots (`ante-panel.webp`, `buy-feature-panel.webp`, `16-huge-win-556.webp`).
- Buying while a special bet is active multiplies the buy cost by the elevated stake.
## QA checklist
- [ ] Buy FS deducts exactly 100× the current total bet; Buy Super FS deducts 500×.
- [ ] Super FS first stack ladder is `[10,11,12,13]` bottom-to-top.
- [ ] A buy is rejected when balance < cost, with no state change.

## References
- Paytable page 3 `[t13]`; buy panel `[t07]`,`[t70]`.