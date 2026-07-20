# Presentation & Feel — Out of the Woods

## Sources & Confidence
Authored from the live browser play-through `[t01]`–`[t70]` (~300 base spins + respin chains observed). **Free Spins triggered live during this session** (10 Free Spins awarded, completing for $138.40 with the Wild Multiplier reaching 11×) — see the Free Spins intro/outro screenshots. No math figures appear here — only on-screen presentation values. Win-tier thresholds are approximate from play and marked accordingly.
## Reel Motion & Timing (incl. turbo diff)
- Base spins under automation resolved very fast, near-instant reel stop (`[t27]`).
- **Turbo Spin** (toggle, or **hold SPACE**) still shows a **fast blur-drop** (vertical motion streak on reels), not an instant snap (`[t41]`). Quick-Spin is a separate toggle in Autoplay settings (`[t34]`).
- `[ASSUMPTION]` base reel-stop cadence ≈ 300–500 ms per reel, left-to-right; turbo ≈ 80–120 ms — unobserved precise timings.

## Anticipation
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Scatters landing build toward the 3+ trigger; 1–2 scatters seen (`[t28]`,`[t33]`) — no explicit anticipation freeze captured. `[ASSUMPTION]` scatter-land anticipation on reels 3–5.

## Win Presentation Tiers
Tier banner is **locked at trigger time**; the win counter **rolls up live** during the respin chain, staying under the same banner (`[t57]`,`[t58]`). Each tier plays a themed full-scene animation.

| tier | on-screen threshold (approx × bet) | effects | ~duration |
|---|---|---|---|
| NICE | ~2× (`[t37]`) | night cabin scene, falling coins | `[ASSUMPTION]` ~2 s |
| SUPERB | ~5× (`[t56]`) | trophy-room scene, characters mounted, cheering | `[ASSUMPTION]` ~2–3 s |
| MEGA | ~21× (`[t68]`) | campfire scene, purple night sky | `[ASSUMPTION]` ~3 s |
| SENSATIONAL | ~17×+ (`[t51]`,`[t59]` up to ~56×) | fiery scene, glowing owl totem, coin rain | `[ASSUMPTION]` ~3–4 s |

Ordering note: observed banner escalation NICE < SUPERB < MEGA/SENSATIONAL; the MEGA (~21×) vs SENSATIONAL (~17×+) thresholds overlap in observation and are approximate (spec presentation note). Higher/lower tiers beyond these four: **not observed**.

## Cascade & Tumble Feel
No tumble/cascade — this is a line-pay + **auto-respin** game. Respin feel:
- Winning stack **auto-respins with no input** (`[t30]`); stack visibly **shifts down one row** and multipliers tick up.
- Winning symbols **dissolve / smoke-puff clear** (`[t28]`,`[t39]`) with a **gold flame outline** highlight (`[t29]`).

## Multiplier Effects
- **WILD MULTIPLIER `Nx` badge** near the owl statue, updating live per respin (`[t29]`,`[t30]`,`[t61]`).
- The active multiplier wild bears a **golden rim, glowing** (`[t29]`,`[t39]`).
- On huge chains, ambient escalates: owl statue **eyes glow green → cyan-blue** (`[t60]`,`[t61]`) and the **background shifts blue-purple** (`[t61]`) at very large wins (e.g. stack reaching 15×/14×/13×/12×, running win 160× bet).

## Symbol Animations (idle vs win)
- Idle: static portrait/royal symbols.
- Win: **gold-orange frame highlight + small smoke-puff burst at the symbol base** (`[t28]`), **gold flame outline** for block wins (`[t29]`), **dissolve/smoke clear** before respin (`[t39]`).

## Ambient & Audio
- Settings expose **Ambient** and **Sound FX** toggles (`[t24]`). Precise audio cues not transcribable from screenshots — `[ASSUMPTION]` forest ambience + escalating win stingers per tier.
- Owl totem is a persistent ambient centerpiece that glows during celebrations (`[t60]`).

## Transitions
- Win-tier banners are full-scene transitions (cabin / trophy room / campfire / fiery), each with coin rain (`[t37]`,`[t51]`,`[t56]`,`[t68]`). **Skip Screens** setting auto-skips feature intro/end screens after a short delay (`[t25]`,`[t34]`).

## Presentation Event Timeline
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
| event id | presentation cue | ~duration/easing | evidence |
|---|---|---|---|
| `spin_start` | spin button press, reels start | ~120 ms ease-in `[ASSUMPTION]` | `[t26]` |
| `reels_land` | reels stop L→R (blur-drop in turbo) | ~300–500 ms base / ~100 ms turbo `[ASSUMPTION]` | `[t41]` |
| `stack_detect` | golden-rim wild glow appears on stacked reel | ~200 ms | `[t29]` |
| `win_evaluate` | winning line frame lights (gold flame outline) | ~300 ms | `[t29]` |
| `multiplier_apply` | WILD MULTIPLIER `Nx` badge pulses near owl | ~200 ms | `[t29]`,`[t61]` |
| `win_present` | tier banner + counter roll-up | 2–4 s per tier `[ASSUMPTION]` | `[t37]`,`[t57]` |
| `stack_shift` | symbols dissolve/smoke, stack slides down one row | ~300–500 ms `[ASSUMPTION]` | `[t30]`,`[t39]` |
| `respin_spin` | non-stack reels re-drop | ~300 ms `[ASSUMPTION]` | `[t30]` |
| `round_end` | ambient settles (owl-eye glow fades) | ~500 ms | `[t60]`,`[t61]` |

## Juice Moments
- The **respin multiplier climb** with the badge and owl-eye color escalation (green→cyan) into a blue-purple ambient at big wins (`[t61]`) — the game's signature hook.
- The **golden-rim wild reaching the bottom** and jumping the ladder via a random shift — the "big moment" of a chain (`[t61]`).
- Live counter roll-up under a locked tier banner (`[t57]`).

## References
- Live play `[t26]`–`[t68]` (moments cited inline).