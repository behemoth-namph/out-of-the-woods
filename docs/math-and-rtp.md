# Math & RTP — Out of the Woods

## RTP
| Mode | RTP | Provenance |
|---|---|---|
| Base | **96.52% — estimated (confidence: 0.50, sources: 4)** | read from in-game paytable page 4 [t10]; corroborated by market research |
| Ante Bet / Super Spin | **96.50% — estimated (confidence: 0.50, sources: 4)** | [t10] |
| Buy Free Spins | **96.50% — estimated (confidence: 0.50, sources: 4)** | [t10] |
| Buy Super Free Spins | **96.49% — estimated (confidence: 0.50, sources: 4)** | [t10] |
| Operator-certified alternates | **95.46% / 94.53% — estimated (confidence: 0.50, sources: market research only)** | not observed in-game |

## How RTP Is Achieved
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
RTP is delivered by proprietary **reel-strip weights / symbol frequencies**, which are **not disclosed anywhere in the evidence and are `not-derivable` (confidence: 0.05)**. No weight table can be stated. Implementation must tune undisclosed reel strips so that the payline paytable below, plus the multiplier-wild respin and free-spins features, integrate to the target 96.52% base. Weights are therefore **estimated-by-fitting**, not given.

Structural RTP drivers that ARE known:
- 25 fixed paylines, left-to-right 3+ from reel 1.
- Multiplier Wild respin ladder (climbing per-line multipliers) — the main volatility/RTP engine.
- Free spins (10/15/20) with multiplier carryover.
- 10,000× win cap truncating the extreme tail.

## Full Paytable
> **All values are `estimated` (confidence: 0.65, sources: market-research paytable) — not confirmed against in-game paytable images.** Unit = **× total bet**, bands [3, 4, 5].

| Symbol | 3× | 4× | 5× |
|---|---|---|---|
| `wild-multiplier` | 1.6 | 4.8 | 24.0 |
| `bunny` | 1.6 | 4.8 | 24.0 |
| `blue-girl` | 1.2 | 3.6 | 18.0 |
| `bear` | 0.8 | 2.4 | 12.0 |
| `deer` | 0.4 | 1.2 | 6.0 |
| `A` | 0.24 | 0.72 | 3.6 |
| `K` | 0.2 | 0.6 | 3.0 |
| `Q` | 0.16 | 0.48 | 2.4 |
| `J` | 0.12 | 0.36 | 1.8 |
| `10` | 0.08 | 0.24 | 1.2 |
| `scatter` | — (no line pay; triggers free spins) | | |

Line-win formula: `linePay = paytable[symbol][count-3] × totalBet × wildMultiplier(line)` where `wildMultiplier(line)` is the stack-cell multiplier the line crosses, else 1. Spin win = sum over winning lines.

## Volatility, Max Win, Hit Frequency
| Metric | Value |
|---|---|
| Volatility | **medium — estimated (confidence: 0.90, sources: 2)** (in-game 3-bolt indicator; some sources call it "high-stakes") |
| Max win | **10,000× total bet — estimated (confidence: 0.60, sources: 4)** (never approached in play) |
| Hit frequency | **21.69% — estimated (confidence: 0.50, sources: 1)** (SlotCatalog-style metric; not observable in a ~250-spin session) |
| Bet range | $0.25 – $2,500 (observed, paytable page 4 [t10]) |

## Derivability / Provenance Note
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
| Figure | Status |
|---|---|
| grid rows/cols, payline count (25) | **derivable** (observed, high confidence) |
| paytable pay values | estimated (0.65) — market research, not confirmed in-game |
| baseRTP & variants | estimated (0.50) — read in-game but never claimed certain |
| maxWinX | estimated (0.60) |
| volatility | estimated (0.90) |
| hitFrequency | estimated (0.50) — single source |
| symbol identities/tiers | estimated (0.90) — `blue-girl` tier inferred |
| reel weights / frequencies | **not-derivable** (0.05) — never disclosed |

## References
- game-brief.md; in-game paytable pages 2–4 [t07]–[t10]
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.igamingtoday.com/out-of-the-woods-slot-review/
- https://clashofslots.com/slots/pragmatic-play/out-of-the-woods/
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
<<<END-OF-FILE>>>