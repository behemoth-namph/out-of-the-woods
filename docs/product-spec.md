# Out of the Woods — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Out of the Woods |
| Provider | Pragmatic Play |
| Theme | Dark comic woodland / forest survival — hooded animal "camper" characters and an owl totem |
| gameId | `out-of-the-woods` |
| gameSymbol | `vs25bstackwild` |
| Source | text (market research + live browser demo play-through) |
| Captured | 2026-07-15 |

## Grid & Win Rule
| Field | Value |
|---|---|
| Grid type | fixed reels |
| Rows × Cols | **4 rows × 5 columns** (5 reels, 4 rows each) |
| Paylines | **25 fixed paylines** |
| minCluster | N/A — this is a line game, not a cluster/ways game |

**Win rule (one sentence):** A symbol wins when **3, 4, or 5 identical symbols land on consecutive reels starting from the leftmost reel (reel 1)** along one of the 25 fixed paylines; the Multiplier Wild substitutes for every symbol except the Scatter, and simultaneous winning lines are summed. (Confirmed live: base pays are strictly left-to-right from reel 1 — bottom row `K,K,K,K` on reels 2–5 paid nothing because reel 1 was `J` [PLAYER LOG t20].)

## Symbol Table
> **All payout values below are `estimated` (confidence: 0.65, sources: market-research paytable) — not independently confirmed against the in-game paytable images. Symbol identity→tier mapping is `estimated` (confidence: 0.90, sources: 3), esp. `blue-girl`.** Pays are expressed as **× total bet**, per count band **[3-of-a-kind, 4-of-a-kind, 5-of-a-kind]**.

| id | name | type | tier | 3× | 4× | 5× |
|---|---|---|---|---|---|---|
| `wild-multiplier` | Multiplier Wild | wild | high | 1.6 | 4.8 | 24.0 |
| `bunny` | Bunny/Rabbit Camper (green) | regular | high | 1.6 | 4.8 | 24.0 |
| `blue-girl` | Blue Girl Camper | regular | high | 1.2 | 3.6 | 18.0 |
| `bear` | Bear Camper (red) | regular | high | 0.8 | 2.4 | 12.0 |
| `deer` | Deer Camper (pink) | regular | high | 0.4 | 1.2 | 6.0 |
| `A` | Ace | regular | low | 0.24 | 0.72 | 3.6 |
| `K` | King | regular | low | 0.2 | 0.6 | 3.0 |
| `Q` | Queen | regular | low | 0.16 | 0.48 | 2.4 |
| `J` | Jack | regular | low | 0.12 | 0.36 | 1.8 |
| `10` | Ten | regular | low | 0.08 | 0.24 | 1.2 |
| `scatter` | Scatter (sun/forest icon) | scatter | high | — | — | — |

Notes:
- `wild-multiplier` lands **only as a full-reel stack** (fills all 4 rows of a reel); substitutes for all symbols except `scatter`; also pays as a line symbol at the values above.
- `scatter` has **no line pay** (empty pay array); it triggers free spins only. 3/4/5 scatters → 10/15/20 free spins.
- Dollar check at bet $2.00: `deer` 3× = 0.4 × $2.00 = **$0.80** — matches live "3× Deer LINE 11 PAYS $0.80" [PLAYER LOG t36].

## Bet Model
| Field | Value | Source |
|---|---|---|
| Min bet | $0.25 | in-game paytable page 4 |
| Max bet | $2,500 | in-game paytable page 4 |
| Normal-play bet multiplier | 25× | in-game paytable page 3 — verbatim "Bet multiplier 25x - Normal play" |
| Ante Bet | 125× — grants **12× higher** free-spins chance (verbatim in-game: "The chance to trigger the FREE SPINS feature is 12 times higher") | in-game paytable page 3 |
| Super Spin | 250× — guarantees a wild stack every spin; **disables** free spins | in-game paytable page 3 |
| Buy Free Spins | **100× total bet** ($200.00 on $2.00 bet) — awards 10 free spins | Buy modal |
| Buy Super Free Spins | **500× total bet** ($1,000.00 on $2.00 bet) — first stack starts at 10×–13× | Buy modal |
## Feature Index
- **`multiplier-wild-respin`** — a full-reel Multiplier Wild stack (1×/2×/3×/4× bottom→top) awards a respin on any win; the stack climbs each respin; multiplier applies per intersecting line. → [[multiplier-wild-respin-mechanics]]
- **`free-spins`** — 3/4/5 scatters award 10/15/20 spins, retriggerable; highest multiplier reached carries over. → [[free-spins-mechanics]]
- **`ante-bet`** — 125× bet mode raising free-spins frequency 12× (verbatim in-game: "12 times higher", not a range). → [[ante-bet-mechanics]]
- **`super-spin`** — 250× bet mode guaranteeing a wild stack per spin but disabling free spins. → [[super-spin-mechanics]]
- **`buy-feature`** — purchase Free Spins (100×) or Super Free Spins (500×). → [[buy-feature-mechanics]]
## References
- game-brief.md
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs25bstackwild&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobbyUrl=https%3A%2F%2Fwww.pragmaticplay.com
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
- https://chipy.com/games/world-match/into-the-woods
- https://www.cachecreek.com/slot-machine-volatility
- https://www.facebook.com/reviewjournal/posts/what-casino-games-and-slot-machines-give-you-as-a-player-the-best-chance-of-winn/799030108932669/
- https://www.youtube.com/watch?v=CmHEdSj90AA
- https://casino.betmgm.ca/en/blog/casino-games/guide-bonus-features-found-modern-slot-titles/
- https://www.facebook.com/groups/154535645285898/posts/2205354620203980/
- https://www.pragmaticplay.com/en/games/out-of-the-woods/
- https://quickspin.com/slots/big-bad-wolf/
- https://www.igamingtoday.com/out-of-the-woods-slot-review/
- https://slotcatalog.com/en/slots/out-of-the-woods
- https://clashofslots.com/slots/pragmatic-play/out-of-the-woods/
- https://casino.betmgm.ca/en/blog/slots/top-pragmatic-play-slots/
- https://bonustiime.com/slots/all-slots/wild-tome-of-the-woods/
- https://slotcatalog.com/en/slot-themes/wood
- https://casino.guru/
- https://www.trustpilot.com/review/slotstemple.com?page=6
- https://slotcatalog.com/en/read/guides/All-you-need-to-know-about-the-slot-game-metrics-RTP-Variance-Hit-Frequency
- https://betway.com/g/en/casino/slots
- https://www.cachecreek.com/slot-machines-symbols
<<<END-OF-FILE>>>