// The 5×4 reel board, rendered with Pixi sprites and animated with GSAP.
// Implements the presentation cues from docs/presentation-and-feel.md:
//  - spin_start / board_fill: reels blur into motion, stop reel-by-reel L→R
//  - stack_shift: held wild stacks visibly slide down one row on respins
//  - line_evaluate: gold-outline trace + sparkle particles + symbol pop
//  - anticipation: flame column with rising ember particles
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import gsap from "gsap";
import type { Board, Cell, WinningLine } from "../game/types";
import { REELS, ROWS, type SymbolId } from "../game/types";
import type { GameTextures } from "./assets";
import { COLORS, FONT, titleStyle, vGrad } from "./theme";
import { clearChildren } from "./util";

export const CELL = 176;
export const GAP = 12;
const PAD = 16;
const STEP = CELL + GAP;

export const BOARD_W = REELS * CELL + (REELS - 1) * GAP + PAD * 2; // 960
export const BOARD_H = ROWS * CELL + (ROWS - 1) * GAP + PAD * 2; // 772
const FRAME_PAD = 40;
export const FRAME_W = BOARD_W + FRAME_PAD * 2;
export const FRAME_H = BOARD_H + FRAME_PAD * 2;

// symbols shown on the blurred spin strips (no wild/scatter teases)
const STRIP_SYMS: SymbolId[] = ["A", "K", "Q", "J", "10", "bunny", "bear", "deer", "blue-girl"];

interface CellView {
  root: Container;
  sprite: Sprite;
  nx: Text;
  hi: Graphics;
  dimmed: boolean;
}

const key = (r: number, c: number) => `${r}-${c}`;

/** Board container whose pivot is its centre, so PixiGame can place it by centre. */
export class BoardView {
  readonly view = new Container();
  private reels: Container[] = [];
  private cells: CellView[][] = []; // [row][reel]
  private flameLayer = new Container();
  private fxLayer = new Container(); // win sparkles, above the reels
  private strips: Container[] = []; // blurred spin strips, one per reel
  private stripTex: Texture[] = [];
  private spinCalls: gsap.core.Tween[] = [];
  private tex: GameTextures;
  private hiTween?: gsap.core.Tween;
  private hiKey = "";

  constructor(tex: GameTextures) {
    this.tex = tex;
    for (const s of STRIP_SYMS) {
      const t = tex.tiles[s];
      if (t) this.stripTex.push(t);
    }
    this.build();
  }

  private build() {
    // wooden frame — generated art when available, else procedural
    if (this.tex.gridFrame) {
      this.addGridFrameSprite(this.tex.gridFrame);
    } else {
      const frame = new Graphics();
      frame.roundRect(0, 0, FRAME_W, FRAME_H, 22).fill(vGrad(0, 0, FRAME_W, FRAME_H, 0x5a2a20, 0x3a1712));
      frame.roundRect(0, 0, FRAME_W, FRAME_H, 22).stroke({ width: 6, color: 0x2a1008, alignment: 1 });
      frame.roundRect(7, 7, FRAME_W - 14, FRAME_H - 14, 16).stroke({ width: 6, color: 0x7a3a26, alpha: 0.8 });
      this.view.addChild(frame);
    }

    // board void
    const void_ = new Graphics();
    void_
      .roundRect(FRAME_PAD, FRAME_PAD, BOARD_W, BOARD_H, 14)
      .fill(vGrad(0, FRAME_PAD, BOARD_W, BOARD_H, 0x2a1a3c, 0x1c1128));
    this.view.addChild(void_);

    // reels container (masked)
    const reelsRoot = new Container();
    reelsRoot.position.set(FRAME_PAD + PAD, FRAME_PAD + PAD);
    const mask = new Graphics()
      .rect(FRAME_PAD + PAD, FRAME_PAD + PAD, BOARD_W - PAD * 2, BOARD_H - PAD * 2)
      .fill(0xffffff);
    this.view.addChild(mask);
    reelsRoot.mask = mask;
    this.view.addChild(reelsRoot);

    for (let c = 0; c < REELS; c++) {
      const reel = new Container();
      reel.position.set(c * STEP, 0);
      this.reels.push(reel);
      reelsRoot.addChild(reel);
    }
    for (let r = 0; r < ROWS; r++) {
      this.cells[r] = [];
      for (let c = 0; c < REELS; c++) {
        const cell = this.makeCell();
        cell.root.position.set(0, r * STEP);
        this.reels[c].addChild(cell.root);
        this.cells[r][c] = cell;
      }
    }

    // spin strips sit above the settled cells, inside the same mask
    for (let c = 0; c < REELS; c++) {
      const strip = new Container();
      strip.position.set(c * STEP, 0);
      strip.visible = false;
      this.strips.push(strip);
      reelsRoot.addChild(strip);
    }

    this.flameLayer.position.set(FRAME_PAD + PAD, FRAME_PAD + PAD);
    this.view.addChild(this.flameLayer);
    this.fxLayer.position.set(FRAME_PAD + PAD, FRAME_PAD + PAD);
    this.view.addChild(this.fxLayer);

    // centre pivot
    this.view.pivot.set(FRAME_W / 2, FRAME_H / 2);
  }

  // Interior void of the generated grid_frame art, as fractions of its own size
  // (measured from public/assets/chrome/grid_frame.webp). Used to place the
  // sprite so its wooden void aligns with the board's play area.
  private static readonly GF_VOID = { l: 0.043, r: 0.949, t: 0.128, b: 0.896 };

  private addGridFrameSprite(tex: Texture) {
    const V = BoardView.GF_VOID;
    const voidWFrac = V.r - V.l;
    const voidHFrac = V.b - V.t;
    const voidCx = (V.l + V.r) / 2;
    const voidCy = (V.t + V.b) / 2;
    const sp = new Sprite(tex);
    sp.anchor.set(0.5);
    // "cover" scale so the art's void fully contains the board void in both axes
    const sc = Math.max(BOARD_W / voidWFrac / tex.width, BOARD_H / voidHFrac / tex.height);
    sp.scale.set(sc);
    const dispW = tex.width * sc;
    const dispH = tex.height * sc;
    // board-void centre == frame centre; offset so the art's void centre lands there
    sp.position.set(FRAME_W / 2 + (0.5 - voidCx) * dispW, FRAME_H / 2 + (0.5 - voidCy) * dispH);
    this.view.addChild(sp);
  }

  private makeCell(): CellView {
    const root = new Container();
    const sprite = new Sprite();
    sprite.anchor.set(0.5);
    sprite.position.set(CELL / 2, CELL / 2);
    const nx = new Text({ text: "", style: titleStyle(48, COLORS.sparkGold) });
    nx.anchor.set(0.5);
    nx.position.set(CELL / 2, CELL / 2 + 4);
    nx.visible = false;
    const hi = new Graphics();
    hi.roundRect(-CELL / 2 + 3, -CELL / 2 + 3, CELL - 6, CELL - 6, 12).stroke({ width: 6, color: COLORS.sparkGold });
    hi.position.set(CELL / 2, CELL / 2); // centred, so it can pulse from the middle
    hi.visible = false;
    root.addChild(sprite, nx, hi);
    return { root, sprite, nx, hi, dimmed: false };
  }

  private texFor(cell: Cell): Texture | null {
    if (cell.sym === "wild") {
      // docs/art-design.md: every reel wild is the cyan multiplier medallion,
      // 1×–10×, each carrying its Nx numeral. The bottom-row "jump" wild uses
      // the gold-ring variant. (The owl totem lives in chrome, not on the reel.)
      const medallion = cell.gold ? this.tex.wildMultiplierGold : this.tex.wildMultiplier;
      return medallion ?? this.tex.wildMultiplier ?? this.tex.tiles.wild ?? null;
    }
    return this.tex.tiles[cell.sym] ?? null;
  }

  private paintCell(cv: CellView, cell: Cell) {
    const tex = this.texFor(cell);
    if (tex) {
      cv.sprite.texture = tex;
      cv.sprite.visible = true;
      const s = Math.min(CELL / tex.width, CELL / tex.height);
      // don't clobber a running win-pop tween on the sprite scale
      if (!gsap.isTweening(cv.sprite.scale)) cv.sprite.scale.set(s);
    } else {
      cv.sprite.visible = false;
    }
    // Every reel wild is a multiplier medallion carrying its Nx numeral (incl 1×).
    if (cell.sym === "wild") {
      cv.nx.visible = true;
      cv.nx.text = `${cell.mult ?? 1}x`;
    } else {
      cv.nx.visible = false;
    }
  }

  /** Paint the board; on spins animate reel blur + L→R stops, held stacks shift down. */
  render(board: Board, heldReels: number[], animate: boolean, speed: number) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < REELS; c++) {
        const cell = board[r]?.[c];
        if (cell) this.paintCell(this.cells[r][c], cell);
      }
    }
    if (!animate) return;
    this.killSpin();
    const isRespin = heldReels.length > 0;
    for (let c = 0; c < REELS; c++) {
      if (heldReels.includes(c)) this.shiftHeldReel(c, speed);
      else this.spinReel(c, speed, isRespin);
    }
  }

  /** Stop any in-flight spin strips / pending reel stops (new spin or teardown). */
  private killSpin() {
    for (const call of this.spinCalls) call.kill();
    this.spinCalls = [];
    for (const strip of this.strips) {
      gsap.killTweensOf(strip);
      strip.visible = false;
    }
  }

  /** Rebuild a strip with random blurred symbols covering the mask + overshoot. */
  private buildStrip(strip: Container) {
    clearChildren(strip);
    for (let i = -2; i <= ROWS; i++) {
      const cy = i * STEP + CELL / 2;
      if (this.stripTex.length) {
        const t = this.stripTex[gsap.utils.random(0, this.stripTex.length - 1, 1)];
        const sp = new Sprite(t);
        sp.anchor.set(0.5);
        const s = Math.min(CELL / t.width, CELL / t.height);
        sp.scale.set(s * 0.96, s * 1.5); // vertical stretch reads as motion blur
        sp.alpha = 0.55;
        sp.position.set(CELL / 2, cy);
        strip.addChild(sp);
      } else {
        const g = new Graphics()
          .roundRect(8, cy - CELL / 2 + 8, CELL - 16, CELL - 16, 14)
          .fill({ color: 0x3a2450, alpha: 0.8 });
        strip.addChild(g);
      }
    }
  }

  /** spin_start/board_fill: blur strip scrolls, then the reel lands (L→R stagger). */
  private spinReel(c: number, speed: number, isRespin: boolean) {
    const strip = this.strips[c];
    this.buildStrip(strip);
    strip.visible = true;
    for (let r = 0; r < ROWS; r++) this.cells[r][c].root.visible = false;
    gsap.fromTo(strip, { y: 0 }, { y: STEP, duration: 0.08, ease: "none", repeat: -1 });
    const lead = ((isRespin ? 0.1 : 0.2) + c * (isRespin ? 0.06 : 0.1)) * speed;
    this.spinCalls.push(gsap.delayedCall(lead, () => this.landReel(c, speed)));
  }

  private landReel(c: number, speed: number) {
    const strip = this.strips[c];
    gsap.killTweensOf(strip);
    strip.visible = false;
    const drop = 0.3 * speed;
    for (let r = 0; r < ROWS; r++) {
      const cv = this.cells[r][c];
      cv.root.visible = true;
      const delay = r * 0.03 * speed;
      gsap.fromTo(
        cv.root,
        { y: r * STEP - 110, alpha: 0 },
        { y: r * STEP, alpha: 1, duration: drop, ease: "back.out(1.6)", delay, overwrite: true }
      );
      gsap.fromTo(
        cv.root.scale,
        { x: 0.92, y: 0.92 },
        { x: 1, y: 1, duration: drop, ease: "back.out(1.6)", delay, overwrite: true }
      );
    }
  }

  /** stack_shift: a held wild stack visibly slides down one row into place. */
  private shiftHeldReel(c: number, speed: number) {
    for (let r = 0; r < ROWS; r++) {
      const cv = this.cells[r][c];
      cv.root.visible = true;
      cv.root.alpha = 1;
    }
    gsap.fromTo(this.reels[c], { y: -STEP }, { y: 0, duration: 0.46 * speed, ease: "back.out(1.2)", overwrite: true });
  }

  /** Highlight winning cells (gold trace + sparkles + symbol pop), dim the rest. */
  highlight(lines: WinningLine[]) {
    const winSet = new Set<string>();
    for (const l of lines) for (const [r, c] of l.cells) winSet.add(key(r, c));
    if (!winSet.size) {
      this.clearHighlight();
      return;
    }
    const k = [...winSet].sort().join("|");
    if (k === this.hiKey) return; // same win still showing — keep tweens alive
    this.hiKey = k;

    this.hiTween?.kill();
    clearChildren(this.fxLayer);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < REELS; c++) {
        const cv = this.cells[r][c];
        const isWin = winSet.has(key(r, c));
        cv.hi.visible = isWin;
        cv.hi.scale.set(1);
        cv.root.alpha = isWin ? 1 : 0.32;
        if (isWin) {
          // symbol pop under the gold trace
          const base = Math.min(CELL / cv.sprite.texture.width, CELL / cv.sprite.texture.height);
          gsap.killTweensOf(cv.sprite.scale);
          gsap.fromTo(
            cv.sprite.scale,
            { x: base, y: base },
            { x: base * 1.12, y: base * 1.12, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" }
          );
          this.spawnSparkles(r, c);
        }
      }
    }
    const his = this.cells.flat().filter((cv) => cv.hi.visible).map((cv) => cv.hi);
    his.forEach((h) => (h.alpha = 0.55));
    this.hiTween = gsap.to(his, { alpha: 1, duration: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }

  private spawnSparkles(r: number, c: number) {
    for (let i = 0; i < 3; i++) {
      const sp = new Text({
        text: "✦",
        style: new TextStyle({ fontFamily: FONT, fontSize: 34, fill: 0xffe9a0 }),
      });
      sp.anchor.set(0.5);
      sp.blendMode = "add";
      sp.position.set(c * STEP + gsap.utils.random(24, CELL - 24), r * STEP + gsap.utils.random(24, CELL - 24));
      sp.alpha = 0;
      sp.scale.set(gsap.utils.random(0.5, 1));
      this.fxLayer.addChild(sp);
      gsap.to(sp, {
        alpha: 1,
        duration: gsap.utils.random(0.25, 0.55),
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 0.6),
        ease: "sine.inOut",
      });
      gsap.to(sp, { rotation: Math.PI * 2, duration: gsap.utils.random(2, 4), repeat: -1, ease: "none" });
    }
  }

  clearHighlight() {
    if (!this.hiKey) return;
    this.hiKey = "";
    this.hiTween?.kill();
    clearChildren(this.fxLayer);
    for (const row of this.cells) for (const cv of row) {
      cv.hi.visible = false;
      cv.root.alpha = 1;
    }
  }

  private flameKey = "";
  /** Anticipation flame column with rising embers over the teased reel(s). */
  setFlames(reels: number[]) {
    const key = reels.join(",");
    if (key === this.flameKey) return; // avoid rebuilding (and leaking tweens) every update
    this.flameKey = key;
    clearChildren(this.flameLayer);
    const innerH = BOARD_H - PAD * 2;
    for (const c of reels) {
      const g = new Graphics();
      g.rect(0, 0, CELL, innerH).fill(vGrad(0, 0, CELL, BOARD_H, 0xffb040, 0xe8681c));
      g.position.set(c * STEP, 0);
      g.alpha = 0.55;
      g.blendMode = "add";
      this.flameLayer.addChild(g);
      gsap.to(g, { alpha: 0.85, duration: 0.12, repeat: -1, yoyo: true });

      for (let i = 0; i < 6; i++) {
        const e = new Graphics().circle(0, 0, gsap.utils.random(4, 9)).fill({ color: 0xffd24a, alpha: 0.9 });
        e.blendMode = "add";
        const x0 = c * STEP + gsap.utils.random(20, CELL - 20);
        e.position.set(x0, innerH);
        this.flameLayer.addChild(e);
        gsap.fromTo(
          e,
          { y: innerH + 20, alpha: 0.9 },
          { y: -30, alpha: 0, duration: gsap.utils.random(0.7, 1.3), repeat: -1, ease: "power1.out", delay: gsap.utils.random(0, 1) }
        );
        gsap.to(e, { x: x0 + gsap.utils.random(-28, 28), duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
    }
  }

  /** Kill non-display-object tweens (delayed reel stops) before teardown. */
  dispose() {
    this.killSpin();
  }
}
