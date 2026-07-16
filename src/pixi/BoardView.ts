// The 5×4 reel board, rendered with Pixi sprites and animated with GSAP.
import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import gsap from "gsap";
import type { Board, Cell, WinningLine } from "../game/types";
import { REELS, ROWS } from "../game/types";
import type { GameTextures } from "./assets";
import { COLORS, titleStyle, vGrad } from "./theme";
import { clearChildren } from "./util";

export const CELL = 176;
export const GAP = 12;
const PAD = 16;

export const BOARD_W = REELS * CELL + (REELS - 1) * GAP + PAD * 2; // 960
export const BOARD_H = ROWS * CELL + (ROWS - 1) * GAP + PAD * 2; // 772
const FRAME_PAD = 40;
export const FRAME_W = BOARD_W + FRAME_PAD * 2;
export const FRAME_H = BOARD_H + FRAME_PAD * 2;

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
  private tex: GameTextures;
  private hiTween?: gsap.core.Tween;

  constructor(tex: GameTextures) {
    this.tex = tex;
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
      reel.position.set(c * (CELL + GAP), 0);
      this.reels.push(reel);
      reelsRoot.addChild(reel);
    }
    for (let r = 0; r < ROWS; r++) {
      this.cells[r] = [];
      for (let c = 0; c < REELS; c++) {
        const cell = this.makeCell();
        cell.root.position.set(0, r * (CELL + GAP));
        this.reels[c].addChild(cell.root);
        this.cells[r][c] = cell;
      }
    }

    this.flameLayer.position.set(FRAME_PAD + PAD, FRAME_PAD + PAD);
    this.view.addChild(this.flameLayer);

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
    hi.roundRect(3, 3, CELL - 6, CELL - 6, 12).stroke({ width: 6, color: COLORS.sparkGold });
    hi.visible = false;
    root.addChild(sprite, nx, hi);
    return { root, sprite, nx, hi, dimmed: false };
  }

  private texFor(cell: Cell): Texture | null {
    if (cell.sym === "wild") {
      // mult >= 2 → the cyan multiplier medallion (carries the live Nx numeral);
      // otherwise the plain owl WILD (gold-rimmed owl on a jump trigger).
      if ((cell.mult ?? 1) >= 2) return this.tex.wildMultiplier ?? this.tex.wild ?? null;
      return (cell.gold ? this.tex.wildGold : this.tex.wild) ?? this.tex.wild ?? null;
    }
    return this.tex.tiles[cell.sym] ?? null;
  }

  private paintCell(cv: CellView, cell: Cell) {
    const tex = this.texFor(cell);
    if (tex) {
      cv.sprite.texture = tex;
      cv.sprite.visible = true;
      const s = Math.min(CELL / tex.width, CELL / tex.height);
      cv.sprite.scale.set(s);
    } else {
      cv.sprite.visible = false;
    }
    // Only the multiplier medallion (mult >= 2) shows the Nx numeral; the plain
    // owl WILD carries its own baked-in "WILD" lettering and no number.
    if (cell.sym === "wild" && (cell.mult ?? 1) >= 2) {
      cv.nx.visible = true;
      cv.nx.text = `${cell.mult}x`;
    } else {
      cv.nx.visible = false;
    }
  }

  /** Paint the board and animate reel drops for non-held reels. */
  render(board: Board, heldReels: number[], animate: boolean, speed: number) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < REELS; c++) {
        const cell = board[r]?.[c];
        if (cell) this.paintCell(this.cells[r][c], cell);
      }
    }
    if (!animate) return;
    const drop = 0.34 * speed;
    for (let c = 0; c < REELS; c++) {
      if (heldReels.includes(c)) continue;
      for (let r = 0; r < ROWS; r++) {
        const cv = this.cells[r][c];
        gsap.fromTo(
          cv.root,
          { y: r * (CELL + GAP) - 90, alpha: 0 },
          {
            y: r * (CELL + GAP),
            alpha: 1,
            duration: drop,
            ease: "back.out(1.5)",
            delay: c * 0.06 * speed + r * 0.03 * speed,
            overwrite: true,
          }
        );
        gsap.fromTo(
          cv.root.scale,
          { x: 0.9, y: 0.9 },
          { x: 1, y: 1, duration: drop, ease: "back.out(1.5)", delay: c * 0.06 * speed + r * 0.03 * speed, overwrite: true }
        );
      }
    }
  }

  /** Highlight winning cells, dim the rest. */
  highlight(lines: WinningLine[]) {
    const winSet = new Set<string>();
    for (const l of lines) for (const [r, c] of l.cells) winSet.add(key(r, c));
    const anyWin = winSet.size > 0;

    this.hiTween?.kill();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < REELS; c++) {
        const cv = this.cells[r][c];
        const isWin = winSet.has(key(r, c));
        cv.hi.visible = isWin;
        const targetAlpha = anyWin && !isWin ? 0.32 : 1;
        cv.root.alpha = targetAlpha;
      }
    }
    if (anyWin) {
      const his = this.cells.flat().filter((cv) => cv.hi.visible).map((cv) => cv.hi);
      his.forEach((h) => (h.alpha = 0.55));
      this.hiTween = gsap.to(his, { alpha: 1, duration: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }

  clearHighlight() {
    this.hiTween?.kill();
    for (const row of this.cells) for (const cv of row) {
      cv.hi.visible = false;
      cv.root.alpha = 1;
    }
  }

  private flameKey = "";
  setFlames(reels: number[]) {
    const key = reels.join(",");
    if (key === this.flameKey) return; // avoid rebuilding (and leaking tweens) every update
    this.flameKey = key;
    clearChildren(this.flameLayer);
    for (const c of reels) {
      const g = new Graphics();
      g.rect(0, 0, CELL, BOARD_H - PAD * 2).fill(vGrad(0, 0, CELL, BOARD_H, 0xffb040, 0xe8681c));
      g.position.set(c * (CELL + GAP), 0);
      g.alpha = 0.55;
      g.blendMode = "add";
      this.flameLayer.addChild(g);
      gsap.to(g, { alpha: 0.85, duration: 0.12, repeat: -1, yoyo: true });
    }
  }
}
