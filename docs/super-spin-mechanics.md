# Super Spin — Mechanics

## Trigger
Player-selected bet mode via the **Special Bets** panel. Documented from paytable text only — panel never opened during play [t09]. `[OBSERVED: panel present but not exercised]`

## Parameters
| Constant | Value | Source |
|---|---|---|
| Super Spin multiplier | **250×** | paytable page 3 [t09] |
| Guarantee | A Multiplier Wild **stack on every spin** | [t09] |
| Restriction | **Disables the free-spins trigger** | [t09] |
| RTP under Super Spin | 96.50% — estimated (confidence: 0.50, sources: 4) | [t10] |

## Algorithm
```
1. Player selects Super Spin in Special Bets panel.
2. Bet mode multiplier becomes 250x; per-spin cost adjusts accordingly.
3. Every spin is guaranteed to land at least one full-reel wild-multiplier stack.
4. Scatter free-spins trigger is suppressed (scatters cannot start the free-spins feature).
5. Multiplier-wild respin loop otherwise runs normally (see [[multiplier-wild-respin-mechanics]]).
```

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `betMode = 'super-spin'`, `betMultiplier = 250`, `freeSpinsEnabled = false`.

## Interactions
- **[[multiplier-wild-respin-mechanics]]:** guarantees the stack that drives the respin engine.
- **[[free-spins-mechanics]]:** disabled while Super Spin is active.
- **[[ante-bet-mechanics]]:** mutually exclusive.

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Free spins can never trigger in this mode even with 3+ scatters on screen. [ASSUMPTION: scatters simply do not award; exact on-screen behavior unobserved]
- Mutually exclusive with Ante Bet and normal play.
- Win cap 10,000× still applies.

## QA checklist
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. Every Super Spin lands ≥1 full-reel wild stack.
2. 3+ scatters during Super Spin award **0** free spins.
3. Super Spin cannot be active simultaneously with Ante Bet.

## References
- game-brief.md; paytable pages 3–4 [t09]–[t10]
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
<<<END-OF-FILE>>>