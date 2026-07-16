# Out of the Woods — playable slot build

A working React + GSAP implementation of **Out of the Woods** (`vs25bstackwild`), a
5-reel × 4-row, 25-payline slot with a climbing Multiplier-Wild respin engine, built
directly from the design docs in [`docs/`](docs/) and the reference captures in
[`screenshots/`](screenshots/).

## Run it

```bash
npm install
npm run dev      # → http://localhost:5188
npm test         # engine unit tests (documented test vectors)
npm run build    # type-check + production bundle
```

## Controls

- **Spin** — the round button, or **tap Space**. **Hold Space** for a turbo spin.
- **QUICK** — faster resolution. **AUTO** — autoplay.
- **BUY FEATURE** — Free Spins (100× bet) or Super Free Spins (500× bet, wilds start 10×–13×).
- **SPECIAL BETS** — Normal (25×) · Ante (125×, 12× free-spins chance) · Super Spin (250×, guaranteed stack, no free spins).

## What's implemented (from the spec)

| Area | Detail |
|---|---|
| Win rule | 3+ identical on consecutive reels **from reel 1**, along 25 fixed paylines; wild substitutes for all but scatter; lines sum. |
| Paytable | Exact `× total bet` values from [docs/math-and-rtp.md](docs/math-and-rtp.md). |
| Multiplier Wild | Lands **only as a full-reel stack** (never a loose cell). Per-line multiplier = the stack cell each winning line crosses; multiple crossings multiply. |
| Respin ladder | A win + a stack ⇒ respin; stack held, others re-drop; every multiplier climbs **+1** (or **+2…10** when a **gold-rim** wild sits on the bottom row). Chain ends on the first no-win respin. |
| Free spins | 3/4/5 scatters → 10/15/20 spins, retriggerable; **highest multiplier carries over** to the next stack. |
| Buy / Super buy | Direct entry; super buy seeds the first stack at 10×–13×. |
| Win cap | Cumulative round/feature win clamped to **10,000× bet**. |
| Determinism | Seeded `mulberry32` stub; draws appended at the fixed positions in [docs/event-order-and-determinism.md](docs/event-order-and-determinism.md). |

## Architecture

- **`src/game/`** — pure, UI-free engine. `engine.ts` resolves a spin + respin chain
  into a replayable list of `RespinStep`s. `useGame.ts` is the state machine that paces
  the presentation (reel drops, win holds, ladder climbs, feature flow).
  `engine.test.ts` asserts every documented test vector (TV-01…TV-13).
- **`src/components/`** — procedural art (no external image assets): framed-portrait
  character symbols, carved wooden card letters, cyan scope-lens wild medallions, the
  owl totem + climbing badge, cinematic overlays, and all GSAP animations via `useGSAP`.

## Deliberate assumptions

- **Reel weights are proprietary and not derivable** (docs state confidence 0.05). The
  determinism contract permits substituting a distribution — the weights in `engine.ts`
  are tuned so the demo actually surfaces its features at a watchable cadence.
- **At most one wild stack** exists per spin — matching every live capture. Allowing
  stacks on alternating reels makes every payline win via wild-substitution and the
  respin chain never terminates.
- The 21 non-horizontal paylines are a standard filler set; the docs only pin the 4
  straight horizontals, which the test vectors rely on.
- Symbol characters are rendered as framed emoji stand-ins for the hand-painted comic
  art described in [docs/art-design.md](docs/art-design.md); palette, framing, and
  effect vocabulary follow the art DNA.
