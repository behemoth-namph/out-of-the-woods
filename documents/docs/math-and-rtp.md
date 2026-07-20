# Math & RTP — Out of the Woods

## Headline Figures
| Metric | Value | Notes |
|---|---|---|
| Base RTP | **96.52%** | confirmed verbatim on in-game paytable page 4/7: "The theoretical RTP of this game is 96.52%" |
| RTP — Ante Bet | **96.50%** | in-game paytable page 4/7 |
| RTP — Super Spin | **96.50%** | in-game paytable page 4/7 |
| RTP — Buy Free Spins | **96.50%** | in-game paytable page 4/7 |
| RTP — Buy Super Free Spins | **96.49%** | in-game paytable page 4/7 |
| Volatility | **Medium** (4/5 lightning-bolt meter) | screenshot-confirmed, paytable page 4/7 |
| Max win | **10,000× bet** | screenshot-confirmed, paytable page 3/7 |
| Min / Max bet | **$0.25 / $2,500.00** | screenshot-confirmed, paytable page 4/7 |
| Hit frequency | **21.69% — estimated (confidence: 0.5, sources: 2)** | market research only; not shown in-game |
| Paylines | 25 fixed | see ## Paylines |
## How the RTP Is Achieved
The base RTP of **96.52%** is confirmed verbatim on the in-game paytable (page 4/7). The same screen also states the RTP under each special-bet / purchase mode directly: Ante Bet 96.50%, Super Spin 96.50%, Buy Free Spins 96.50%, Buy Super Free Spins 96.49% — superseding the earlier research-sourced 95.46%/94.53% estimate. The RTP is delivered through:
- 25 fixed left-to-right paylines paying 3+ of a kind.
- The Multiplier Wild stack + auto-respin loop ([[wild_respin-mechanics]]) supplying the bulk of variance and top-end.
- Free Spins with persistent/accumulating multipliers ([[free_spins-mechanics]]).
- Special-bet modes ([[ante_bet-mechanics]]) trading stake for trigger frequency / guaranteed stacks — each with its own near-identical RTP per the paytable.

**Symbol weights / reel-strip distribution are NOT available** (not derivable, proprietary). Any implementation must tune reel strips to hit the target RTP; the paytable below is fixed but the strip weights are an operator/codegen tuning surface.
## Full Paytable
| Symbol | 3 | 4 | 5 |
| --- | --- | --- | --- |
| rabbit_man | 1.6 | 4.8 | 24 |
| blue_woman | 1.2 | 3.6 | 18 |
| bear_man | 0.8 | 2.4 | 12 |
| deer_girl | 0.4 | 1.2 | 6 |
| ace | 0.24 | 0.72 | 3.6 |
| king | 0.2 | 0.6 | 3 |
| queen | 0.16 | 0.48 | 2.4 |
| jack | 0.12 | 0.36 | 1.8 |
| ten | 0.08 | 0.24 | 1.2 |
| wild | 1.6 | 4.8 | 24 |

_Confirmed against in-game paytable screenshots (paytable-*.png)._
## Paylines
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
`spec.math.paylines` geometry is **not-derivable** — the 25-line diagram was too small to transcribe even after zoom attempts (`[t18]`,`[t21]`). Confirmed facts: **paylineCount = 25**, fixed, left-to-right on adjacent reels from reel 1.

Because a developer needs concrete line geometry, the table below is the **standard Pragmatic Play 25-line layout** given as `[ASSUMPTION]` (rows indexed 0=top … 3=bottom; one value per reel R1…R5). **Verify against the real client before shipping — geometry is not confirmed.**

| line | R1 | R2 | R3 | R4 | R5 | line | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 14 | 1 | 0 | 1 | 0 | 1 |
| 2 | 0 | 0 | 0 | 0 | 0 | 15 | 2 | 3 | 2 | 3 | 2 |
| 3 | 2 | 2 | 2 | 2 | 2 | 16 | 0 | 1 | 0 | 1 | 0 |
| 4 | 3 | 3 | 3 | 3 | 3 | 17 | 3 | 2 | 3 | 2 | 3 |
| 5 | 0 | 1 | 2 | 1 | 0 | 18 | 1 | 2 | 1 | 0 | 1 |
| 6 | 3 | 2 | 1 | 2 | 3 | 19 | 2 | 1 | 2 | 3 | 2 |
| 7 | 1 | 2 | 3 | 2 | 1 | 20 | 0 | 1 | 1 | 1 | 0 |
| 8 | 2 | 1 | 0 | 1 | 2 | 21 | 3 | 2 | 2 | 2 | 3 |
| 9 | 0 | 0 | 1 | 0 | 0 | 22 | 1 | 0 | 0 | 0 | 1 |
| 10 | 3 | 3 | 2 | 3 | 3 | 23 | 2 | 3 | 3 | 3 | 2 |
| 11 | 1 | 1 | 0 | 1 | 1 | 24 | 0 | 1 | 2 | 3 | 3 |
| 12 | 2 | 2 | 3 | 2 | 2 | 25 | 3 | 2 | 1 | 0 | 0 |
| 13 | 0 | 1 | 2 | 3 | 3 | | | | | | |

`[ASSUMPTION]` — the entire geometry table above is an assumed conventional layout, not the transcribed in-game diagram.

## Provenance / Derivability
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Derivable:** max win (10,000×), volatility (Medium), grid (4×5), paylineCount (25).
- **Estimated:** base RTP + alt RTPs (research consensus), symbol pays (demo screen read), hit frequency (research only).
- **Not-derivable:** individual payline geometry, reel-strip weights.

## References
- `game-brief.md`; demo game — https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs25bstackwild
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
- https://www.casinos.com/slots/out-of-the-woods
- https://www.igamingtoday.com/out-of-the-woods-slot-review/
- Live play `[t09]`,`[t18]`,`[t21]`.