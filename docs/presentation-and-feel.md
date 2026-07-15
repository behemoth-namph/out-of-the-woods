# Presentation & Feel — Out of the Woods

## Sources & Confidence
Observed live this session (browser demo, ~250 base spins + 1 bought free-spins round): base spins, wild-respin escalation, win banners, win highlights, buy-feature flow, free-spins intro cinematic, paytable screens. NOT directly observed: natural scatter trigger, Special Bets (Ante/Super Spin) visuals, autoplay panel screenshot, big-win/max-win tiers above "NICE!". No math figures appear in this doc.

## Reel Motion & Timing (incl. turbo diff)
- Standard drop: reels spin and stop reel-by-reel left→right; no-win resolves to an idle "SPIN TO WIN!" / "PLACE YOUR BETS!" prompt with no coin animation [t16], [t17].
- **Quick Spin** toggle in autoplay speeds resolution [t22]–[t23]. **Turbo:** hold spacebar ("HOLD SPACE FOR TURBO SPIN" in-canvas tip [t58]) — near-instant stop. [ASSUMPTION: exact drop durations ~300–500ms normal, ~80–120ms turbo]

## Anticipation
- **Flame column:** a flame/fire overlay engulfs a single reel to tease an incoming wild-multiplier stack or (in the buy trigger) a forced scatter reel — reel 3 ablaze [t25], [t49].
- **Full-screen swirl:** a flame/energy swirl transition fills the screen on larger wins / feature transitions [t31].

## Win Presentation Tiers
| tier | on-screen threshold | effects | ~duration |
|---|---|---|---|
| Standard line win | any win | gold-outline trace of winning cells + "WIN $x" / "GAME PAYS $x" callout; aggregated total shown | ~1–1.5s [ASSUMPTION] |
| "NICE!" | small-to-mid (observed $5.93–$31.61 on a $2 bet, as displayed) | named "NICE!" banner over moody night scene (hooded figures, owl, lit house) + coin-fall | ~2s [ASSUMPTION] |
| Higher tiers | above "NICE!" | not observed this session | — |
## Cascade & Tumble Feel
**None — no cascade/tumble.** Symbols do not drop to refill after a win; the board resets for the next spin [t43]. Winning symbols show a caged/wrapped-burst clear overlay just before disappearing, but no refill follows [t43].

## Multiplier Effects
- Wild stack lands as a full column showing per-row multiplier numerals (e.g. 4×/3×/2×/1× top→bottom) [t26].
- A "WILD MULTIPLIER n×" badge displays beside the owl and updates as the ladder climbs (7×, 10× observed) [t28], [t29].
- A bright burst/flash animates near the badge as the multiplier applies [t42].
- On respin the stack visibly shifts down and multipliers increment [t28].

## Symbol Animations (idle vs win)
- Idle: static symbols in the grid; regular symbols can stack multiple copies per reel [t17].
- Win: gold-outline border traces the exact winning symbol shape; sparkle particles on cluster-shaped multi-cell wins [t33], [t34]; low symbols ("10") show a caged/wrapped-burst clear graphic [t43].

## Ambient & Audio
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
Not observed — no audio evidence captured this session (silent capture). Visual ambient: moonlit-forest and fiery owl-totem cinematics frame the free-spins feature [t50], [t51], [t55]. [ASSUMPTION: forest ambient loop + escalating stingers on multiplier climb]

## Transitions
- Free-spins entry: full-screen "CONGRATULATIONS — YOU HAVE WON 10 FREE SPINS" over moonlit forest, "PRESS ANYWHERE TO CONTINUE" [t50], then a fiery owl-statue cinematic [t51].
- Free-spins exit: mantelpiece/animal-plaque transition then "FREE SPINS COMPLETED" total-win screen [t55], [t56].

## Presentation Event Timeline
| event id | presentation cue | ~duration/easing | evidence |
|---|---|---|---|
| `spin_start` | button press, reels blur into motion | ~150ms ease-in [ASSUMPTION] | [t15] |
| `bet_commit` | credit counter ticks down | instant | [t16] |
| `board_fill` / `reels_land` | reels stop L→R; occasional flame-column tease on a reel | ~300–500ms/reel; turbo ~80ms [ASSUMPTION] | [t16], [t25] |
| `wild_stack_detect` | full wild column reveal with multiplier numerals + badge | ~400ms pop [ASSUMPTION] | [t26], [t28] |
| `line_evaluate` / `multiplier_apply` | gold-outline trace of winning cells; per-line "n× LINE k PAYS $x" callout | ~600ms | [t36], [t54] |
| `win_tally` / `win_present` | floating "WIN $x" / "GAME PAYS $x"; coin-fall on tiered wins | ~1–2s | [t27], [t37] |
| `stack_shift` | stack slides down, multipliers increment, badge updates, burst flash | ~500ms | [t28], [t42] |
| `respin_land` | non-held reels re-drop; full-screen swirl on bigger escalations | ~400ms | [t29], [t31] |
| `no_more_wins` | win freezes, board settles to idle | ~300ms | [t32] |
| `fs_trigger` | full-screen "YOU HAVE WON 10 FREE SPINS" + press-to-continue | player-gated | [t50] |
| `fs_spin_start` | fiery owl cinematic (first) then spins; "n FREE SPINS LEFT" counter | ~2s intro / player-gated | [t51], [t52] |
| `round_end` | "FREE SPINS COMPLETED" total, or idle prompt for base | ~2s | [t55], [t56] |

## Juice Moments
- The climbing "WILD MULTIPLIER n×" badge with burst flash as the ladder escalates 4×→7×→10× across respins [t28], [t29].
- Flame column engulfing a reel as anticipation, resolving into a stacked wild [t25], [t26].
- Full-screen fiery swirl on the bigger wins [t31].
- Coin-fall over the "NICE!" moonlit-forest banner [t27].
- The fiery owl-totem free-spins intro cinematic [t51].

## References
- game-brief.md; PLAYER LOG [t15]–[t56] (moments cited inline)
- [[event-order-and-determinism]]
- https://www.bigwinboard.com/out-of-the-woods-pragmatic-play-slot-review/
<<<END-OF-FILE>>>