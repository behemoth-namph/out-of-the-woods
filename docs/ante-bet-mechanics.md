# Ante Bet — Mechanics

## Trigger
Player-selected bet mode via the **Special Bets** panel (2 options). Ante Bet is one of them; the panel was visible throughout play but **never opened** — this doc is authored from paytable text only [t09]. `[OBSERVED: panel present but not exercised]`

## Parameters
| Constant | Value | Source |
|---|---|---|
| Ante Bet multiplier | **125×** | in-game paytable page 3 |
| Normal-play multiplier | 25× (verbatim "Bet multiplier 25x - Normal play") | in-game paytable page 3 |
| Effect | Free-spins trigger chance **12× higher** — verbatim in-game text: "The chance to trigger the FREE SPINS feature is 12 times higher" (not a 12–13× range) | in-game paytable page 3 |
| RTP under Ante Bet | 96.50% (confirmed on in-game paytable page 4) | in-game paytable page 4 |
## Algorithm
```
1. Player selects Ante Bet in Special Bets panel.
2. Bet mode multiplier becomes 125x; per-spin cost adjusts accordingly.
3. Spins use a modified reel/scatter distribution raising the free-spins trigger frequency by 12x (verbatim in-game: "12 times higher").
   [ASSUMPTION: exact distribution mechanism not disclosed; weights not-derivable]
4. All other rules (paylines, wild respin) unchanged.
```
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `betMode = 'ante'`, `betMultiplier = 125`.

## Interactions
- **[[free-spins-mechanics]]:** increases natural free-spins trigger frequency; free spins still function normally.
- **[[super-spin-mechanics]]:** mutually exclusive bet modes — only one Special Bet may be active.
- **[[math-and-rtp]]:** RTP under Ante Bet is 96.50% — estimated (confidence: 0.50, sources: 4).

## Edge cases
- Mutually exclusive with Super Spin.
- Does not disable free spins (unlike Super Spin).
- In-game "25x/125x" label inconsistency documented verbatim, not corrected.

## QA checklist
1. Selecting Ante Bet sets the bet multiplier to 125× and cannot coexist with Super Spin.
2. Free-spins trigger rate under Ante Bet is 12× normal play (verbatim in-game: "The chance to trigger the FREE SPINS feature is 12 times higher" — a single fixed figure, not a 12–13× range).
3. Deselecting Ante returns to the 25× normal-play multiplier.
## References
- game-brief.md; paytable pages 3–4 [t09]–[t10]
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
<<<END-OF-FILE>>>