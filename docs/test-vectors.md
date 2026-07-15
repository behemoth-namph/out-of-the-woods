# Test Vectors — Out of the Woods

## Conventions
- **Board notation:** a 4-row × 5-col matrix of symbol ids, **row 1 = top**, reel = column (reel 1 = leftmost). `W(n)` = Multiplier Wild carrying multiplier `n×`. `SC` = scatter.
- **Bet used:** **total bet = 2.00** (non-1, so bet-multiplication bugs surface). Pay values come from the paytable in [[math-and-rtp]] (× total bet). Those pay values are `estimated` (labeled in [[math-and-rtp]]); here they are the **fixed given basis** for rule-derived arithmetic — no estimated metric (RTP, hit frequency, weights) is asserted.
- **Paylines:** the spec does not enumerate the 25 line coordinates **[ASSUMPTION]**; these vectors rely ONLY on the 4 straight horizontal lines — **Line A = row 1, B = row 2, C = row 3, D = row 4** — which are canonical members of any 25-line map. Non-horizontal lines are irrelevant to every board below.
- **Refill injection:** respin refill symbols are **GIVEN by the vector** (injected via the seeded RNG stub), never random. Held wild-stack reels persist unchanged except for their climbing multipliers.
- **Win rule:** 3+ identical symbols on consecutive reels from reel 1; wild substitutes for all but scatter; line pays sum. Multiplier applies per line crossing a stack cell.

## Vectors

### TV-01 — No-win board
- **Given:**
  ```
  10  J   Q   K   A
  A   K   Q   J   10
  J   Q   K   A   10
  Q   A   J   K   10
  ```
- **When:** base spin, bet 2.00.
- **Then:** no line has 3 matching from reel 1; 0 scatters. **Win = $0.00**, no respin.
- **Why:** left-to-right 3+ rule — see [[math-and-rtp]].

### TV-02 — Exact threshold (count == 3)
- **Given:**
  ```
  deer deer deer K   A
  A    K    Q    J   10
  J    Q    K    A   10
  Q    A    J    K   10
  ```
- **When:** base spin, bet 2.00.
- **Then:** Line A = 3× `deer` → `0.4 × 2.00 = $0.80`. **Win = $0.80**.
- **Why:** minimum match length 3 pays — [[math-and-rtp]].

### TV-03 — Pay-band boundary, 4-of-a-kind
- **Given:**
  ```
  bear bear bear bear K
  A    K    Q    J    10
  J    Q    K    A    10
  Q    A    J    K    10
  ```
- **When:** base spin, bet 2.00.
- **Then:** Line A = 4× `bear` → `2.4 × 2.00 = $4.80`. **Win = $4.80**.
- **Why:** 4-band pay — [[math-and-rtp]].

### TV-04 — Pay-band boundary, 5-of-a-kind (vs TV-03)
- **Given:**
  ```
  bear bear bear bear bear
  A    K    Q    J    10
  J    Q    K    A    10
  Q    A    J    K    10
  ```
- **When:** base spin, bet 2.00.
- **Then:** Line A = 5× `bear` → `12.0 × 2.00 = $24.00`. **Win = $24.00** (adding the 5th bear jumps the band from $4.80 → $24.00).
- **Why:** band boundary 4→5 — [[math-and-rtp]].

### TV-05 — Two symbols winning in one evaluation
- **Given:**
  ```
  deer  deer  deer  K   A
  bunny bunny bunny 10  Q
  J     Q     K     A   10
  Q     A     J     K   10
  ```
- **When:** base spin, bet 2.00.
- **Then:** Line A = 3× deer `0.4×2 = $0.80`; Line B = 3× bunny `1.6×2 = $3.20`. **Win = $0.80 + $3.20 = $4.00**.
- **Why:** simultaneous winning lines sum — [[math-and-rtp]].

### TV-06 — Multi-step respin chain (2+ steps, climbing ladder)
> This game has NO cascade; the multi-step chain is the wild-respin loop. Every intermediate board shown. Stack on reel 3 (held), initial multipliers bottom→top 1,2,3,4 (so row1=4×, row2=3×, row3=2×, row4=1×).
- **Step 1 board:**
  ```
  deer deer W(4x) Q A
  A    K    W(3x) J 10
  J    Q    W(2x) K 10
  10   J    W(1x) A Q
  ```
  Line A: deer,deer,W(as deer) = 3 deer, crosses 4× → `0.4×2×4 = $3.20`. Other lines no win. Step1 = **$3.20**, win ⇒ respin, shift +1 → row1=5×…row4=2×.
- **Step 2 injected board (reel 3 held, +1):**
  ```
  bunny bunny W(5x) K A
  A     Q     W(4x) J 10
  J     K     W(3x) Q 10
  10    A     W(2x) K Q
  ```
  Line A: bunny,bunny,W(as bunny) = 3 bunny, crosses 5× → `1.6×2×5 = $16.00`. Step2 = **$16.00**, win ⇒ respin, shift +1 → row1=6×.
- **Step 3 injected board (no win → chain ends):**
  ```
  A  K   W(6x) Q J
  Q  J   W(5x) 10 A
  K  A   W(4x) J Q
  J  10  W(3x) A K
  ```
  No line has 3-from-reel-1. **no_more_wins.**
- **Then:** chain total = `$3.20 + $16.00 = $19.20`.
- **Why:** respin loop + per-line multiplier — [[multiplier-wild-respin-mechanics]], [[event-order-and-determinism]].

### TV-07 — Feature multiplier applied to one line (matches live $0.80×5=$4.00)
- **Given:** stack on reel 3; winning line B crosses the 5× cell.
  ```
  A    K    W(6x) Q J
  deer deer W(5x) K A
  J    Q    W(4x) 10 Q
  10   J    W(3x) A  K
  ```
- **When:** spin, bet 2.00.
- **Then:** Line B = 3× deer × 5 → `0.4 × 2.00 × 5 = $4.00`. Lines A/C/D no win. **Win = $4.00**.
- **Why:** per-line multiplier (not flat total) — [[multiplier-wild-respin-mechanics]] (mirrors [t54]).

### TV-08 — Scatter trigger (3 scatters → 10 free spins)
- **Given:**
  ```
  SC J  Q  K  A
  A  K  SC J  10
  J  Q  K  A  SC
  Q  A  J  K  10
  ```
- **When:** base spin, bet 2.00.
- **Then:** scatterCount = 3 → **free spins awarded = 10**; no line win → base win $0.00.
- **Why:** 3/4/5 scatters → 10/15/20 — [[free-spins-mechanics]].

### TV-09 — Scatter count bands (4 and 5)
- **Given (4 scatters):** any board with exactly 4 `SC` and no 3-line → **awards 15**.
- **Given (5 scatters):** any board with exactly 5 `SC` → **awards 20**.
- **Then:** award = {4:15, 5:20}.
- **Why:** trigger table — [[free-spins-mechanics]].

### TV-10 — Max-win cap clamp
- **Given:** free-spin state; one winning line computes `bunny 5× × carried multiplier 500×`: `24.0 × 2.00 × 500 = $24,000.00` raw (the 500× is an illustrative carried ladder value; arithmetic only).
- **When:** `win_cap_clamp`.
- **Then:** cap = `10,000 × 2.00 = $20,000.00`; raw $24,000.00 > cap → **round win clamped to $20,000.00**.
- **Why:** 10,000× cap — [[math-and-rtp]], [[event-order-and-determinism]].

### TV-11 — Buy-feature cost arithmetic
- **Given:** bet 2.00.
- **When:** Buy Free Spins.
- **Then:** cost = `100 × 2.00 = $200.00`; balance −$200.00; award 10 free spins.
- **And:** Buy Super Free Spins cost = `500 × 2.00 = $1,000.00`; first stack starts 10×–13×.
- **Why:** buy costs — [[buy-feature-mechanics]] (matches [t46], [t49]).

### TV-12 — Free-spins multiplier carryover
- **Given:** free spin K reaches a top multiplier of 10×; spin K ends.
- **When:** free spin K+1 lands a new wild stack.
- **Then:** the new stack's top multiplier starts at **≥10×** (`max(4, storedTopMultiplier)`), not reset to 4×.
- **Why:** carryover rule — [[free-spins-mechanics]] (observed [t52]–[t55]).

### TV-13 — Left-to-right gap (no win despite 4 matches on reels 2–5)
- **Given:**
  ```
  J K K K K
  A K Q J 10
  J Q K A 10
  Q A J K 10
  ```
- **When:** base spin, bet 2.00.
- **Then:** Line A = J,K,K,K,K → reel 1 is `J`, reel 2 `K` differ ⇒ **no win, $0.00** (the four `K` do not start at reel 1).
- **Why:** wins must start at leftmost reel — [[math-and-rtp]] (mirrors [t20]).

## Coverage checklist
| Rule | Vector ids |
|---|---|
| No-win board | TV-01, TV-13 |
| Exact threshold (count == 3) | TV-02 |
| Pay-band boundary (4 vs 5) | TV-03, TV-04 |
| Two symbols winning simultaneously | TV-05 |
| Multi-step respin chain w/ intermediate boards | TV-06 |
| Climbing per-line multiplier applied | TV-06, TV-07 |
| Scatter trigger (3/4/5 → 10/15/20) | TV-08, TV-09 |
| Max-win cap clamp | TV-10 |
| Buy/ante cost arithmetic | TV-11 |
| Free-spins multiplier carryover | TV-12 |
| Left-to-right-from-reel-1 rule | TV-02, TV-13 |

## References
- [[math-and-rtp]], [[multiplier-wild-respin-mechanics]], [[free-spins-mechanics]], [[buy-feature-mechanics]], [[event-order-and-determinism]]
- game-brief.md; PLAYER LOG [t20], [t46], [t49], [t52]–[t55]
- https://slotcatalog.com/en/slots/out-of-the-woods
<<<END-OF-FILE>>>