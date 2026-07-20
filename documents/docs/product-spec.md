# Out of the Woods — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Out of the Woods |
| Provider | Pragmatic Play |
| Theme | Dark comedic woodland escape / survival-horror forest |
| gameId | `out-of-the-woods` |
| gameSymbol | `vs25bstackwild` |
| Source | text (market research + live demo play-through) |
| Captured | 2026-07-20 |

## Grid & Win Rule
| Field | Value |
|---|---|
| Grid type | fixed reels |
| Rows × Cols | **4 rows × 5 columns** |
| Paylines | 25 fixed |
| minCluster | N/A (line-pay game) |

**Win rule (one sentence):** A win pays when **3, 4 or 5 identical symbols land on one of the 25 fixed paylines on adjacent reels starting from the leftmost reel (reel 1), left-to-right**; only the highest-count combination per line pays, and the Wild substitutes for all symbols except the Scatter.

## Full Symbol Table
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
## Bet Model
| Field | Value |
|---|---|
| Observed bet | $2.00 total (`[t07]`) |
| Min / Max bet | **$0.25 / $2,500.00** (confirmed on in-game paytable page 4/7) |
| Base bet multiplier (Normal) | 25× line unit |
| Ante Bet cost | 125× line unit = **5× normal stake** ($10.00 at $2.00 base, confirmed in Special Bets panel) |
| Super Spin cost | 250× line unit = **10× normal stake** ($20.00 at $2.00 base, confirmed in Special Bets panel) |
| Buy Free Spins | **100× total bet** ($200.00 at $2.00 base, confirmed in Buy Feature panel) |
| Buy Super Free Spins | **500× total bet** ($1,000.00 at $2.00 base, confirmed in Buy Feature panel) |
| Max win | **10,000× bet** |
## Feature Index
- `multiplier_wild_stack` — Multiplier Wild lands only as a full-reel vertical stack carrying 1×/2×/3×/4× multipliers bottom-to-top → [[multiplier_wild_stack-mechanics]].
- `wild_respin` — A win on a spin containing a Multiplier Wild reel auto-respins; stack shifts down one row and every multiplier +1×, repeating while wins continue → [[wild_respin-mechanics]].
- `free_spins` — 3/4/5 Scatters award 10/15/20 free spins on special reels; multipliers persist/accumulate across the round → [[free_spins-mechanics]].
- `ante_bet` — Special Bets: Normal 25×, Ante 125× (12× FS chance), Super Spin 250× (guaranteed stack, no FS) → [[ante_bet-mechanics]].
- `buy_feature` — Buy Free Spins 100× bet or Super Free Spins 500× bet → [[buy_feature-mechanics]].
- `max_win_cap` — Round ends immediately when a feature total reaches 10,000× bet → [[max_win_cap-mechanics]].

## References
- `game-brief.md`
- Demo game — https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs25bstackwild
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
- https://www.casinos.com/slots/out-of-the-woods
- https://www.igamingtoday.com/out-of-the-woods-slot-review/
- Live browser play-through log `[t01]`–`[t70]`