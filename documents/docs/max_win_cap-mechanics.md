# Feature — Max Win Cap (`max_win_cap`)

## Trigger
The running total of a feature (or round) reaches **10,000× bet**.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Max win | **10,000× bet** (hard cap) | paytable page 3 `[t13]`; splash "WIN UP TO 10,000 X BET" `[t05]` |
| Derivability | **derivable** (confidence 0.9) | provenance |

## Algorithm
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. After every win award (base line win, respin chain step, or free-spin award), compute `roundTotal` in × bet.
2. If `roundTotal ≥ 10000`:
   a. Clamp `roundTotal = 10000`.
   b. End the round immediately.
   c. Award the (clamped) win.
   d. Forfeit all remaining features/respins/free spins.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- `roundTotal` (× bet), `capReached` flag.

## Interactions
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **[[wild_respin-mechanics]]:** a runaway respin chain is the most likely path to the cap; check after each respin.
- **[[free_spins-mechanics]]:** remaining free spins are forfeited on cap.
- **[[math-and-rtp]]:** `maxWinX = 10000`.

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- A single award that would push the total past 10,000× is clamped exactly to 10,000× (not the raw computed value).
- Cap check must occur **before** presenting the next respin, so no further draws happen after the cap.
- Cap during free spins forfeits both remaining spins and any active retrigger.

## QA checklist
- [ ] A computed round total of 10,001× is awarded as exactly 10,000× bet.
- [ ] On cap, no further respin/free-spin events are emitted.
- [ ] The cap is evaluated in × bet, correctly scaled for any stake.

## References
- Paytable page 3 `[t13]`; splash `[t05]`.