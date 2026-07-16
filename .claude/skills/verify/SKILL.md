---
name: verify
description: Build/launch/drive recipe to verify Out of the Woods (Vite + Pixi WebGL canvas) at runtime
---

# Verifying Out of the Woods

Surface is a single WebGL canvas (no DOM UI) — verify with Playwright screenshots.

## Launch

```bash
npm run dev -- --port 5199 --strictPort   # background
npx playwright --version                   # 1.60 available; install playwright npm pkg in scratchpad, not the repo
```

## Drive

- Viewport 1280×720 → landscape design space 2560×1440 at scale 0.5, no offset (design coords ÷ 2 = screen coords).
- `Space` keydown = spin; holding Space = turbo. Deterministic seeded RNG (`BASE_SEED` in useGame.ts): same spin sequence every session. Spin 2 lands a wild stack; the ~4th spin is a BIG WIN ($89.84 at $2 bet) with swirl + coin-fall.
- Useful click targets (screen px at 1280×720): BUY FEATURE plate (95, 269); QUICK toggle (986, 686); scrim/anywhere to close modal or continue cinematics.
- Capture `pageerror` + console errors; ignore "GL Driver Message … ReadPixels" warnings (headless GL noise).

## Gotchas

- Buy/Special plates are event-disabled while `busy` (spin/celebration running) — wait for idle before clicking them.
- A pre-existing PixiJS deprecation warning fires from `buildBadge` (`Graphics.addChild`); not a regression.
- Win presentation windows: highlight appears ~1.4s after Space, celebration tiers add ~2–3s; wait ≥5s between spins to let respin chains finish.
