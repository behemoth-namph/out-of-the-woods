# Feature — Special Bets / Ante Bet (`ante_bet`)

## Trigger
Player selects a **Special Bet** from the "SPECIAL BETS — 2 OPTIONS" panel before spinning (`[t07]`). Three bet modes exist; the selection changes cost and behavior.

## Parameters
| Mode | Bet multiplier (× line unit) | Cost vs Normal | Effect | FS can trigger? |
|---|---|---|---|---|
| Normal play | **25×** | 1× (base) | standard rules | yes |
| Ante Bet | **125×** | **5×** normal | FS trigger chance **12× higher** | yes |
| Super Spin | **250×** | **10×** normal | **one Multiplier Wild stack guaranteed every spin** | **no** |

Source: paytable page 3 `[t13]`. At an observed $2.00 normal stake: Ante ≈ $10.00, Super Spin ≈ $20.00 `[ASSUMPTION — derived from the multiplier ratios, not directly observed]`.

## Algorithm
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. Read selected mode. Compute the total stake: `stake = lineUnit × modeMultiplier` (25 / 125 / 250).
2. Deduct `stake` at spin start.
3. If mode == Ante Bet: apply a 12× weighting to the scatter/free-spins trigger path `[ASSUMPTION on implementation — spec states only "12 times higher chance"; weights not derivable]`.
4. If mode == Super Spin: force exactly one guaranteed Multiplier Wild stack each spin (see [[multiplier_wild_stack-mechanics]]) and **disable** the Free Spins trigger for the duration.
5. Otherwise Normal: standard evaluation.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `betMode ∈ {normal, ante, superSpin}`, `lineUnit`, `stake`.
- `freeSpinsDisabled = (betMode == superSpin)`.

## Interactions
- **[[free_spins-mechanics]]:** Ante raises trigger chance 12×; Super Spin disables it.
- **[[multiplier_wild_stack-mechanics]]:** Super Spin guarantees a stack per spin.
- **[[buy_feature-mechanics]]:** buy costs are `100×`/`500×` of the **current total bet**, so pairing a buy with an elevated special bet scales the buy cost accordingly.
- **[[math-and-rtp]]:** the in-game paytable (page 4/7) states the RTP under each special bet directly: Ante Bet 96.50%, Super Spin 96.50% — not the previously assumed 95.46%/94.53% figures.
## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Switching mode is only allowed between rounds, not mid-feature `[ASSUMPTION]`.
- Super Spin + any scatter count never triggers Free Spins (guard must hard-block).
- Balance guard: reject the spin if `balance < stake`.

## QA checklist
- [ ] Normal/Ante/Super Spin deduct exactly 25×/125×/250× the line unit.
- [ ] Under Super Spin, every spin lands at least one full Multiplier Wild stack, and 3+ scatters never start Free Spins.
- [ ] Under Ante Bet, the free-spins trigger weighting is 12× the Normal path.

## References
- Paytable page 3 `[t13]`; UI panel `[t07]`; alt-RTP set in [[math-and-rtp]].