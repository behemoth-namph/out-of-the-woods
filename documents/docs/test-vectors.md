# Test Vectors — Out of the Woods

## Conventions
- **Board notation:** a 4×5 matrix of symbol ids, **row 1 = top**, row 4 = bottom; columns are reels R1→R5. Symbol ids per [[product-spec]].
- **Bet used:** **total bet = 2.0** (non-1, so bet-multiplication bugs surface). Line pay in currency = `payValue(× bet) × 2.0`.
- **Expected pays** come from the paytable in [[math-and-rtp]] (× bet). Only rule-derived arithmetic is asserted — never RTP, hit frequency, or weights.
- **Refill injection:** in tumble/respin vectors, the symbols on refilled reels are **GIVEN by the vector** (injected via the seeded RNG stub), never random.
- **Win rule:** 3+ identical on a payline, left-to-right from R1 (see [[math-and-rtp]]). Multiplier Wild cell multipliers scale a crossing line once (see [[wild_respin-mechanics]]).
- For clarity, single-line vectors assume the winning symbols sit on **payline 1 = top row (row index 0)** unless stated; only the relevant reels are shown as fixed.

## Vectors

### TV-01 — No-win board
- **Given:**
  ```
  ten  king queen ace  jack
  ace  jack ten   king queen
  king queen ace  jack ten
  jack ten  king  queen ace
  ```
- **When:** spin resolves, bet 2.0.
- **Then:** win = **$0.00**; no line has 3 adjacent identical from R1.
- **Why:** win rule requires 3+ left-to-right from R1 ([[math-and-rtp]]).

### TV-02 — Exact-threshold win (count == 3)
- **Given:** R1–R3 row-4 = `jack, jack, jack` (3 J on payline "bottom row"); rest non-matching.
- **When:** spin, bet 2.0.
- **Then:** `jack` 3-oak = 0.12× → **0.12 × 2.0 = $0.24**. (Matches live `[t28]`: "3X J LINE 4 PAYS $0.24".)
- **Why:** 3 is the minimum paying count ([[math-and-rtp]]).

### TV-03 — Pay-band boundary (4 vs 5 of a kind)
- **Given A:** R1–R4 on a line = `king,king,king,king`, R5 ≠ king → `king` 4-oak = 0.6× → **$1.20**.
- **Given B:** R1–R5 = `king,king,king,king,king` → `king` 5-oak = 3.0× → **$6.00**.
- **Then:** the same symbol pays **$1.20 (count 4) vs $6.00 (count 5)** — bands differ.
- **Why:** highest-count band applies ([[math-and-rtp]]).

### TV-04 — Two symbol ids winning simultaneously
- **Given:** payline top row = `ten,ten,ten` (R1–R3) and payline bottom row = `queen,queen,queen,queen` (R1–R4).
- **When:** single evaluation, bet 2.0.
- **Then:** `ten` 3-oak 0.08×=$0.16 **plus** `queen` 4-oak 0.48×=$0.96 → total **$1.12**.
- **Why:** each payline pays independently; wins sum ([[math-and-rtp]]).

### TV-05 — Multiplier Wild applies ONCE to a line
- **Given:** R4 is a full Multiplier Wild stack, ladder bottom→top `[1,2,3,4]`. Payline 1 (top row, row index 0, multiplier 4×) shows `king,king,king,WILD,king` = a 5-oak king line crossing R4 at the top cell (4×).
- **When:** evaluate, bet 2.0.
- **Then:** base `king` 5-oak 3.0×=$6.00, × R4 top-cell 4× = **$24.00** (applied once).
- **Why:** stack cell multiplier scales the crossing line once ([[wild_respin-mechanics]]).

### TV-06 — 2-step respin chain (board → win → injected refill → re-eval → total)
- **Given (spin, bet 2.0):** R4 = Multiplier Wild stack ladder `[2,3,4,5]` bottom→top (golden-rim at bottom row = 2×). Payline bottom row (row 3, R4 cell = 2×) = `king,king,king,WILD,king`.
  - Step-1 win: `king` 5-oak 3.0×=$6.00 × 2× (bottom cell) = **$12.00**. Win>0 → respin.
- **Shift:** golden-rim is on the **bottom row and would exit** → injected shift `N=3` (given by vector, from seeded RNG). Stack ladder rises +3 → `[5,6,7,8]`; golden-rim now sits 3 rows up.
- **Injected refill (respin board), bottom row:** `king,king,king,WILD,king` again (R4 bottom cell now 5×).
  - Step-2 win: `king` 5-oak 3.0×=$6.00 × 5× = **$30.00**. Win>0 → would respin again.
- **Injected refill (respin 3):** no matching line → **$0**, chain ends.
- **Then:** round total = $12.00 + $30.00 = **$42.00**.
- **Why:** respin loop shifts +N and re-multiplies each step; chain ends on a no-win respin ([[wild_respin-mechanics]], [[event-order-and-determinism]]).

### TV-07 — Scatter trigger count (3 scatters)
- **Given:** board contains exactly **3** `scatter` symbols anywhere.
- **When:** evaluate.
- **Then:** award **10 free spins**; no line pay from scatters.
- **Why:** 3 scatters → 10 FS ([[free_spins-mechanics]]).

### TV-08 — Scatter max trigger (5 scatters)
- **Given:** board contains exactly **5** `scatter` symbols.
- **Then:** award **20 free spins**.
- **Why:** 5 scatters → 20 FS ([[free_spins-mechanics]]).

### TV-09 — Max-win cap clamp
- **Given:** an in-progress free-spins respin chain whose computed running total reaches **10,050× bet** on the latest award.
- **When:** `win_cap_check`.
- **Then:** total clamped to **10,000× bet** (at bet 2.0 → **$20,000.00**); round ends, remaining spins forfeited.
- **Why:** hard cap ([[max_win_cap-mechanics]]).

### TV-10 — Buy Feature cost arithmetic
- **Given:** total bet 2.0.
- **When:** purchase.
- **Then:** Buy Free Spins = 100 × 2.0 = **$200.00**; Buy Super Free Spins = 500 × 2.0 = **$1,000.00**.
- **Why:** buy costs are 100×/500× total bet ([[buy_feature-mechanics]]).

### TV-11 — Special-bet (Ante / Super Spin) stake arithmetic
- **Given:** normal total bet 2.0 (line unit = 2.0 ÷ 25 = $0.08).
- **Then:** Ante Bet = 125 × 0.08 = **$10.00** (5× normal); Super Spin = 250 × 0.08 = **$20.00** (10× normal).
- **Why:** bet multipliers 25/125/250 ([[ante_bet-mechanics]]).

### TV-12 — Wild substitution completes a line
- **Given:** payline top row = `bear_man, bear_man, WILD, bear_man, ten` (R1–R4 form 4-oak bear_man via wild sub at R3; R5 breaks it). Wild is a lone owl wild (no multiplier).
- **Then:** `bear_man` 4-oak 2.4× → **$4.80** (× 1, no stack multiplier).
- **Why:** wild substitutes for all except scatter; lone wild carries no multiplier ([[multiplier_wild_stack-mechanics]]).

## Coverage checklist
- 3+ left-to-right win rule → TV-01, TV-02, TV-04
- Exact minimum count (3) → TV-02
- Pay-band boundary (4 vs 5) → TV-03
- Two symbols in one evaluation → TV-04
- Multiplier applied once → TV-05
- Multi-step respin chain w/ injected refills + golden-rim random shift → TV-06
- Scatter trigger (3 / 5) → TV-07, TV-08
- Max-win cap clamp → TV-09
- Buy cost arithmetic → TV-10
- Special-bet stake arithmetic → TV-11
- Wild substitution / lone-wild no-multiplier → TV-12

## References
- Paytable [[math-and-rtp]]; mechanics [[wild_respin-mechanics]], [[multiplier_wild_stack-mechanics]], [[free_spins-mechanics]], [[buy_feature-mechanics]], [[ante_bet-mechanics]], [[max_win_cap-mechanics]]; order [[event-order-and-determinism]]. Live corroboration `[t28]`.