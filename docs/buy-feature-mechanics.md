# Buy Feature — Mechanics

## Trigger
Player opens the **Buy Feature** panel (2 options) and purchases directly. Observed live [t45]–[t50].

## Parameters
| Option | Cost | Award | Source |
|---|---|---|---|
| Free Spins (standard) | **100× total bet** = $200.00 on $2.00 bet | 10 free spins, stacks start at default 4× top | Buy modal + confirm [t46]–[t50] |
| Super Free Spins | **500× total bet** = $1,000.00 on $2.00 bet | Free spins with **first stack starting at 10×–13×** | Buy modal [t46] |
| Rebuy Free Spins | 100× total bet ($200.00) — offered after a feature ends | Same as standard | [t56] |

RTP: Buy Free Spins 96.50% — estimated (confidence: 0.50, sources: 4); Buy Super Free Spins 96.49% — estimated (confidence: 0.50, sources: 4) [t10].

## Algorithm
```
1. Player selects an option in the Buy Feature panel.
2. Show CONFIRM dialog with exact price = costMultiplier * totalBet.
3. On YES: deduct price from balance (verified $200.00 exactly on $2.00 bet [t49]).
4. Enter free-spins mode directly (bypasses scatter trigger):
     standard      → 10 spins, storedTopMultiplier default (first stack 1..4)
     super         → 10 spins, storedTopMultiplier = 10..13 for the first stack
5. Run the free-spins feature (see [[free-spins-mechanics]]).
6. On completion, offer Rebuy at 100x.
```

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `buyMode ∈ {standard, super}`, `buyCost = multiplier * totalBet`, then hands off to [[free-spins-mechanics]] state.

## Interactions
- **[[free-spins-mechanics]]:** buy is an alternate entry into the same feature; standard = 10 spins.
- **[[multiplier-wild-respin-mechanics]]:** super buy seeds the first stack at 10×–13×.
- **[[super-spin-mechanics]] / [[ante-bet-mechanics]]:** buying free spins is independent of Special Bets.

## Edge cases
- Confirm dialog required before deduction; CANCEL aborts with no charge.
- Balance must cover cost (demo balance ample; real-money guard [ASSUMPTION]).
- Win cap 10,000× applies to the purchased feature total.
- Standard buy awards the 3-scatter baseline (10 spins), never 15/20.

## QA checklist
1. Buy Free Spins deducts exactly 100 × total bet ($200.00 on $2.00) and awards 10 spins.
2. Buy Super Free Spins deducts exactly 500 × total bet ($1,000.00 on $2.00) and starts the first stack in 10×–13×.
3. Cancelling the confirm dialog leaves the balance unchanged.

## References
- game-brief.md; Buy modal [t46]; confirm+deduct [t48]–[t50]; paytable [t09]–[t10]
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
<<<END-OF-FILE>>>