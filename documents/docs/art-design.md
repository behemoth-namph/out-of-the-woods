# Out of the Woods — Art Design (Art DNA Contract)

> Downstream contract for the `art-maker` agent. All colours are sampled by eye from the actual
> gameplay frames listed in the brief; values I had to choose for the generator (not measurable
> from pixels) are tagged `[ASSUMPTION]`. Symbol engine ids come from the spec only.

## Theme identity

- **Game name:** Out of the Woods (Pragmatic Play, `vs25bstackwild`)
- **Theme keyword:** dark-comedic woodland escape — four panicked cartoon campers fleeing a haunted
  forest ruled by a carved wooden owl totem. Grimm-fairytale-meets-Saturday-morning-cartoon.
- **tile_style:** `floating` — symbols sit as transparent icons on a dark translucent board panel.
  The board itself is a near-black indigo void (`01-loaded`, `08-wild-multiplier-stack`); royals
  (A/K/Q/J/10) are free-floating carved-object icons with NO card behind them; the four character
  highs get only a thin coloured frame accent (green/blue/red/pink) around the icon, not an opaque
  brick card. So: floating, with a per-high-symbol decorative frame — NOT brick.
- **Mood/tone:** ominous but funny. Warm firelight orange fighting cold purple-magenta forest
  shadow; bug-eyed slapstick terror on every character face. Menacing yet playful, never gory.

## Art DNA

- **Material:** hand-painted 2D cartoon illustration. Thick painterly brush texture on wood and
  fur; soft cel-shaded volumes on characters. Carved-wood surfaces (owl totem, frame, royals'
  props) have visible grain and chisel facets. The multiplier discs are the only glossy/glassy
  surface — polished cyan glass over a crosshair, metal bezel.
- **Lighting:** strong warm key from lower-right (firelight / owl glow), cool magenta-purple fill
  from the forest depth, subtle rim light on character silhouettes. Deep contact shadows under
  props. During huge wins the whole scene gains an extra emissive layer — owl eyes ignite
  (green → cyan, `12-huge-multiplier-chain-15x`, `wintier-sensational`) and blue-cyan flame licks
  up behind the totem.
- **Camera angle:** flat, straight-on storybook framing. Board is head-on; owl totem sits in
  right-hand 3/4 view as a foreground prop.
- **Rendering/finish:** matte painterly with bold dark ink outlines; comic exaggeration on hands,
  eyes, teeth. High local contrast, warm-cool colour clash.
- **Shape_language:** chunky, rounded, top-heavy cartoon forms; jagged pine silhouettes and
  splintered-wood edges for menace; circular owl-eye and disc motifs for the reward beats.
- **Outline treatment:** every symbol and character carries a heavy near-black brown ink contour
  (~3–5px at 256²), plus a coloured inner rim on the character frames.
- **Motifs:** the carved wooden owl totem (glowing eyes), pine-tree silhouettes, ropes & snare
  traps (nooses, deadfall boxes, mousetraps, ladders), campfire flame, wings flanking the logo,
  falling gold coins, hooded cultist onlookers in the celebration scenes.
- **negative (a clone must AVOID):** photoreal wood; clean flat-vector/minimalist icons; bright
  daylight or a cheerful neutral background; horror gore/blood; gemstone or fruit symbols; opaque
  brick tile cards; thin hairline outlines; a cold monochrome palette (the warm/cool clash is core).

## Color palette

Sampled from frames; background reads warm-magenta-to-orange forest, board interior near-black indigo.

| token | hex | sampled from | note |
|---|---|---|---|
| core (owl-wood orange) | `#C8641E` | owl totem body, `01-loaded` | dominant reward hue |
| spark (multiplier orange) | `#F2932A` | disc numerals, `08` | high-lum ~135 |
| bloom (gold-gradient text) | `#F5D24A` | SENSATIONAL fill, `wintier-sensational` | win-text top stop |
| glass-cyan | `#6FD6EE` | multiplier disc glass, `08`/`12` | cool accent |
| eye-glow | `#6ECF3A` → `#3FD0E8` | owl eyes, `wintier-sensational`/`12` | green idle→cyan mega |
| bg (forest magenta) | `#5A2E48` | tree trunks, `01-loaded` | **background-dominant hue** (warm purple-magenta) |
| bg-fire | `#B7401E` | firelight glow behind totem | warm rim |
| board-void | `#241733` | board interior, `07-small-win` | dark indigo, lum ~28 (deliberately dark — grid-read) |
| panel-wood | `#8E3A26` | frame + red UI plaques | reddish-brown |
| panel-edge | `#E0A63A` | gold plaque rim, disc bezel | warm metal edge |

Note: the theme is deliberately dark/moody, so the board interior sits well below the lum≥120
target — that is intentional so the floating symbols read. Symbol colours themselves (character
frames, royal letters) hold saturation ≥50% and stay chromatically distinct from the magenta bg.

## Typography

- **Display font vibe:** chunky hand-drawn comic slab — heavy weight, slight bounce/tilt per glyph,
  aggressive but friendly. Used for the logo and win-tier wordmarks. Fill is a vertical gold
  gradient (`#F7DE5C` top → `#E36A1E` bottom), a thick dark-brown/black stroke (~6% of cap height),
  and a hard drop-shadow offset down-right plus a faint outer glow. See `SENSATIONAL!`, `SUPERB!`,
  `CONGRATULATIONS`.
- **Number font:** same comic family, all-caps/tabular. Win-amount digits are gold-gradient with a
  dark stroke, seated on a blue `#3A4A9E` plaque bound by a rope-lashed wood frame (win-tier
  screens) or plain gold on the footer (`WIN $15.36`).
- **Multiplier glyphs:** rounded bold numerals in orange `#F2932A` with a cream/white bevel, dark
  outline, centred in the cyan glass disc.

## Symbols

Pixel target ~256² each, transparent PNG/WebP, heavy dark ink outline. Gradient stops are
`[offset, hex]` sampled from the frames.

| id | display | subject / silhouette | shape_class | body gradient | sheen | rim/edge | dominant | tier / weight | size× | px | material_note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `rabbit_man` | Rabbit-hood Man | wide-eyed man in grey rabbit-ear hood, green hoodie | ORGANIC | `[[0,#7FBF5A],[1,#2F7B3C]]` | `#C8E89A` | `#1E4A24` | `#3A8C4A` | high / 5 | 1.15 | 256 | framed portrait, green card rim |
| `blue_woman` | Blue-hat Woman | blonde woman, orange cap, blue sequin dress, shocked | ORGANIC | `[[0,#4FA6E0],[1,#1E5FA8]]` | `#BFE4FF` | `#123C6E` | `#2E7FC8` | high / 4 | 1.10 | 256 | framed portrait, blue card rim, sequin sparkle |
| `bear_man` | Red-hat Bear Man | ginger-bearded man, brown bear-fur hat, red plaid shirt | ORGANIC | `[[0,#D0503A],[1,#8A241C]]` | `#F2B49A` | `#5A140F` | `#B83A2A` | high / 3 | 1.05 | 256 | framed portrait, red card rim, plaid texture |
| `deer_girl` | Deer-hood Girl | girl in tan antler/deer hood, pink puffer jacket | ORGANIC | `[[0,#E85AA0],[1,#A5236A]]` | `#FBC2DE` | `#6E1444` | `#C43A7A` | high / 2 | 1.00 | 256 | framed portrait, pink/magenta card rim |
| `ace` | A | purple letter A clamped in a steel mousetrap | ANGULAR | `[[0,#C07AE8],[1,#7A2FB0]]` | `#EAC8FF` | `#3E1466` | `#A24BC8` | low / 2 | 0.92 | 256 | carved letter + grey metal trap prop |
| `king` | K | orange letter K tangled in a rope snare/noose | ANGULAR | `[[0,#EE9A3E],[1,#B85A1E]]` | `#FBD59A` | `#6E320E` | `#D06A2A` | low / 2 | 0.92 | 256 | wood letter + coiled rope |
| `queen` | Q | gold letter Q on a wooden plank | ANGULAR | `[[0,#F2C24A],[1,#C8871E]]` | `#FFE9A6` | `#7A4A0E` | `#E0A82A` | low / 1 | 0.90 | 256 | carved gilt letter on board |
| `jack` | J | blue letter J under a propped deadfall box trap | ANGULAR | `[[0,#4F92E4],[1,#1E52A6]]` | `#BADcFF` | `#123C74` | `#2E6FC8` | low / 1 | 0.90 | 256 | wood-box trap + blue letter |
| `ten` | 10 | red 1-0 on a wooden ladder/snare rack | ANGULAR | `[[0,#E8503A],[1,#A5201A]]` | `#F7A488` | `#5A120E` | `#C8342A` | low / 1 | 0.88 | 256 | carved red numerals on ladder |
| `WILD` | Wild / Multiplier Wild | carved owl on wood tile ("WILD"); multiplier variant = cyan/gold-rim target disc w/ orange ×N | ROUND | disc `[[0,#8FE4F4],[1,#3F9EC0]]` | `#DFF8FF` | rim `#E0A63A` (gold) / `#3F9EC0` (blue) | `#6FD6EE` | high / 5 | 1.20 | 256 | glossy glass disc, crosshair split, metal bezel, orange numeral |
| `SCAT` | Scatter | setting sun over black pine-forest silhouette, in wood frame | GEOMETRIC | sun `[[0,#FFE07A],[1,#F08A1E]]` | `#FFF4C4` | frame `#8E3A26` | `#F0A02A` | scatter / 5 | 1.15 | 256 | radial sun disc, dark treeline, wooden frame |

## Background

- **Composition:** central ~60% is the dark indigo board void (lum ~28–45) so floating symbols
  read; decorative warm-magenta forest with fire glow fills the edges. A carved owl totem stands
  as a right-side foreground prop; the wooden rope-lashed reel frame with red winged crest brackets
  the top. Left edge carries the vertical UI plaques.
- **Base background:** magenta-purple forest interior, warm orange firelight from lower-right,
  jagged pine silhouettes, Venus-flytrap and undergrowth props along the bottom (`01`/`17`).
- **Free-spins variant (`_fs`):** cooler, richer night — deep blue moonlit sky, white full moon,
  bats, near-black pine silhouettes (`13-freespins-intro`); the in-feature board keeps the same
  frame but the ambient darkens and the owl eyes/flame run hotter (`14-freespins-outro`).
- **Portrait `_sp` variant:** [ASSUMPTION] not captured in play (all frames landscape) — generate a
  9:16 recompose that stacks logo band → board → controls, reusing the same palette; do not invent
  new scene content.
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16) `[ASSUMPTION]` on exact numbers.
- **Zone/overlay map:** logo band (top ~0–14%, winged "OUT OF THE WOODS" crest) → board
  (~center, 5 cols × 4 rows inside wood frame, ~18–86% width) → win/callout area (overlays board
  center + footer "WIN $…") → controls band (bottom ~88–100%: menu/info/history, bet ±, spin,
  autoplay) → left plaque column (Buy Feature / Special Bets).

## Grid frame

- **Material:** rough-hewn reddish-brown timber (`#8E3A26`) lashed with pale rope at every joint;
  splintered chips and knots; a red winged wooden crest across the top rail behind the logo,
  vertical corner posts, a lower cross-beam bearing the credit/bet readout.
- **Ornament:** rope wraps, iron nail heads, wood-grain gouges; owl totem as detached right-side
  prop (not part of the border RGBA — render separately).
- **Border spec:** RGBA frame with a fully transparent rectangular centre void (the board void
  shows through). Keep each side ≤6% of canvas. Colours: timber `#8E3A26`→`#5A2418` grain, rope
  `#D8C39A`, nails `#3A2A22`.

## Logo

- **Base:** "OUT OF THE / WOODS" — "OUT OF THE" in a small blue-outlined banner; "WOODS" huge in
  carved orange-gold wood letters (`#E8912A` fill, `#F5C24A` top bevel) with a bright cyan-blue
  outline (`#3AA6D8`) and dark drop-shadow. Two spread red-orange feathered wings flank it; small
  blue flame/steam wisps rise off the top edge. Rendered on transparent.
- **Free-spins `_fs` variant:** same lettering re-skinned fully golden (drop the blue outline for a
  warm gold/amber contour), heavier glow. Render ~1024×512 on a white matte for compositing.

## Particles

Fragments a shattering symbol would throw (theme-specific):

1. **Wood splinters** — sharp tan/brown grain shards (`#B87838` / `#6E3A1E`).
2. **Gold coins** — spinning discs with a rune/star face (`#F2B429` / `#E08A1E`), seen raining in
   every win-tier screen.
3. **Ember/flame flecks** — warm orange-yellow sparks with additive glow (`#FFB43A`).
4. **Pine-needle / leaf bits** — small dark-green blade flecks (`#3A7B3C`) from the forest motif.

## UI chrome

- **Spin button:** circular dark base-plate disc (~256²) with a light outer ring; icon = two
  curved chasing arrows around a small feather (`01`/`17`). Stop-state swaps to a red rounded
  square inside the ring (`13`/`16`). Plate `#2A2320`, ring `#D8D2C8`, arrows white.
- **Digit / letter / multiplier glyph sheets (512² cells):** comic gold-gradient digits 0–9 & `$`
  `.` `,` for win counters; multiplier numerals in orange `#F2932A` bevel for the discs; letters
  for tier wordmarks. Multiplier disc bezel comes in blue (`#3F9EC0`, inactive) and gold
  (`#E0A63A`, active/golden-rim) variants.
- **Win-tier wordmarks:** `NICE`, `SUPERB`, `MEGA`, `SENSATIONAL` — chunky gold-gradient comic caps
  with dark stroke + drop-shadow, on the blue rope-framed amount plaque. Escalating scene art
  behind (cabin/trophy for SUPERB, fiery owl throne for SENSATIONAL).
- **Payout panel frame + item:** dark rounded modal with white centred title, symbol thumbnails
  over 3/4/5 pay rows (`paytable-1`); left UI plaques are red rope-lashed wood signs
  ("BUY FEATURE — 2 OPTIONS", "SPECIAL BETS"); active feature plaques get a gold-lashed rim.
- **Ambient overlay layers:** soft warm firelight vignette and a cool magenta forest-depth haze
  (~30–60% opacity, centre-clear so the board stays legible); a stronger blue-cyan glow layer that
  fades in during mega/huge wins.

## Effect and animation vocabulary

Cite: `07-small-win` (line-win frame highlight + smoke puff), `08`/`09`/`12`/`17` (multiplier
disc land + glow), `wintier-*` (tier banner + coin rain), `13`/`14` (free-spins portal),
play-log `[t28]` smoke-puff burst, `[t30]` auto-respin stack shift, `[t37]/[t51]/[t56]/[t68]`
tier banners, `[t60]/[t61]` owl-eye + ambient escalation, `[t41]` turbo motion-blur drop.

### 1. Reel drop (top-down)
- trigger: every spin start/stop. technique: **procedural-PIL** blur + GSAP transform. blend
  `normal`. loop: no.
- sheet: `{frames:1, frameWidth:256, frameHeight:256, cols:1, rows:1, fps:0, durationMs:420,
  anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` (motion is transform-driven; `[t41]`
  vertical motion-blur streak on fast drop).
- timing `{normal:"back.out(1.4)" 420ms, quick:"back.out(1.6)" 260ms, turbo:"power2.out" 140ms}`;
  squash 0.90×1.10 on land, settle wobble ±3px.
- fallback: vertical translate with per-symbol 40ms stagger, motion-blur streak while v>threshold.

### 2. Line-win frame highlight + smoke puff (`07-small-win`, `[t28]`)
- trigger: a payline win resolves. technique: **baked sprite-sheet** glow border + **procedural-PIL**
  smoke. blend `add` for the gold-orange outline glow. loop: yes (pulse) until next action.
- sheet: `{frames:16, frameWidth:256, frameHeight:256, cols:4, rows:4, fps:24, durationMs:666,
  anchor:{x:0.5,y:1.0}, loop:true, contentScale:1.15}`; knobs `{glowWidth:6px, puffCount:5,
  particleSize:14, seed:71}`.
- timing `{normal:"sine.out" 300ms in / 666ms loop, quick:220ms, turbo:120ms}`; winning symbols
  pulse-scale 1.0→1.08→1.0.
- particle: 5 grey smoke puffs at symbol base, lifetime 500ms, gravity −20 (rise), fade to 0.
- palette: outline `#F5B02A`→`#E8791E` add-glow; smoke `#B7ADA0` @ 55%.
- fallback: draw a rounded gold-glow rectangle (2 stacked strokes, outer at 35% alpha) around
  winning cells + 5 code-drawn smoke ellipses rising and fading.

### 3. Floating win-value callout (`WIN $15.36`, `[t30]/[t57]`)
- trigger: win total resolves; rolls up live during respin chains. technique: **procedural-PIL**
  text + GSAP count-up. blend `normal`. loop: no.
- gold-gradient digits with dark stroke; `{durationMs:900 rollup, anchor:{x:0.5,y:0.5}}`.
- timing `{normal:"power1.out" 900ms, quick:600ms, turbo:300ms}`; pop-in scale 0.6→1.15→1.0
  `back.out(2.0)`.
- fallback: tween the numeric value, redraw the gold string each frame with a scale-pop on land.

### 4. Multiplier Wild disc land + glow + apply (`08`/`12`/`17`, `[t29]/[t30]/[t61]`)
- trigger: a full-reel Multiplier Wild stack lands, then each auto-respin shifts it down +1×.
  technique: **baked sprite-sheet** (glass disc + bezel) + **procedural-PIL** glow. blend `add`
  for the cyan halo. loop: yes (idle shimmer).
- sheet: `{frames:24, frameWidth:256, frameHeight:256, cols:6, rows:4, fps:30, durationMs:800,
  anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.2}`; knobs `{bezelMode:"blue|gold",
  crackle:0, filaments:6, particleSize:10, seed:44}`.
- timing: land `{normal:"back.out(1.7)" 500ms, quick:320ms, turbo:160ms}`; respin shift-down
  `power2.inOut` 380ms; golden-rim active disc pulses `sine.inOut` 900ms loop. squash 0.88×1.12 on
  land. The right-side "WILD MULTIPLIER ×N" badge scales-pop and updates each respin.
- particle: cyan sparks orbiting the active (gold-rim) disc, per-cell 6, lifetime 700ms, gravity 0.
- palette: glass `#8FE4F4`→`#3F9EC0`, bezel gold `#E0A63A` / blue `#3F9EC0`, numeral `#F2932A`,
  halo `#6FD6EE` add.
- fallback: draw a radial cyan glass circle + crosshair split, metal ring (blue or gold), orange
  bevelled numeral; pulse alpha of an additive halo ring.

### 5. Win-tier escalation banner + coin rain (`wintier-nice/superb/sensational/mega`, `[t37]/[t51]/[t56]/[t68]`)
- trigger: win crosses a tier threshold (NICE ~2× < SUPERB ~5× < MEGA ~20× < SENSATIONAL ~17×+;
  ordering approximate). Tier locks at trigger, counter rolls up under it. technique: **AI
  image-to-video** for the scene backdrop + **baked sprite-sheet** wordmark + **procedural-PIL**
  coins. blend `add` on flame/sparkle. loop: coins loop until dismiss.
- wordmark sheet: `{frames:12, frameWidth:1024, frameHeight:512, cols:4, rows:3, fps:24,
  durationMs:500, anchor:{x:0.5,y:0.45}, loop:false, contentScale:1.0}`.
- timing: banner slam-in `{normal:"back.out(1.8)" 500ms, quick:340ms, turbo:180ms}`; wordmark
  overshoot scale 0.5→1.12→1.0; amount plaque fades in +120ms.
- particle: gold rune-coins, per-burst 30–60, lifetime 1600ms, gravity +90, spin, spawn from top
  edge (`wintier-sensational` shows dense fall).
- palette: text `#F5D24A`→`#E36A1E`, plaque `#3A4A9E`, coins `#F2B429`, fire bg `#B7401E`.
- fallback: draw the tier caps in gold-gradient + dark stroke on a blue plaque; emit code-drawn
  falling coin ellipses.

### 6. Owl-eye / ambient huge-win escalation (`12`, `wintier-sensational`, `[t60]/[t61]`)
- trigger: very large running total during a respin chain. technique: **procedural-PIL** additive
  glow layers. blend `add`. loop: yes while active.
- owl eyes ramp green `#6ECF3A` → cyan `#3FD0E8`; blue-cyan flame rises behind totem; background
  behind trees shifts to blue-purple glow.
- timing: `sine.inOut` 1200ms loop breathing; intensity mapped to win magnitude.
- fallback: composite two additive radial glows over the eye positions + a soft blue vignette that
  fades up with the win multiple.

### 7. Free-spins portal / intro-outro (`13-freespins-intro`, `14-freespins-outro`, `[t51-59]`)
- trigger: 3/4/5 scatters. technique: **AI image-to-video** transition to the night-forest scene +
  **baked sprite-sheet** "CONGRATULATIONS / 10 FREE SPINS" text. blend `normal` (moon glow `add`).
  loop: no.
- transition: crossfade board → moonlit blue forest, moon bloom, bats drift; text drops in
  `back.out(1.5)` 600ms. Outro shows a wooden trophy-cabin tally board with the total.
- fallback: fade to the `_fs` night background, draw the comic gold count text with a scale-pop.

### 8. Anticipation slowdown `[ASSUMPTION]`
- Not distinctly captured (turbo/auto masked it). If used: last-reel drop eases `power3.out` at
  ~1.8× duration with a subtle screen-desat + owl-eye flicker. Mark generated-not-observed.

## Render constants

Feed `presentation_config.json`:

```json
{
  "tile_size_ratio": 0.185,
  "col_gap_frac": 0.012,
  "row_gap_frac": 0.014,
  "grid_area_ratio": 0.62,
  "grid_cols": 5,
  "grid_rows": 4,
  "column_divider_alpha": 0.22,
  "grid_overlay": { "hex": "#241733", "alpha": 0.55 },
  "grid_glow": { "hex": "#6FD6EE", "alpha": 0.20 },
  "board_void_hex": "#241733",
  "footer_chrome": { "bg": "#1E1712", "text": "#F5D24A", "label": "#E0A63A" },
  "frame_wood_hex": "#8E3A26",
  "panel_edge_hex": "#E0A63A"
}
```
Values are `[ASSUMPTION]` on exact ratios (measured by eye from `01-loaded`/`17-final-idle`).

## Target build pipeline

**Asset pipeline** — `/Users/namph/Documents/projects/ebisu/slot-machine-game-assets-pipeline/server/pipeline`
(executor recipe / FidelityDoctrine / `_seed_configs.py`): emit WebP assets + JSON atlas sidecars.
Target dirs: `tiles/` (symbols), `chrome/` (frame, plaques, spin button, wordmarks),
`specials/` (multiplier disc, owl totem, logo), `particles/`, `gridBackgrounds/`.

Per-step generation config shape:
```json
{
  "recipe": "cartoon-painterly-woodland",
  "variants": [
    { "logical_name": "...", "prompt_suffix": "...", "color_mode": "rgba",
      "aspect_ratio": "1:1", "processor_chain": ["bg_remove","ink_outline","trim_pad"] }
  ],
  "encode": { "format": "webp", "quality": 90 }
}
```

**Effect-build showcases** — `/Users/namph/Documents/projects/ebisu/slot-showcases`: procedural
`gen_*.py` effect scripts + `demo-sugar-rush/src/render/animation-timings.ts` (timing DB) +
`asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`,
`winning_text_<tier>.webp`.

**Per-symbol `logical_name` → target filename** (emit recipe variants directly):

| engine id | logical_name | filename |
|---|---|---|
| `rabbit_man` | rabbit_hood_man | `tile_rabbit_man.webp` |
| `blue_woman` | blue_hat_woman | `tile_blue_woman.webp` |
| `bear_man` | bear_hat_man | `tile_bear_man.webp` |
| `deer_girl` | deer_hood_girl | `tile_deer_girl.webp` |
| `ace` | royal_ace_mousetrap | `tile_ace.webp` |
| `king` | royal_king_snare | `tile_king.webp` |
| `queen` | royal_queen_plank | `tile_queen.webp` |
| `jack` | royal_jack_deadfall | `tile_jack.webp` |
| `ten` | royal_ten_ladder | `tile_ten.webp` |
| `WILD` | multiplier_wild_disc | `tile_wild.webp` (+ `tile_wild_owl.webp`, bezel variants `_blue`/`_gold`) |
| `SCAT` | scatter_sun_forest | `tile_scatter.webp` |

Effect / chrome outputs: `spritesheet_line_win_glow.{webp,json}`, `spritesheet_mult_disc.{webp,json}`,
`spritesheet_reel_drop.{webp,json}`, `winning_text_nice.webp`, `winning_text_superb.webp`,
`winning_text_mega.webp`, `winning_text_sensational.webp`, `chrome_frame.webp`,
`chrome_spin_button.webp`, `specials_owl_totem.webp`, `specials_logo.webp`, `specials_logo_fs.webp`,
`gridBackgrounds/bg_base.webp`, `gridBackgrounds/bg_fs.webp`, `gridBackgrounds/bg_base_sp.webp`.