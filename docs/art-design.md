# Out of the Woods — Art Design DNA

> Downstream contract for `art-maker`. Every colour below was sampled from the actual gameplay
> frames listed in the brief; anything I had to choose for the build is tagged `[ASSUMPTION]`.
> Symbol ids come from the spec only. This is a Pragmatic Play "Out of the Woods" (`vs25bstackwild`)
> capture: a 5×4, 25-line, stacked-multiplier-wild respin slot.

## Theme identity

- **Game name:** Out of the Woods
- **Theme keyword:** dark-comic woodland survival — hooded "camper" survivors fleeing a haunted
  forest under a carved owl totem, warm firelight vs. cold moonlight.
- **tile_style:** `floating` — the board interior is a dark near-black plum void (see `08`, `11`,
  `17`); the low card symbols (A/K/Q/J/10), the scatter and the blue wild medallions sit on it as
  transparent icons with no opaque backing plate. The four **character** high-symbols are the one
  exception: each is painted inside its own coloured wooden **picture frame** (green/blue/red/pink),
  so treat characters as framed icons, everything else as bare floating icons.
- **Mood/tone:** rowdy, cartoonish, slightly macabre — bulging-eye caricature horror played for
  laughs. Warm orange firelight bleeds in from screen edges; the centre is a cold purple gloom.
  Hand-drawn comic-book energy, thick inked outlines, exaggerated expressions.

## Art DNA

- **Material / surface:** hand-painted 2D comic illustration. Symbols read as *carved painted
  wood* — the letters are chunky wooden signage lashed to snares/traps/birdhouses; the owl totem is
  a chiselled log with visible grain and adze facets. Only the wild medallion is glassy: a polished
  cyan glass lens under a metal scope-ring. Matte painterly finish everywhere else, NO photoreal
  gloss.
- **Lighting:** strong warm key from the lower/edge firelight (amber, from screen sides), cold blue
  fill from the moon/board gloom, and a hot orange rim on foreground silhouettes (see `09` hooded
  figures rimmed in yellow-gold). Drop shadows are soft and low-contrast; symbols carry a subtle
  contact shadow into the board.
- **Camera angle:** flat, front-on, storybook stage. Symbols face camera dead-on. The owl totem and
  forest are a shallow theatrical backdrop with mild depth layering (foreground plants → mid figures
  → deep trees).
- **Rendering/finish:** cel-shaded painterly cartoon with heavy black/dark-brown ink linework,
  cross-hatch texture on wood, warm ambient occlusion in the crevices.
- **shape_language:** rounded-chunky and organic; bulbous character heads, fat rounded letterforms,
  gnarled tree trunks, circular medallions. Nothing sleek or geometric except the scope-ring wild.
- **Outline treatment:** thick dark ink outline (dark brown/near-black, ~2–4% of tile height) on
  every symbol; a bright gold winning-line trace overlays winning cells (see `08`,`11` gold
  rectangular glow).
- **Motifs:** carved owl totem with glowing eyes; red feathered/winged crest over the reel frame;
  rope lashings; animal-trap contraptions (snares, birdhouses, ladder-traps, venus flytraps);
  hooded cloaked figures; full moon + bats; torches and campfire flame.
- **negative (a clone must AVOID):** no clean flat-vector/minimalist look; no chrome/metal gem
  slot aesthetic; no neon cyberpunk; no bright daylight cheer — keep it dusky firelit and macabre;
  no realistic humans (characters are goofy bug-eyed caricatures); no gloss-plastic candy tiles.

## Color palette

Background-dominant hue: **warm firelit magenta-brown** (the base forest) transitioning to a
**deep plum board void**; the free-spins background swaps to a **cold moonlit blue**.

| token | hex | sampled from | role |
|---|---|---|---|
| core-ember | `#E8681C` | owl totem wood, `08`/`17` | primary warm orange (owl, K letter, flame) |
| spark-gold | `#F3B637` | Q letter / wild digits / win text | highlight gold, digits, sheen |
| bloom-flame | `#FFD24A` | flame swirl `07`, coin glints | hot bloom / additive glow core |
| wild-cyan | `#5CC6E8` | wild medallion glass `08`/`15` | multiplier wild lens, spark accents |
| bg-forest | `#7A2E44` | base background gloom `08`/`11` | background-dominant warm magenta-brown |
| board-void | `#241634` | reel interior `11`/`17` | dark board so grid reads (lum ~28) |
| panel-wood | `#8A2B2E` | Buy Feature / side panels `12` | red-wood UI plates |
| moon-blue | `#3A55A8` | free-spins night sky `13`/`15` | free-spins cold background hue |

Symbol accent colours (each ≥50% HSV-sat, distinct from bg): deer-pink `#E266A0`, bunny-green
`#5C8A3C`, bear-red `#B23530`, girl-blue `#3A7FC4`, A-magenta `#AE44C4`, 10-red `#D8352E`.
Board interior is deliberately dark (lum ~28) so symbols read — this is the intended dark-theme
relaxation, not an accident.

## Typography

- **Display font:** fat rounded comic slab, all-caps, heavy black-letter cartoon (see
  "CONGRATULATIONS" `13`/`16`, "NICE!" `07`, "BUY FEATURE"). Convex bevelled faces with a chunky
  extruded body.
  - fill: vertical gradient `#FFE070 → #E8801C` (top-bright to warm-orange), or white for
    secondary text ("YOU HAVE WON").
  - stroke: thick dark red-brown outline `#5A1E12` (~5% cap height) + a thin inner light rim.
  - drop-shadow: hard offset dark-brown shadow down-right, plus a soft warm glow on win text.
- **Number font:** same rounded family, gold-gradient fill (`#F6C63A → #E8891C`) with dark outline
  and drop shadow — used for "WIN $XX.XX", multiplier digits, credit/bet readouts (gold on dark).
- **Multiplier-medallion digits:** bold rounded gold (`#F3B637`) with a thin dark keyline, centred
  on the cyan lens (`08`,`15`,`17`).

## Symbols

Pixel target ~256² each. Gradients are top→bottom body fills; frames noted in material_note.

| id | display name | subject / silhouette | shape_class | body gradient stops | sheen | rim/edge | dominant | tier / weight | size × | material_note |
|---|---|---|---|---|---|---|---|---|---|---|
| `bunny` | Bunny Camper | rabbit-eared hooded man, green hoodie, bug-eyes | ORGANIC | `[[0,#7AA84E],[1,#3E6A2C]]` | `#B8D98A` | `#24401C` | `#5C8A3C` | high / 5 | 1.15 | painted portrait in a **green** lashed-wood frame |
| `blue-girl` | Blue Girl Camper | blonde girl, blue sun-hat, sparkly blue top | ORGANIC | `[[0,#5AA0E0],[1,#2A5C9E]]` | `#BFE0FF` | `#183A66` | `#3A7FC4` | high / 4 | 1.10 | portrait in a **blue** lashed-wood frame |
| `bear` | Bear Camper | red-bearded man, brown bear-fur hat, red plaid | ORGANIC | `[[0,#C6463A],[1,#7E211C]]` | `#E88A6E` | `#4A130F` | `#B23530` | high / 3 | 1.08 | portrait in a **red** lashed-wood frame; caged bars overlay when "trapped" |
| `deer` | Deer Camper | girl in pink deer-antler hood, pink jacket | ORGANIC | `[[0,#EE7FB0],[1,#C24A82]]` | `#FFC7E0` | `#7A2450` | `#E266A0` | high / 2 | 1.05 | portrait in a **pink/magenta** lashed-wood frame |
| `A` | Ace | magenta "A" on a wooden snare-trap base | ANGULAR | `[[0,#C060D6],[1,#8E2FB0]]` | `#EBB8F5` | `#4A1560` | `#AE44C4` | low / 2 | 0.95 | wood-carved letter clamped in a spring snare |
| `K` | King | orange "K" tangled in a rope lasso | ANGULAR | `[[0,#F09030],[1,#C05E12]]` | `#FFD08A` | `#5A2606` | `#E8801C` | low / 2 | 0.95 | wood letter with coiled snare-rope |
| `Q` | Queen | gold "Q" on a wooden plank | ANGULAR | `[[0,#F8D24A],[1,#D89A1E]]` | `#FFF0B0` | `#6A4408` | `#F0C838` | low / 1 | 0.92 | plank-mounted carved letter |
| `J` | Jack | blue "J" hanging from a birdhouse | ANGULAR | `[[0,#4A8ED8],[1,#245C9E]]` | `#BBDCFF` | `#12345E` | `#2E78C0` | low / 1 | 0.92 | letter dangling off a wooden birdhouse |
| `10` | Ten | red "10" on a wooden ladder-trap | ANGULAR | `[[0,#E8483E],[1,#A81E18]]` | `#FF9A88` | `#4A0F0C` | `#D8352E` | low / 1 | 0.90 | letters lashed to a rope-rung ladder trap |
| `SCAT` | Scatter | setting sun over black pine-forest silhouette | GEOMETRIC | `[[0,#FFC24A],[1,#E8601C]]` | `#FFE9A0` | `#2A1206` | `#F5901E` | scatter / 5 | 1.20 | glowing sun disc + dark forest, framed like a lit window/card |
| `WILD` | Multiplier Wild | cyan glass scope-lens, crosshair, gold digit | ROUND | `[[0,#7FD6F0],[1,#3FA6D0]]` | `#DFF6FF` | `#2A6E8E` | `#5CC6E8` | wild / 5 | 1.15 | polished glass lens in a riveted metal scope-ring; **gold ring variant** (`#F2B23A`) for the bottom "jump" wild; carries a `Nx` gold numeral |

## Background

- **Composition:** front-on forest stage. Centre ~60% is the dark plum **board void**
  (`board-void #241634`, luminance ~28–40) so the grid reads; decorative warm forest fills the
  edges — gnarled red-lit tree trunks, drifting firelight, venus-flytrap plants bottom-left/right,
  and the carved **owl totem** anchored at the right side glowing amber (`08`,`11`,`17`).
- **Base variant:** warm firelit magenta-brown forest (`bg-forest #7A2E44`), owl totem lit orange,
  hot amber glow behind the reels.
- **Free-spins variant (`_sp`/`_fs`):** cooler and richer — moonlit blue-purple forest with
  planted torches burning orange, deeper shadows (`15`, `13` = `moon-blue #3A55A8` sky with full
  moon + bats). Darker overall than base, torches add local warm pools.
- **Portrait `_sp` variant:** [ASSUMPTION] re-stage the same forest+owl for 9:16 — owl moved to a
  lower-third or top band, board centred; not directly observed (all captures were landscape).
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16). [ASSUMPTION for SP layout.]
- **Zone / overlay geometry (landscape):**
  - logo band: top-centre ~18% height (winged "OUT OF THE WOODS" crest over the frame).
  - board: centred, ~46% width × ~78% height, inset in the wooden frame.
  - side panels: left ~14% (Buy Feature / Special Bets / Rebuy plates); right ~16% (owl totem +
    Wild-Multiplier badge).
  - win area: text banner directly under the board ("WIN $X.XX / WINNER / LINE N PAYS").
  - controls band: bottom ~10% (credit/bet left, spin/autoplay right, info+menu bottom-left).

## Grid frame

- **Material:** heavy dark red-brown timber posts lashed with rope at the corners (`08`,`14`),
  topped by a spread **red-feathered wing crest** flanking the logo. Iron/wood texture, warm rim
  light on the left edge.
- **Ornament:** rope wraps at each junction, carved notches, a subtle inner drop-shadow into the
  board so the void reads as recessed.
- **Border geometry:** RGBA PNG, four solid timber sides around a fully transparent rectangular
  centre void (board shows through). Each side ≤6% of canvas. Corner rope-lashings may extend
  slightly inward. Colour `#5A2A20 → #3A1712` wood with `#8A2B2E` warm-lit highlight.

## Logo

- **Base:** "OUT OF THE" in small white/cream comic caps arced across the top; "WOODS" huge below in
  chunky carved-wood letters — orange-gold face (`#E8801C`) with a **cold icy-blue crackled top
  edge** and a blue keyline, thick dark outline, extruded 3D body (`01`,`08`). Set on/over the red
  winged crest.
- **Free-spins `_fs` variant:** same lettering rendered fully **golden** (`#F6C63A → #C8891C`
  gradient, brighter bevel) at ~1024×512 on a white matte background for compositing. [ASSUMPTION:
  no standalone FS logo was captured; derive from base by re-tinting to gold.]

## Particles

Fragments a shattering symbol/wooden-tile would throw:
1. **wood splinter** — sharp tapered dark-brown chips with grain (`#5A2A20`, angular).
2. **ember/spark** — tiny glowing orange-gold dots with a bright core (`#FFD24A`→`#E8681C`,
   additive), seen in flame swirls and win bursts.
3. **coin flip** — small gold star-stamped coins (`#F3B637` face, dark rim) that rain in win
   banners (`07`,`09`,`10`).
4. **cyan glass shard** — angular light-blue lens fragments (`#5CC6E8`) for the wild medallion
   break/pop.

## UI chrome

- **Spin button:** circular base-plate disc, dark ring with a warm inner, showing the twin-arrow
  refresh/spin glyph in white; when armed shows a red stop-square (`08`,`17`). ~256². Autoplay label
  beneath.
- **Digit / letter / multiplier glyph sheets (512² cells):** gold rounded numerals with dark
  keyline for win amounts and the `Nx` multiplier medallions (1x–10x observed, cyan lens backing);
  letter set matches display font (white + gold).
- **Win-tier wordmarks:** "NICE!" observed (orange-gold puffy caps, dark-red outline, on a blue
  plaque in a lashed-wood gold frame — `07`,`09`,`10`). Higher tiers [ASSUMPTION]: reuse same
  treatment escalating (e.g. BIG WIN / MEGA WIN / SUPER WIN) — only NICE! was seen.
- **Payout panel frame + item:** red-wood plaque with rope-lashed gold-edge border and cream/white
  caps title ("GAME RULES", "BUY FEATURE"); symbol rows on a dark translucent panel with gold
  pay-value text (`paytable-1`).
- **Ambient overlay layers:** soft warm firelight vignette from edges (~30–50% opacity, centre
  clear); a cold blue centre haze on the board; drifting ember specks. All centre-clear so the grid
  stays legible.

## Effect and animation vocabulary

Blend note: all glow/flame/spark effects composite **`add` on black**. Sheet params are targets the
build scripts consume; timings given per mode. `[ASSUMPTION]` on any easing/duration I did not
measure frame-by-frame — chosen to match the observed feel.

### 1. Reel drop (top-down)
- **trigger:** spin start → reels fill top-to-bottom, snap reel-by-reel left→right with a small
  settle bounce (observations `baseSpin.presentation`).
- **technique:** procedural-PIL / engine transform (no sprite sheet). blend `normal`. no loop.
- **sheet params:** n/a (transform-driven) — `{anchor{x:0.5,y:0}, contentScale:1.0}`.
- **timing/easing:** normal `power2.out` 380ms; quick `power2.out` 240ms; turbo `power1.out` 120ms.
  Settle bounce `back.out(1.6)` on the last 15%; squash 0.92→1.0 on land, no wobble.
- **fallback:** simple ease-out vertical slide per column with 60ms left-to-right stagger.

### 2. Winning-line highlight + symbol clear-burst
- **trigger:** any winning payline resolves — a **gold rectangular outline** traces the winning
  cells, then winning symbols play a caged/wrapped-burst clear overlay before the board resets
  (`08`,`11`,`14`; observations note a "caged/wrapped-burst" clear, NOT a cascade — board resets,
  no refill; [t43], [t33]).
- **technique:** baked sprite-sheet for the burst; procedural-PIL for the gold outline trace. blend
  `add`. no loop (one-shot).
- **sheet params:** `{frames:16, frameWidth:256, frameHeight:256, cols:4, rows:4, fps:30,
  durationMs:530, anchor{x:0.5,y:0.5}, loop:false, contentScale:1.15}`; knobs
  `{cracks:6, particle-size:'small', seed:woods01}`.
- **timing/easing:** outline draw-on `power2.out` 200ms then hold; burst pop `back.out(2.0)` in,
  `power2.in` out. normal 530ms / quick 340ms / turbo 180ms. symbol squash 1.0→1.12→0 on clear.
- **particle spec:** wood splinters + embers, ~10 per cell, lifetime 400ms, gravity +600px/s²,
  palette `#E8681C`,`#FFD24A`,`#5A2A20`.
- **fallback:** gold `#F3B637` 4px rounded-rect stroke pulsing 2× at 6Hz over each winning cell,
  then alpha-fade the symbol.

### 3. Floating win-value callout
- **trigger:** win total resolves → "WIN $X.XX / WINNER" gold text rises under the board; per-line
  "3X [sym] LINE N PAYS $X.XX × M = $Y" notation cycles ([t36],[t54]; `10`,`11`,`14`).
- **technique:** procedural-PIL text render. blend `normal`. no loop.
- **sheet params:** n/a — `{anchor{x:0.5,y:0}, contentScale:1.0}`.
- **timing/easing:** pop-in `back.out(1.7)` 260ms, hold, fade `sine.out` 300ms. count-up on the
  dollar figure `power1.out` scaled to win size. quick ×0.6, turbo ×0.35.
- **fallback:** gold number font, dark outline + soft warm glow, scale 0.8→1.0 on entry.

### 4. Multiplier-wild stack land + glow + apply
- **trigger:** full-reel wild stack lands (cyan medallions 1x/2x/3x/4x bottom-to-top), bright
  flash near the "WILD MULTIPLIER Nx" badge; on respin the stack shifts down and each medallion
  +1x, badge shows top value ([t26],[t28],[t42]; `08`,`15`,`17`).
- **technique:** baked sprite-sheet (medallion land + lens glint) + procedural-PIL glow ring.
  blend `add`. glint loops subtly while displayed.
- **sheet params:** `{frames:20, frameWidth:256, frameHeight:256, cols:5, rows:4, fps:30,
  durationMs:660, anchor{x:0.5,y:0.5}, loop:false, contentScale:1.15}`; badge glow ring
  `{filaments:12, particle-size:'medium', seed:wild07}`.
- **timing/easing:** medallion drop `back.out(1.8)` 300ms; apply-flash `power2.out` 180ms burst;
  shift-down on respin `power2.inOut` 280ms per position. wobble ±4° on land. normal/quick/turbo
  660/420/220ms.
- **particle spec:** cyan glass sparks + gold embers, ~8 per medallion, lifetime 500ms, gravity
  +200px/s², palette `#5CC6E8`,`#F3B637`,`#FFD24A`.
- **fallback:** cyan radial glow behind each medallion pulsing once, gold `Nx` scale-punch 1.0→1.2→1.0.

### 5. Win-tier celebration banner ("NICE!")
- **trigger:** small-to-mid win threshold → full-screen dim, hooded-figures scene, "NICE!" wordmark
  drops onto a blue plaque with the amount, coins rain ([t27],[t30]; `07`,`09`,`10`).
- **technique:** AI image-to-video for the scene backdrop (or baked loop) + baked sprite-sheet for
  the wordmark pop + procedural coin particles. blend `add` for glow, `normal` for scene. coins loop
  until dismiss.
- **sheet params (wordmark):** `{frames:12, frameWidth:512, frameHeight:256, cols:4, rows:3, fps:24,
  durationMs:500, anchor{x:0.5,y:0.5}, loop:false, contentScale:1.0}`.
- **timing/easing:** wordmark `back.out(2.2)` drop 380ms + settle bounce; plaque slide `power2.out`;
  coins spawn over 1.2s. quick/turbo shorten dwell, not the pop.
- **particle spec:** gold star-coins, ~24 total, lifetime 1400ms, gravity +400px/s², slight spin;
  palette `#F3B637`,`#FFD24A`.
- **fallback:** static "NICE!" gold-on-blue plaque + amount, single scale-punch, no coins.

### 6. Anticipation flame column
- **trigger:** a reel is engulfed in a vertical **flame/fire overlay** to tease an incoming wild
  stack or forced scatter reel ([t25],[t49]; middle-reel fire in `08` right side glow).
- **technique:** baked sprite-sheet loop (flame) or procedural-PIL noise flame. blend `add`. loops
  while anticipating.
- **sheet params:** `{frames:24, frameWidth:256, frameHeight:1024, cols:6, rows:4, fps:24,
  durationMs:1000, anchor{x:0.5,y:1.0}, loop:true, contentScale:1.0}`; knobs
  `{particle-size:'large', seed:flame03}`.
- **timing/easing:** hold-loop while reel spins slow; reel slowdown `sine.out` extending stop by
  +40% (normal), +20% (quick), 0 (turbo). flame flicker at 24fps.
- **particle spec:** rising embers, ~14/frame, lifetime 700ms, gravity −300px/s² (buoyant),
  palette `#FFD24A`,`#E8681C`,`#B23530`.
- **fallback:** additive orange gradient rectangle over the reel with a 6Hz alpha flicker.

### 7. Full-screen flame/energy swirl transition
- **trigger:** bigger win / feature transition — a full-screen orange-yellow flame swirl wipes the
  screen (`07`; [t31] "WIN $46.96" behind it, [t51] fiery owl cinematic).
- **technique:** baked sprite-sheet or AI image-to-video. blend `add`. no loop (one-shot wipe).
- **sheet params:** `{frames:30, frameWidth:640, frameHeight:360, cols:6, rows:5, fps:30,
  durationMs:1000, anchor{x:0.5,y:0.5}, loop:false, contentScale:1.2}`; knobs
  `{filaments:20, seed:swirl05}`.
- **timing/easing:** grow `power2.in` cover 500ms, reveal `power2.out` clear 500ms. quick 640ms,
  turbo skipped (instant cut per Skip-Screens).
- **effect palette:** `#FFD24A` core, `#FF9A1E` mid, `#E8601C` edge over dark.
- **fallback:** radial orange-to-yellow additive wipe from centre, ease-in cover then ease-out clear.

### 8. Free-spins portal / intro cinematic
- **trigger:** 3+ scatters (or Buy) → "CONGRATULATIONS — YOU HAVE WON 10 FREE SPINS" over a moonlit
  forest (moon, bats, pines), then a fiery owl-totem cinematic before the round ([t50],[t51];
  `13`,`14`).
- **technique:** AI image-to-video for the cinematic backdrops + baked wordmark pop. blend `normal`
  scene / `add` glow. no loop.
- **sheet params (wordmark):** `{frames:14, frameWidth:1024, frameHeight:256, cols:5, rows:3,
  fps:24, durationMs:580, anchor{x:0.5,y:0.5}, loop:false, contentScale:1.0}`.
- **timing/easing:** "CONGRATULATIONS" arc drop `back.out(1.8)` 460ms; number `back.out(2.4)`
  340ms; hold for "PRESS ANYWHERE". Skip-Screens cuts dwell.
- **effect palette:** cold `#3A55A8` sky + white moon `#EAF2FF`, gold wordmark `#F6C63A`.
- **fallback:** static moonlit-forest still + gold "10 FREE SPINS" text, single scale-in.

### 9. Free-spins outro / completed summary
- **trigger:** last free spin → mantelpiece animal-plaque scene + "FREE SPINS COMPLETED / YOU HAVE
  WON $X IN 10 FREE SPINS", carved wood-plaque banner with torches ([t55],[t56]; `16`,`17`).
- **technique:** baked scene composite + procedural count-up + ember particles. blend `add` glow.
  no loop.
- **timing/easing:** banner rise `power2.out` 400ms; total count-up `power1.out` ~1s; torches
  flicker loop at 12fps.
- **effect palette:** carved-wood `#8A4A20`, gold total `#F6C63A`, torch flame `#FFB03A`.
- **fallback:** static wood banner with final total, single fade-in.

## Render constants

Feed `presentation_config.json`:

```json
{
  "tile_size_ratio": 0.155,
  "col_gap_frac": 0.014,
  "row_gap_frac": 0.016,
  "grid_area_ratio": 0.46,
  "column_divider_alpha": 0.22,
  "grid_overlay": { "hex": "#241634", "alpha": 0.55 },
  "grid_glow": { "hex": "#5CC6E8", "alpha": 0.12 },
  "board_void_hex": "#241634",
  "footer_chrome": {
    "credit_label_hex": "#F3B637",
    "value_hex": "#FFFFFF",
    "win_text_hex": "#F6C63A",
    "panel_hex": "#8A2B2E",
    "panel_edge_hex": "#F2B23A"
  }
}
```
All ratios `[ASSUMPTION]` — estimated from the 5×4 board proportions in `08`/`11`/`17`; tune against
the actual canvas.

## Target build pipeline

**Asset pipeline** — `/Users/namph/Documents/projects/ebisu/slot-machine-game-assets-pipeline/server/pipeline`. Emit WebP assets + JSON atlas sidecars via the
executor recipe / FidelityDoctrine / `_seed_configs.py` contract. Target dirs: `tiles/`, `chrome/`,
`specials/`, `particles/`, `gridBackgrounds/`. Each generation step:
`{recipe, variants:[{logical_name, prompt_suffix, color_mode, aspect_ratio, processor_chain}],
encode:{format:"webp", quality:90}}`.

**Effect-build showcases** — `/Users/namph/Documents/projects/ebisu/slot-showcases`. Use the procedural `gen_*.py` effect scripts +
`demo-sugar-rush/src/render/animation-timings.ts` (timing DB — register the GSAP strings above) +
`asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`,
`winning_text_<tier>.webp`.

**Per-symbol `logical_name` → target filename** (art-maker emits these recipe variants directly):

| engine id | logical_name | target filename |
|---|---|---|
| `bunny` | tile_bunny | `tiles/tile_bunny.webp` |
| `blue-girl` | tile_bluegirl | `tiles/tile_bluegirl.webp` |
| `bear` | tile_bear | `tiles/tile_bear.webp` |
| `deer` | tile_deer | `tiles/tile_deer.webp` |
| `A` | tile_a | `tiles/tile_a.webp` |
| `K` | tile_k | `tiles/tile_k.webp` |
| `Q` | tile_q | `tiles/tile_q.webp` |
| `J` | tile_j | `tiles/tile_j.webp` |
| `10` | tile_10 | `tiles/tile_10.webp` |
| `SCAT` | tile_scatter | `specials/tile_scatter.webp` |
| `WILD` | tile_wild | `specials/tile_wild.webp` (+ `tile_wild_gold.webp` rim variant) |

Chrome / specials / effect assets:

| logical_name | target filename |
|---|---|
| logo_base | `chrome/logo_base.webp` |
| logo_fs | `chrome/logo_fs.webp` |
| grid_frame | `chrome/grid_frame.webp` (RGBA, transparent centre) |
| bg_base | `gridBackgrounds/bg_base.webp` |
| bg_freespins | `gridBackgrounds/bg_freespins.webp` |
| bg_base_sp | `gridBackgrounds/bg_base_sp.webp` |
| bg_freespins_sp | `gridBackgrounds/bg_freespins_sp.webp` |
| spin_button | `chrome/spin_button.webp` |
| multiplier_glyphs | `chrome/spritesheet_multiplier.{webp,json}` |
| digit_sheet | `chrome/spritesheet_digits.{webp,json}` |
| winning_text_nice | `chrome/winning_text_nice.webp` |
| fx_clear_burst | `particles/spritesheet_clearburst.{webp,json}` |
| fx_wild_land | `specials/spritesheet_wildland.{webp,json}` |
| fx_flame_column | `particles/spritesheet_flamecolumn.{webp,json}` |
| fx_swirl | `particles/spritesheet_swirl.{webp,json}` |
| part_splinter / part_ember / part_coin / part_glassshard | `particles/part_*.webp` |

Unobserved / inferred assets (natural free-spins trigger portal, portrait `_sp` layouts, higher
win-tier wordmarks beyond NICE!, the FS logo) are `[ASSUMPTION]` and flagged above — derive from the
closest observed asset, do not treat as ground truth.