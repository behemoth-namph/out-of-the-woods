# Free Spins — Mechanics

## Trigger
**3, 4, or 5 `scatter` symbols anywhere** on the board (not payline-restricted).
| Scatters | Free spins awarded |
|---|---|
| 3 | 10 |
| 4 | 15 |
| 5 | 20 |

Source: paytable page 2 [t08]; buy of standard Free Spins awarded exactly 10 [t50]. (Natural trigger never occurred in ~150+ base spins; max 2 scatters seen in a single base spin — anomaly noted.)

## Parameters
| Constant | Value | Source |
|---|---|---|
| Award 3 / 4 / 5 scatters | 10 / 15 / 20 spins | [t08] |
| Retrigger | Yes — same 3/4/5→10/15/20 spins added mid-feature | [t08] |
| Multiplier carryover | Highest multiplier reached is **stored**; next stack starts at that stored top value (not reset to 4×) | [t08], [t52]–[t56] |
| Special reels | Feature uses dedicated free-spins reels | [t08] |
| Standard buy award | 10 free spins | [t50] |
| Super buy start multiplier | First stack starts at **10×–13×** | [t46], [t09] |
| Win cap | 10,000× total bet — estimated (confidence: 0.60, sources: 4) | [t09] |

## Algorithm
```
1. On scatter_check, count scatters C on the settled board.
2. If C >= 3: award spins = {3:10, 4:15, 5:20}[C]; enter free-spins mode.
3. Initialize storedTopMultiplier:
     standard buy / natural  → unset (first stack uses 1..4 default)
     super buy               → 10..13   [ASSUMPTION: exact per-spin value within 10-13 not specified]
4. For each free spin:
     a. Fill board from special free-spins reels.
     b. If a wild stack lands: initialize its top multiplier to max(4, storedTopMultiplier).
     c. Run the multiplier-wild respin loop (see [[multiplier-wild-respin-mechanics]]).
     d. Update storedTopMultiplier = max(storedTopMultiplier, highest multiplier reached this spin).
     e. If C' >= 3 scatters this spin → retrigger: spinsRemaining += {3:10,4:15,5:20}[C'].
     f. spinsRemaining -= 1.
5. When spinsRemaining == 0: present FREE SPINS COMPLETED with total feature win. Clamp to cap.
```

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Feature-level: `spinsRemaining`, `featureWin` (cumulative), `storedTopMultiplier`, `mode` (standard | super).
- Per-spin: everything in [[multiplier-wild-respin-mechanics]] State.

## Interactions
- **[[multiplier-wild-respin-mechanics]]:** the respin engine runs unchanged inside free spins, but stacks inherit `storedTopMultiplier` (observed 5×→6×→7×→10× persisting across spins).
- **[[buy-feature-mechanics]]:** standard buy enters with 10 spins; super buy enters with elevated 10×–13× start.
- **[[super-spin-mechanics]]:** Super Spin mode **disables** this feature entirely.
- **[[ante-bet-mechanics]]:** Ante Bet raises the natural trigger frequency **12×** (verbatim in-game: "12 times higher", not a 12–13× range).
## Edge cases
- **Retrigger:** adds spins using the same 3/4/5 table; multiplier continues climbing (does not reset).
- **Carryover floor:** a new stack never starts below the stored top value.
- **Win cap:** feature total clamped to 10,000× total bet.
- **Super Spin conflict:** free spins cannot be entered while Super Spin bet mode is active.
- **0 scatters remaining board:** no retrigger; feature runs down normally.

## QA checklist
1. Exactly 3 scatters → 10 free spins; 4 → 15; 5 → 20.
2. Multiplier reached 10× on spin K starts spin K+1's stack at ≥10× (carryover), not 4×.
3. Super Free Spins buy starts the first stack within 10×–13×.
4. A mid-feature 3-scatter retrigger adds exactly 10 spins to the remaining counter.

## References
- game-brief.md; paytable pages 2–3 [t07]–[t09]; PLAYER LOG [t46], [t50]–[t56]
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
- https://slotcatalog.com/en/slots/out-of-the-woods
<<<END-OF-FILE>>>