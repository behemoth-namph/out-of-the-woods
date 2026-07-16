// Out of the Woods — full game view rendered on a WebGL canvas with PixiJS v8,
// animated with GSAP. Drives the framework-agnostic engine/state machine in
// src/game (useGame): reads `state`, calls `actions`. No DOM game UI.
import {
  Application,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import gsap from "gsap";
import type { BetMode } from "../game/types";
import type { GameState } from "../game/useGame";
import { loadTextures, type GameTextures } from "./assets";
import { BoardView, BOARD_H, BOARD_W, FRAME_H } from "./BoardView";
import { COLORS, DESIGN, FONT, labelStyle, plate, titleStyle, vGrad, vGradStops, type Orientation } from "./theme";
import { clearChildren, killTweensDeep } from "./util";

export interface GameApi {
  state: GameState;
  totalBet: number;
  rebuyCost: number;
  canBetDown: boolean;
  canBetUp: boolean;
  actions: {
    spin: () => void;
    stop: () => void;
    betDown: () => void;
    betUp: () => void;
    toggleQuick: () => void;
    toggleAuto: () => void;
    openBuy: () => void;
    openSpecial: () => void;
    closeModal: () => void;
    setBetMode: (m: BetMode) => void;
    buyStandard: () => void;
    buySuper: () => void;
    rebuy: () => void;
    continueOverlay: () => void;
  };
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A simple clickable button (plate + label). */
function makeButton(
  w: number,
  h: number,
  onTap: () => void,
  opts?: { r?: number; top?: number; bottom?: number }
): Container {
  const c = new Container();
  const g = plate(w, h, opts);
  c.addChild(g);
  c.eventMode = "static";
  c.cursor = "pointer";
  c.hitArea = new Rectangle(0, 0, w, h);
  c.on("pointertap", onTap);
  c.on("pointerover", () => gsap.to(c.scale, { x: 1.04, y: 1.04, duration: 0.12 }));
  c.on("pointerout", () => gsap.to(c.scale, { x: 1, y: 1, duration: 0.12 }));
  c.on("pointerdown", () => gsap.to(c.scale, { x: 0.97, y: 0.97, duration: 0.08 }));
  c.on("pointerup", () => gsap.to(c.scale, { x: 1.04, y: 1.04, duration: 0.08 }));
  return c;
}

function centreText(t: Text, cx: number, cy: number) {
  t.anchor.set(0.5);
  t.position.set(cx, cy);
}

export class PixiGame {
  private app!: Application;
  private root = new Container();
  private bgLayer = new Container();
  private gameLayer = new Container();
  private overlayLayer = new Container();

  private tex!: GameTextures;
  private board!: BoardView;
  private getApi: () => GameApi = () => {
    throw new Error("not bound");
  };

  private orientation: Orientation = "landscape";

  // dynamic display refs
  private bgBase?: Sprite;
  private bgFree?: Sprite;
  private vignette = new Graphics();

  private logo = new Container();
  private badgeGroup = new Container();
  private badgeVal!: Text;
  private owlWord!: Text;
  private owl!: Text;

  private leftGroup = new Container();
  private buyPlate!: Container;
  private specialPlate!: Container;
  private rebuyPlate!: Container;
  private fsCounter!: Container;
  private fsCounterNum!: Text;

  private footer = new Container();
  private readouts = new Container();
  private creditVal!: Text;
  private betLabel!: Text;
  private betVal!: Text;
  private winGroup = new Container();
  private winLabel!: Text;
  private winVal!: Text;
  private winSub!: Text;
  private spinCluster = new Container();
  private spinBtn!: Container;
  private spinGlyph!: Text;
  private betDownBtn!: Container;
  private betUpBtn!: Container;
  private quickBtn!: Container;
  private autoBtn!: Container;

  private callout = new Container();
  private calloutAmt!: Text;
  private calloutNote!: Text;

  private modalLayer = new Container();
  private cineLayer = new Container();
  private swirl = new Graphics();
  private torchL!: Text;
  private torchR!: Text;

  // reconciliation
  private prevSpinKey = -1;
  private prevBadge = -1;
  private prevModal: string | null | undefined = undefined;
  private prevFsIntro: number | null | undefined = undefined;
  private prevFsOutro: unknown = undefined;
  private prevWinTier: unknown = undefined;
  private prevCalloutId = "";

  async init(host: HTMLElement) {
    this.app = new Application();
    await this.app.init({
      background: 0x0c0710,
      resizeTo: host,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      preference: "webgl",
    });
    host.appendChild(this.app.canvas);

    this.tex = await loadTextures();
    this.board = new BoardView(this.tex);

    this.root.addChild(this.bgLayer, this.gameLayer, this.overlayLayer);
    this.app.stage.addChild(this.root);

    this.buildBackground();
    // board at the back; side panels, footer and logo layer on top so a large
    // board (see the ⅔-width landscape layout) never hides the logo/controls
    this.gameLayer.addChild(this.board.view, this.badgeGroup, this.leftGroup, this.footer, this.logo);
    this.buildLogo();
    this.buildBadge();
    this.buildLeft();
    this.buildFooter();
    this.buildCallout();
    this.overlayLayer.addChild(this.swirl, this.cineLayer, this.modalLayer);
    this.buildEffects();

    this.app.renderer.on("resize", () => this.resize());
    this.resize();
  }

  bind(getApi: () => GameApi) {
    this.getApi = getApi;
  }

  // ── background ─────────────────────────────────────────────────────────────
  private buildBackground() {
    if (this.tex.bg.base) {
      this.bgBase = new Sprite(this.tex.bg.base);
      this.bgLayer.addChild(this.bgBase);
    } else {
      const g = new Graphics().rect(0, 0, 100, 100).fill(vGrad(0, 0, 100, 100, 0x5a2340, 0x4a1c30));
      this.bgLayer.addChild(g);
      this.bgBase = undefined;
    }
    if (this.tex.bg.freespins) {
      this.bgFree = new Sprite(this.tex.bg.freespins);
      this.bgFree.alpha = 0;
      this.bgLayer.addChild(this.bgFree);
    }
    this.bgLayer.addChild(this.vignette);
  }

  // ── logo ───────────────────────────────────────────────────────────────────
  private buildLogo() {
    if (this.tex.logo) {
      const s = new Sprite(this.tex.logo);
      s.anchor.set(0.5);
      // sized to sit above the frame's wing crests without clipping the top
      const w = 620; // authored in the 2560-wide landscape design space
      s.width = w;
      s.height = w * (s.texture.height / s.texture.width);
      this.logo.addChild(s);
      return;
    }
    const l1 = new Text({ text: "OUT OF THE", style: labelStyle(30, COLORS.cream) });
    l1.style.letterSpacing = 6;
    centreText(l1, 0, -44);
    const l2 = new Text({
      text: "WOODS",
      style: new TextStyle({
        fontFamily: FONT,
        fontSize: 92,
        fontWeight: "900",
        letterSpacing: 4,
        fill: vGradStops([
          { offset: 0, color: 0xbfe6ff },
          { offset: 0.34, color: 0xf6b23a },
          { offset: 1, color: 0xe8801c },
        ]),
        stroke: { color: 0x5a1e12, width: 5 },
        dropShadow: { color: 0x5a1e12, alpha: 1, blur: 0, distance: 6, angle: Math.PI / 2 },
      }),
    });
    centreText(l2, 0, 14);
    const wingL = this.wing();
    const wingR = this.wing();
    wingR.scale.x = -1;
    wingL.position.set(-l2.width / 2 - 30, 20);
    wingR.position.set(l2.width / 2 + 30, 20);
    this.logo.addChild(wingL, wingR, l1, l2);
  }

  private wing(): Graphics {
    const g = new Graphics();
    g.poly([0, 18, 24, 0, 44, 16, 62, 4, 80, 24, 48, 46, 16, 36]).fill(vGrad(0, 0, 80, 46, 0xd8483a, 0x7e211c));
    g.pivot.set(40, 23);
    return g;
  }

  // ── owl badge (multiplier) ─────────────────────────────────────────────────
  private buildBadge() {
    // owl totem sits ABOVE the badge; sized/placed per orientation in layout()
    const owl = new Text({ text: "🦉", style: new TextStyle({ fontFamily: FONT, fontSize: 300 }) });
    owl.anchor.set(0.5);
    this.owl = owl;

    // "WILD MULTIPLIER" runs VERTICALLY up the badge's left side (as in-game)
    this.owlWord = new Text({ text: "WILD MULTIPLIER", style: labelStyle(42, COLORS.sparkGold) });
    this.owlWord.anchor.set(0.5);
    this.owlWord.rotation = -Math.PI / 2;
    this.owlWord.position.set(-150, -30);

    const R = 118;
    const disc = new Graphics();
    disc.circle(0, 0, R).fill(vGrad(-R, -R, R * 2, R * 2, 0x7fd6f0, 0x2a6e8e));
    disc.circle(0, 0, R).stroke({ width: 10, color: 0x2a6e8e });
    if (this.tex.wild) {
      const s = new Sprite(this.tex.wild);
      s.anchor.set(0.5);
      const sc = Math.min((R * 1.9) / s.texture.width, (R * 1.9) / s.texture.height);
      s.scale.set(sc);
      disc.addChild(s);
    }
    this.badgeVal = new Text({ text: "1x", style: titleStyle(86, COLORS.sparkGold) });
    this.badgeVal.anchor.set(0.5);
    disc.addChild(this.badgeVal);

    this.badgeGroup.addChild(owl, this.owlWord, disc);
  }

  // ── left panel (plates / free-spins counter) ───────────────────────────────
  private buildLeft() {
    const PW = 260;
    const PH = 150;
    this.buyPlate = this.plateButton(PW, PH, "BUY FEATURE", "2 OPTIONS", () => this.getApi().actions.openBuy());
    this.specialPlate = this.plateButton(PW, PH, "SPECIAL BETS", "2 OPTIONS", () => this.getApi().actions.openSpecial(), true);
    this.rebuyPlate = this.plateButton(PW, PH, "REBUY FREE SPINS", "", () => this.getApi().actions.rebuy());
    this.rebuyPlate.visible = false;

    this.fsCounter = new Container();
    const fc = plate(PW, PH + 20, { top: 0xa23438, bottom: 0x6e1e22 });
    this.fsCounterNum = new Text({ text: "0", style: titleStyle(76, COLORS.sparkGold) });
    centreText(this.fsCounterNum, PW / 2, PH / 2 - 8);
    const fcl = new Text({ text: "FREE SPINS LEFT", style: labelStyle(24, COLORS.cream) });
    centreText(fcl, PW / 2, PH - 12);
    this.fsCounter.addChild(fc, this.fsCounterNum, fcl);
    this.fsCounter.visible = false;

    this.leftGroup.addChild(this.buyPlate, this.specialPlate, this.rebuyPlate, this.fsCounter);
  }

  private plateButton(w: number, h: number, t1: string, t2: string, onTap: () => void, arrow = false): Container {
    const c = makeButton(w, h, onTap);
    const title = new Text({ text: t1, style: titleStyle(34, COLORS.cream) });
    title.anchor.set(0.5);
    title.style.align = "center";
    title.style.wordWrap = true;
    title.style.wordWrapWidth = w - 24;
    title.position.set(w / 2, t2 ? h / 2 - 16 : h / 2);
    c.addChild(title);
    if (t2) {
      const sub = new Text({ text: t2, style: labelStyle(24, COLORS.sparkGold) });
      centreText(sub, w / 2, h / 2 + 26);
      c.addChild(sub);
      (c as Container & { _sub?: Text })._sub = sub;
    }
    if (arrow) {
      const a = new Text({ text: "➜", style: titleStyle(30, COLORS.sparkGold) });
      centreText(a, w / 2, h - 22);
      c.addChild(a);
    }
    (c as Container & { _title?: Text })._title = title;
    return c;
  }

  // ── footer controls ────────────────────────────────────────────────────────
  private buildFooter() {
    // readouts
    const credLbl = new Text({ text: "CREDIT", style: labelStyle(22, COLORS.sparkGold) });
    this.creditVal = new Text({ text: "$0.00", style: titleStyle(36, COLORS.white) });
    this.creditVal.style.stroke = { color: COLORS.ink, width: 0 };
    this.betLabel = new Text({ text: "BET", style: labelStyle(22, COLORS.sparkGold) });
    this.betVal = new Text({ text: "$0.00", style: titleStyle(36, COLORS.white) });
    this.betVal.style.stroke = { color: COLORS.ink, width: 0 };
    // readouts — fixed internal layout (credit at 0, bet to the right)
    credLbl.position.set(0, 0);
    this.creditVal.position.set(0, 28);
    this.betLabel.position.set(300, 0);
    this.betVal.position.set(300, 28);
    this.readouts.addChild(credLbl, this.creditVal, this.betLabel, this.betVal);

    // win readout — centred texts stacked around local origin
    this.winLabel = new Text({ text: "WIN", style: labelStyle(24, COLORS.sparkGold) });
    this.winVal = new Text({ text: "", style: titleStyle(54, COLORS.winText) });
    this.winSub = new Text({ text: "SPIN TO WIN!", style: labelStyle(24, COLORS.white) });
    [this.winLabel, this.winVal, this.winSub].forEach((t) => t.anchor.set(0.5));
    this.winLabel.position.set(0, -34);
    this.winVal.position.set(0, 4);
    this.winSub.position.set(0, 40);
    this.winGroup.addChild(this.winLabel, this.winVal, this.winSub);

    // spin cluster — fixed internal horizontal strip (left→right):
    //   quick · auto · [−] · [+] · (spin).  Vertically centred on the spin disc.
    this.quickBtn = this.miniToggle("QUICK", () => this.getApi().actions.toggleQuick());
    this.autoBtn = this.miniToggle("AUTO", () => this.getApi().actions.toggleAuto());
    this.betDownBtn = this.stepBtn("−", () => this.getApi().actions.betDown());
    this.betUpBtn = this.stepBtn("+", () => this.getApi().actions.betUp());
    this.spinBtn = this.makeSpinButton();
    const CY = 72; // spin radius = local vertical centre
    this.quickBtn.position.set(0, CY - 22);
    this.autoBtn.position.set(124, CY - 22);
    this.betDownBtn.position.set(256, CY - 34);
    this.betUpBtn.position.set(340, CY - 34);
    this.spinBtn.position.set(430, CY - 72);
    this.spinCluster.addChild(this.quickBtn, this.autoBtn, this.betDownBtn, this.betUpBtn, this.spinBtn);
    // natural bounds: width ≈ 574, height 144; spin centre at local (502, 72)

    this.footer.addChild(this.readouts, this.winGroup, this.spinCluster);
  }

  private miniToggle(label: string, onTap: () => void): Container {
    const w = 108;
    const h = 44;
    const c = new Container();
    const g = new Graphics();
    g.roundRect(0, 0, w, h, 22).fill({ color: 0x000000, alpha: 0.35 }).stroke({ width: 2, color: 0xffffff, alpha: 0.3 });
    const t = new Text({ text: label, style: labelStyle(22, COLORS.white) });
    centreText(t, w / 2, h / 2);
    c.addChild(g, t);
    c.eventMode = "static";
    c.cursor = "pointer";
    c.hitArea = new Rectangle(0, 0, w, h);
    c.on("pointertap", onTap);
    (c as Container & { _bg?: Graphics; _t?: Text; _w?: number; _h?: number })._bg = g;
    (c as Container & { _t?: Text })._t = t;
    (c as Container & { _w?: number })._w = w;
    (c as Container & { _h?: number })._h = h;
    return c;
  }

  private setToggle(c: Container, on: boolean) {
    const anyc = c as Container & { _bg?: Graphics; _t?: Text; _w?: number; _h?: number };
    const g = anyc._bg!;
    const w = anyc._w!;
    const h = anyc._h!;
    g.clear();
    if (on) g.roundRect(0, 0, w, h, 22).fill(COLORS.sparkGold).stroke({ width: 2, color: COLORS.sparkGold });
    else g.roundRect(0, 0, w, h, 22).fill({ color: 0x000000, alpha: 0.35 }).stroke({ width: 2, color: 0xffffff, alpha: 0.3 });
    anyc._t!.style.fill = on ? COLORS.ink : COLORS.white;
  }

  private stepBtn(label: string, onTap: () => void): Container {
    const d = 68;
    const c = new Container();
    const g = new Graphics();
    g.circle(d / 2, d / 2, d / 2).fill({ color: 0x000000, alpha: 0.35 }).stroke({ width: 3, color: 0xffffff, alpha: 0.35 });
    const t = new Text({ text: label, style: titleStyle(44, COLORS.white) });
    centreText(t, d / 2, d / 2 - 2);
    c.addChild(g, t);
    c.eventMode = "static";
    c.cursor = "pointer";
    c.hitArea = new Rectangle(0, 0, d, d);
    c.on("pointertap", () => {
      if (c.alpha < 0.5) return;
      onTap();
    });
    return c;
  }

  private makeSpinButton(): Container {
    const d = 144;
    const c = new Container();
    const g = new Graphics();
    g.circle(d / 2, d / 2, d / 2).fill(vGrad(0, 0, d, d, 0x3a2018, 0x1a0e0a)).stroke({ width: 6, color: COLORS.panelEdge });
    this.spinGlyph = new Text({ text: "⟳", style: new TextStyle({ fontFamily: FONT, fontSize: 60, fill: COLORS.white }) });
    centreText(this.spinGlyph, d / 2, d / 2);
    c.addChild(g, this.spinGlyph);
    c.eventMode = "static";
    c.cursor = "pointer";
    c.hitArea = new Rectangle(0, 0, d, d);
    c.on("pointertap", () => {
      const api = this.getApi();
      if (api.state.busy) api.actions.stop();
      else api.actions.spin();
    });
    return c;
  }

  // ── floating win callout ───────────────────────────────────────────────────
  private buildCallout() {
    this.calloutAmt = new Text({ text: "", style: titleStyle(64, COLORS.winText) });
    this.calloutNote = new Text({ text: "", style: labelStyle(26, COLORS.white) });
    this.calloutAmt.anchor.set(0.5);
    this.calloutNote.anchor.set(0.5);
    this.calloutNote.position.set(0, 44);
    this.callout.addChild(this.calloutAmt, this.calloutNote);
    this.callout.visible = false;
    this.gameLayer.addChild(this.callout);
  }

  // ── effects (swirl, torches) ───────────────────────────────────────────────
  private buildEffects() {
    this.torchL = new Text({ text: "🔥", style: new TextStyle({ fontFamily: FONT, fontSize: 52 }) });
    this.torchR = new Text({ text: "🔥", style: new TextStyle({ fontFamily: FONT, fontSize: 52 }) });
    this.torchL.anchor.set(0.5);
    this.torchR.anchor.set(0.5);
    this.torchL.visible = false;
    this.torchR.visible = false;
    this.bgLayer.addChild(this.torchL, this.torchR);
    this.swirl.alpha = 0;
  }

  // ── responsive layout ──────────────────────────────────────────────────────
  private resize() {
    const W = this.app.screen.width;
    const H = this.app.screen.height;
    this.orientation = H > W ? "portrait" : "landscape";
    const design = DESIGN[this.orientation];
    const scale = Math.min(W / design.w, H / design.h);
    this.root.scale.set(scale);
    this.root.position.set((W - design.w * scale) / 2, (H - design.h * scale) / 2);
    this.layout(design.w, design.h);
  }

  private layoutBackground(dw: number, dh: number) {
    for (const s of [this.bgBase, this.bgFree]) {
      if (!s) continue;
      const sc = Math.max(dw / s.texture.width, dh / s.texture.height);
      s.scale.set(sc);
      s.position.set((dw - s.texture.width * sc) / 2, (dh - s.texture.height * sc) / 2);
    }
    this.vignette.clear();
    this.vignette.rect(0, 0, dw, dh).fill({ color: 0x000000, alpha: 0 });
    // soft dark edge frame
    const edge = Math.min(dw, dh) * 0.14;
    this.vignette
      .rect(0, 0, dw, dh)
      .stroke({ width: edge, color: 0x0a040c, alpha: 0.55, alignment: 0 });
    this.swirl.clear();
    this.swirl.circle(dw / 2, dh / 2, Math.max(dw, dh) * 0.7).fill(vGrad(0, 0, dw, dh, 0xffd24a, 0xe8601c));
  }

  private layout(dw: number, dh: number) {
    this.layoutBackground(dw, dh);
    if (this.orientation === "landscape") this.layoutLandscape(dw, dh);
    else this.layoutPortrait(dw, dh);
    this.overlayLayer.hitArea = new Rectangle(0, 0, dw, dh);
  }

  private layoutLandscape(dw: number, dh: number) {
    const cx = dw / 2;
    this.footer.position.set(0, 0);

    // The game PLAY AREA is the canvas minus the top logo band and the bottom
    // controls band. The tile grid height = 90% of that play area (so it stays
    // clear of the logo and footer), and is centred within it. Grid width then
    // follows from the 5×4 square-cell aspect.
    const TOP_UI = 150; // logo band
    const BOTTOM_UI = 180; // footer/controls band
    const playH = dh - TOP_UI - BOTTOM_UI;
    const GRID_HEIGHT_FRAC = 0.9;
    const boardScale = (playH * GRID_HEIGHT_FRAC) / BOARD_H;
    const boardCy = TOP_UI + playH / 2;
    this.board.view.position.set(cx, boardCy);
    this.board.view.scale.set(boardScale);
    const halfH = (FRAME_H * boardScale) / 2;
    this.callout.position.set(cx, boardCy + halfH - 80);

    // logo pinned to the very top, on top of the (tall) board
    this.logo.position.set(cx, 84);
    this.logo.scale.set(0.62);

    // right margin: owl totem up top, "WILD MULTIPLIER" vertical, badge low-right
    const rightX = cx + halfH * (BOARD_W / FRAME_H) + 150; // just past the board edge
    this.badgeGroup.position.set(Math.min(dw - 150, rightX), 1006);
    this.badgeGroup.scale.set(0.92);
    this.owl.visible = true;
    this.owlWord.visible = true;
    this.owl.position.set(0, -380);

    // left plates: stacked column in the left margin, spread vertically
    this.leftGroup.position.set(70, 470);
    this.leftGroup.scale.set(0.92);
    for (const p of [this.buyPlate, this.specialPlate, this.rebuyPlate, this.fsCounter]) p.scale.set(1);
    this.buyPlate.position.set(0, 0);
    this.specialPlate.position.set(0, 330);
    this.rebuyPlate.position.set(0, 330);
    this.fsCounter.position.set(0, 180);

    // footer (absolute design coords)
    this.readouts.scale.set(1);
    this.readouts.position.set(70, dh - 108);
    this.winGroup.scale.set(1);
    this.winGroup.position.set(cx, dh - 66);
    this.spinCluster.scale.set(1);
    this.spinCluster.position.set(dw - 642, dh - 140);
  }

  private layoutPortrait(dw: number, dh: number) {
    const cx = dw / 2;
    this.footer.position.set(0, 0);
    // compact logo at the very top, clear of the board and the badge chip
    this.logo.position.set(cx, 50);
    this.logo.scale.set(0.28);

    const boardScale = 0.31;
    const boardTop = 104;
    this.board.view.position.set(cx, boardTop + (FRAME_H * boardScale) / 2);
    this.board.view.scale.set(boardScale);
    this.callout.position.set(cx, boardTop + FRAME_H * boardScale - 20);

    // badge chip top-right (small, clears logo + board top)
    this.badgeGroup.position.set(dw - 38, 78);
    this.badgeGroup.scale.set(0.22);
    this.owlWord.visible = false;
    this.owl.visible = false;

    // left plates as a row below the board
    this.leftGroup.position.set(0, 0);
    this.leftGroup.scale.set(1);
    const pScale = 0.4;
    for (const p of [this.buyPlate, this.specialPlate, this.rebuyPlate]) p.scale.set(pScale);
    const pw = 260 * pScale;
    const plateY = 378;
    this.buyPlate.position.set(cx - pw - 6, plateY);
    this.specialPlate.position.set(cx + 6, plateY);
    this.rebuyPlate.position.set(cx - pw - 6, plateY);
    this.fsCounter.scale.set(pScale);
    this.fsCounter.position.set(cx - pw / 2, plateY - 6);

    // footer (absolute design coords, compact + stacked)
    this.readouts.scale.set(0.5);
    this.readouts.position.set(cx - 105, dh - 192);
    this.winGroup.scale.set(0.5);
    this.winGroup.position.set(cx, dh - 150);
    this.spinCluster.scale.set(0.5);
    this.spinCluster.position.set((dw - 574 * 0.5) / 2, dh - 104);
  }

  // ── state reconciliation ───────────────────────────────────────────────────
  update(api: GameApi) {
    const s = api.state;

    // background crossfade for free mode
    if (this.bgFree) gsap.to(this.bgFree, { alpha: s.mode === "free" ? 1 : 0, duration: 0.6, overwrite: "auto" });
    this.torchL.visible = this.torchR.visible = s.mode === "free";

    // board + drop animation on spinKey change
    if (s.spinKey !== this.prevSpinKey) {
      const speed = s.quickSpin ? 0.6 : 1;
      this.board.render(s.board, s.heldReels, s.spinKey > 0, speed);
      this.prevSpinKey = s.spinKey;
    } else {
      this.board.render(s.board, s.heldReels, false, 1);
    }
    this.board.setFlames(s.flameReels);

    // win highlight
    if (s.winningLines.length) this.board.highlight(s.winningLines);
    else this.board.clearHighlight();

    // badge
    this.badgeVal.text = `${Math.max(1, s.badge)}x`;
    if (s.badge !== this.prevBadge) {
      gsap.fromTo(this.badgeVal.scale, { x: 1.6, y: 1.6 }, { x: 1, y: 1, duration: 0.45, ease: "back.out(2.4)" });
      this.prevBadge = s.badge;
    }

    // readouts
    this.creditVal.text = `$${fmt(s.balance)}`;
    this.betVal.text = `$${fmt(api.totalBet)}`;
    const betModeTxt = s.betMode === "ante" ? " · ANTE 125×" : s.betMode === "super-spin" ? " · SUPER 250×" : "";
    this.betLabel.text = `BET${betModeTxt}`;

    // win readout
    const isFree = s.mode === "free";
    const winLbl = isFree ? `FREE SPINS LEFT ${s.freeSpinsRemaining}` : "WINNER";
    if (s.roundWin > 0) {
      this.winLabel.visible = true;
      this.winVal.visible = true;
      this.winLabel.text = "WIN";
      this.winVal.text = `$${fmt(s.roundWin)}`;
      this.winSub.text = winLbl;
    } else {
      this.winLabel.visible = false;
      this.winVal.visible = false;
      this.winSub.text = isFree ? winLbl : "SPIN TO WIN!";
    }

    // buttons enabled state
    const betLocked = s.busy || s.mode === "free";
    this.betDownBtn.alpha = !betLocked && api.canBetDown ? 1 : 0.3;
    this.betUpBtn.alpha = !betLocked && api.canBetUp ? 1 : 0.3;
    this.setToggle(this.quickBtn, s.quickSpin);
    this.setToggle(this.autoBtn, s.autoplay);
    this.spinGlyph.text = s.autoplay && !s.busy ? "■" : "⟳";
    this.spinGlyph.style.fill = s.autoplay ? 0xff6a5a : COLORS.white;
    if (s.busy && !gsap.isTweening(this.spinGlyph)) {
      gsap.to(this.spinGlyph, { rotation: this.spinGlyph.rotation + Math.PI * 8, duration: 3.2, ease: "none", repeat: -1 });
    } else if (!s.busy) {
      gsap.killTweensOf(this.spinGlyph);
      this.spinGlyph.rotation = 0;
    }

    // left panel visibility
    const showPlates = !isFree;
    this.buyPlate.visible = showPlates;
    this.specialPlate.visible = showPlates && !s.rebuyOffered;
    this.rebuyPlate.visible = showPlates && s.rebuyOffered;
    this.fsCounter.visible = isFree;
    this.fsCounterNum.text = `${s.freeSpinsRemaining}`;
    if (this.rebuyPlate.visible) {
      const sub = (this.rebuyPlate as Container & { _sub?: Text })._sub;
      if (sub) sub.text = `$${fmt(api.rebuyCost)}`;
    }
    (this.buyPlate as Container).alpha = s.busy ? 0.45 : 1;
    (this.specialPlate as Container).alpha = s.busy ? 0.45 : 1;
    this.buyPlate.eventMode = s.busy ? "none" : "static";
    this.specialPlate.eventMode = s.busy ? "none" : "static";

    // callout
    const calloutId = s.callout ? `${s.spinKey}:${s.callout.amount}:${s.callout.note}` : "";
    if (calloutId && calloutId !== this.prevCalloutId) {
      this.calloutAmt.text = `$${fmt(s.callout!.amount)}`;
      this.calloutNote.text = s.callout!.note;
      this.callout.visible = true;
      gsap.fromTo(this.callout, { alpha: 0, y: this.callout.y + 20 }, { alpha: 1, y: this.callout.y, duration: 0.26, ease: "back.out(1.7)", overwrite: true });
    } else if (!s.callout) {
      this.callout.visible = false;
    }
    this.prevCalloutId = calloutId;

    // swirl
    gsap.to(this.swirl, { alpha: s.swirl ? 0.9 : 0, duration: 0.4, overwrite: "auto" });

    // modals + cinematics
    this.reconcileModal(api);
    this.reconcileCine(api);
  }

  // ── modals ─────────────────────────────────────────────────────────────────
  private reconcileModal(api: GameApi) {
    const s = api.state;
    if (s.modal === this.prevModal) {
      if (s.modal === "special") this.refreshSpecial(api); // keep active highlight fresh
      return;
    }
    this.prevModal = s.modal;
    clearChildren(this.modalLayer);
    if (!s.modal) return;
    if (s.modal === "buy") this.buildBuyModal(api);
    else this.buildSpecialModal(api);
  }

  private scrim(dw: number, dh: number, onTap: () => void): Graphics {
    const g = new Graphics().rect(0, 0, dw, dh).fill({ color: 0x060308, alpha: 0.72 });
    g.eventMode = "static";
    g.on("pointertap", onTap);
    return g;
  }

  private modalShell(mw: number, mh: number, title: string, onClose: () => void): { panel: Container; dw: number; dh: number } {
    const design = DESIGN[this.orientation];
    const dw = design.w;
    const dh = design.h;
    this.modalLayer.addChild(this.scrim(dw, dh, onClose));
    const panel = new Container();
    const g = plate(mw, mh, { r: 24, top: 0x9a2f33, bottom: 0x6a1c20, border: COLORS.panelEdge, borderW: 6 });
    panel.addChild(g);
    const h2 = new Text({ text: title, style: titleStyle(this.orientation === "portrait" ? 38 : 44, COLORS.cream) });
    h2.anchor.set(0.5, 0);
    h2.position.set(mw / 2, 24);
    panel.addChild(h2);
    const close = new Text({ text: "✕", style: new TextStyle({ fontFamily: FONT, fontSize: 40, fill: COLORS.white }) });
    close.anchor.set(0.5);
    close.position.set(mw - 34, 34);
    close.eventMode = "static";
    close.cursor = "pointer";
    close.on("pointertap", onClose);
    panel.addChild(close);
    panel.position.set((dw - mw) / 2, (dh - mh) / 2);
    this.modalLayer.addChild(panel);
    gsap.fromTo(panel.scale, { x: 0.85, y: 0.85 }, { x: 1, y: 1, duration: 0.28, ease: "back.out(1.7)" });
    return { panel, dw, dh };
  }

  private buildBuyModal(api: GameApi) {
    const portrait = this.orientation === "portrait";
    const mw = portrait ? 340 : 1000;
    const mh = portrait ? 300 : 520;
    const { panel } = this.modalShell(mw, mh, "BUY FEATURE", () => api.actions.closeModal());
    const stdCost = 100 * api.totalBet;
    const supCost = 500 * api.totalBet;
    const cardW = (mw - (portrait ? 44 : 80)) / 2;
    const cardH = portrait ? 150 : 260;
    const y = portrait ? 66 : 96;
    const gap = portrait ? 12 : 24;
    const mkCard = (x: number, name: string, price: number, desc: string, afford: boolean, onTap: () => void) => {
      const c = new Container();
      const g = plate(cardW, cardH, { r: 16, top: 0xb23a2c, bottom: 0x7a2418, border: COLORS.panelEdge, borderW: 3 });
      c.addChild(g);
      const nm = new Text({ text: name, style: titleStyle(portrait ? 26 : 34, COLORS.cream) });
      nm.anchor.set(0.5);
      nm.style.align = "center";
      nm.style.wordWrap = true;
      nm.style.wordWrapWidth = cardW - 20;
      nm.position.set(cardW / 2, portrait ? 34 : 52);
      const pr = new Text({ text: `$${fmt(price)}`, style: titleStyle(portrait ? 38 : 50, COLORS.sparkGold) });
      pr.anchor.set(0.5);
      pr.position.set(cardW / 2, cardH / 2 + 6);
      const ds = new Text({ text: desc, style: labelStyle(portrait ? 16 : 20, 0xffd9a0) });
      ds.anchor.set(0.5);
      ds.style.align = "center";
      ds.style.wordWrap = true;
      ds.style.wordWrapWidth = cardW - 20;
      ds.position.set(cardW / 2, cardH - (portrait ? 28 : 40));
      c.addChild(nm, pr, ds);
      c.position.set(x, y);
      c.alpha = afford ? 1 : 0.5;
      if (afford) {
        c.eventMode = "static";
        c.cursor = "pointer";
        c.hitArea = new Rectangle(0, 0, cardW, cardH);
        c.on("pointertap", onTap);
      }
      panel.addChild(c);
    };
    const leftX = portrait ? 22 : 40;
    mkCard(leftX, "FREE SPINS", stdCost, "STANDARD FREE SPINS", api.state.balance >= stdCost, () => api.actions.buyStandard());
    mkCard(leftX + cardW + gap, "SUPER FREE SPINS", supCost, "WILDS START FROM 10×", api.state.balance >= supCost, () => api.actions.buySuper());

    // bet stepper
    const by = y + cardH + (portrait ? 30 : 50);
    const lbl = new Text({ text: "BASE BET", style: labelStyle(portrait ? 18 : 24, COLORS.cream) });
    lbl.anchor.set(0.5);
    lbl.position.set(mw / 2, by - (portrait ? 18 : 26));
    panel.addChild(lbl);
    const pill = plate(portrait ? 130 : 190, portrait ? 44 : 60, { r: 30, top: 0xd23aa0, bottom: 0x9a1c6e, border: 0xffd0ec, borderW: 3 });
    const pillC = new Container();
    pillC.addChild(pill);
    const pv = new Text({ text: `$${fmt(api.totalBet)}`, style: titleStyle(portrait ? 26 : 34, COLORS.sparkGold) });
    pv.anchor.set(0.5);
    pv.position.set((portrait ? 130 : 190) / 2, (portrait ? 44 : 60) / 2);
    pillC.addChild(pv);
    pillC.position.set(mw / 2 - (portrait ? 65 : 95), by);
    panel.addChild(pillC);
    const rb = (label: string, dx: number, onTap: () => void, enabled: boolean) => {
      const d = portrait ? 44 : 60;
      const c = new Container();
      const g = new Graphics().circle(d / 2, d / 2, d / 2).fill(vGrad(0, 0, d, d, 0xd23aa0, 0x9a1c6e)).stroke({ width: 3, color: 0xffd0ec });
      const t = new Text({ text: label, style: titleStyle(portrait ? 30 : 40, COLORS.white) });
      t.anchor.set(0.5);
      t.position.set(d / 2, d / 2 - 2);
      c.addChild(g, t);
      c.position.set(dx, by + ((portrait ? 44 : 60) - d) / 2);
      c.alpha = enabled ? 1 : 0.4;
      if (enabled) {
        c.eventMode = "static";
        c.cursor = "pointer";
        c.hitArea = new Rectangle(0, 0, d, d);
        c.on("pointertap", onTap);
      }
      panel.addChild(c);
    };
    rb("−", mw / 2 - (portrait ? 130 : 200), () => api.actions.betDown(), api.canBetDown);
    rb("+", mw / 2 + (portrait ? 86 : 140), () => api.actions.betUp(), api.canBetUp);
  }

  private specialCards: { card: Container; mode: BetMode; outline: Graphics }[] = [];
  private buildSpecialModal(api: GameApi) {
    const portrait = this.orientation === "portrait";
    const mw = portrait ? 340 : 1000;
    const mh = portrait ? 470 : 560;
    const { panel } = this.modalShell(mw, mh, "SPECIAL BETS", () => api.actions.closeModal());
    this.specialCards = [];
    const rows: { mode: BetMode; name: string; desc: string; mult: string }[] = [
      { mode: "normal", name: "NORMAL PLAY", desc: "Standard 25× bet. Free spins trigger naturally.", mult: "25×" },
      { mode: "ante", name: "ANTE BET", desc: "The chance to trigger the FREE SPINS feature is 12 times higher.", mult: "125×" },
      { mode: "super-spin", name: "SUPER SPIN", desc: "Guarantees a Wild Multiplier stack every spin. Disables free spins.", mult: "250×" },
    ];
    const cardH = portrait ? 118 : 140;
    const gap = portrait ? 14 : 18;
    const cardW = mw - (portrait ? 44 : 80);
    let y = portrait ? 66 : 100;
    for (const row of rows) {
      const c = new Container();
      const g = plate(cardW, cardH, { r: 16, top: 0xb23a2c, bottom: 0x7a2418, border: COLORS.panelEdge, borderW: 3 });
      const outline = new Graphics();
      outline.roundRect(-3, -3, cardW + 6, cardH + 6, 18).stroke({ width: 5, color: COLORS.sparkGold });
      outline.visible = false;
      const nm = new Text({ text: row.name, style: titleStyle(portrait ? 26 : 32, COLORS.cream) });
      nm.position.set(24, portrait ? 16 : 22);
      const ds = new Text({ text: row.desc, style: labelStyle(portrait ? 16 : 20, 0xffd9a0) });
      ds.style.wordWrap = true;
      ds.style.wordWrapWidth = cardW - (portrait ? 130 : 240);
      ds.style.letterSpacing = 0;
      ds.position.set(24, portrait ? 52 : 66);
      const ml = new Text({ text: row.mult, style: titleStyle(portrait ? 30 : 40, COLORS.sparkGold) });
      ml.anchor.set(1, 0.5);
      ml.position.set(cardW - 20, cardH / 2);
      c.addChild(g, outline, nm, ds, ml);
      c.position.set((portrait ? 22 : 40), y);
      c.eventMode = "static";
      c.cursor = "pointer";
      c.hitArea = new Rectangle(0, 0, cardW, cardH);
      c.on("pointertap", () => api.actions.setBetMode(row.mode));
      panel.addChild(c);
      this.specialCards.push({ card: c, mode: row.mode, outline });
      y += cardH + gap;
    }
    this.refreshSpecial(api);
  }

  private refreshSpecial(api: GameApi) {
    for (const sc of this.specialCards) sc.outline.visible = sc.mode === api.state.betMode;
  }

  // ── cinematics (fs intro/outro, win tier) ──────────────────────────────────
  private reconcileCine(api: GameApi) {
    const s = api.state;
    if (s.fsIntro !== this.prevFsIntro) {
      this.prevFsIntro = s.fsIntro;
      this.clearCine();
      if (s.fsIntro !== null) this.buildFsIntro(s.fsIntro, () => api.actions.continueOverlay());
    }
    if (s.fsOutro !== this.prevFsOutro) {
      this.prevFsOutro = s.fsOutro;
      if (!this.hasCine("fsIntro")) this.clearCine();
      if (s.fsOutro) this.buildFsOutro(s.fsOutro.total, s.fsOutro.spins, () => api.actions.continueOverlay());
    }
    if (s.winTier !== this.prevWinTier) {
      this.prevWinTier = s.winTier;
      this.clearTier();
      if (s.winTier) this.buildTier(s.winTier.word, s.winTier.amount);
    }
  }

  private cineTag = "";
  private clearCine() {
    clearChildren(this.cineLayer);
    this.cineTag = "";
  }
  private hasCine(tag: string) {
    return this.cineTag === tag;
  }

  private fullRect(color: number, alpha = 1): Graphics {
    const d = DESIGN[this.orientation];
    return new Graphics().rect(0, 0, d.w, d.h).fill({ color, alpha });
  }

  private buildFsIntro(spins: number, onTap: () => void) {
    const d = DESIGN[this.orientation];
    const portrait = this.orientation === "portrait";
    const layer = new Container();
    layer.addChild(this.fullRect(0x1a1c3a));
    const moonR = portrait ? 70 : 140;
    const moon = new Graphics().circle(0, 0, moonR).fill(vGrad(-moonR, -moonR, moonR * 2, moonR * 2, 0xffffff, 0x8fa0d0));
    moon.position.set(d.w / 2, portrait ? 150 : 340);
    layer.addChild(moon);
    const cx = d.w / 2;
    const cyBase = portrait ? 300 : 640;
    const congrats = new Text({ text: "CONGRATULATIONS", style: titleStyle(portrait ? 34 : 96, COLORS.sparkGold) });
    congrats.anchor.set(0.5);
    congrats.position.set(cx, cyBase);
    const sub1 = new Text({ text: "YOU HAVE WON", style: labelStyle(portrait ? 18 : 40, COLORS.white) });
    sub1.anchor.set(0.5);
    sub1.position.set(cx, cyBase + (portrait ? 34 : 80));
    const big = new Text({ text: `${spins}`, style: titleStyle(portrait ? 60 : 150, COLORS.sparkGold) });
    big.anchor.set(0.5);
    big.position.set(cx, cyBase + (portrait ? 90 : 200));
    const sub2 = new Text({ text: "FREE SPINS", style: labelStyle(portrait ? 18 : 40, COLORS.white) });
    sub2.anchor.set(0.5);
    sub2.position.set(cx, cyBase + (portrait ? 140 : 320));
    const press = new Text({ text: "PRESS ANYWHERE TO CONTINUE", style: labelStyle(portrait ? 14 : 28, COLORS.sparkGold) });
    press.anchor.set(0.5);
    press.position.set(cx, cyBase + (portrait ? 190 : 420));
    layer.addChild(congrats, sub1, big, sub2, press);
    layer.eventMode = "static";
    layer.hitArea = new Rectangle(0, 0, d.w, d.h);
    layer.cursor = "pointer";
    layer.on("pointertap", onTap);
    this.cineLayer.addChild(layer);
    this.cineTag = "fsIntro";
    gsap.fromTo(congrats, { y: congrats.y - 60, alpha: 0 }, { y: congrats.y, alpha: 1, duration: 0.5, ease: "back.out(1.8)" });
    gsap.fromTo(big.scale, { x: 0, y: 0 }, { x: 1, y: 1, duration: 0.4, ease: "back.out(2.4)", delay: 0.15 });
    gsap.to(press, { alpha: 0.35, duration: 1.1, repeat: -1, yoyo: true });
  }

  private buildFsOutro(total: number, spins: number, onTap: () => void) {
    const d = DESIGN[this.orientation];
    const portrait = this.orientation === "portrait";
    this.clearCine();
    const layer = new Container();
    layer.addChild(this.fullRect(0x24120c));
    const cx = d.w / 2;
    const cyBase = portrait ? 250 : 560;
    const congrats = new Text({ text: "FREE SPINS COMPLETED", style: titleStyle(portrait ? 30 : 84, COLORS.sparkGold) });
    congrats.anchor.set(0.5);
    congrats.position.set(cx, cyBase);
    const sub1 = new Text({ text: "YOU HAVE WON", style: labelStyle(portrait ? 18 : 40, COLORS.white) });
    sub1.anchor.set(0.5);
    sub1.position.set(cx, cyBase + (portrait ? 40 : 90));
    const big = new Text({ text: "$0.00", style: titleStyle(portrait ? 54 : 140, COLORS.sparkGold) });
    big.anchor.set(0.5);
    big.position.set(cx, cyBase + (portrait ? 96 : 210));
    const sub2 = new Text({ text: `IN ${spins} FREE SPINS`, style: labelStyle(portrait ? 18 : 40, COLORS.white) });
    sub2.anchor.set(0.5);
    sub2.position.set(cx, cyBase + (portrait ? 150 : 330));
    const press = new Text({ text: "PRESS ANYWHERE TO CONTINUE", style: labelStyle(portrait ? 14 : 28, COLORS.sparkGold) });
    press.anchor.set(0.5);
    press.position.set(cx, cyBase + (portrait ? 200 : 430));
    layer.addChild(congrats, sub1, big, sub2, press);
    layer.eventMode = "static";
    layer.hitArea = new Rectangle(0, 0, d.w, d.h);
    layer.cursor = "pointer";
    layer.on("pointertap", onTap);
    this.cineLayer.addChild(layer);
    this.cineTag = "fsOutro";
    const obj = { v: 0 };
    gsap.to(obj, { v: total, duration: 1.1, ease: "power1.out", onUpdate: () => (big.text = `$${fmt(obj.v)}`) });
    gsap.to(press, { alpha: 0.35, duration: 1.1, repeat: -1, yoyo: true });
  }

  private tierLayer?: Container;
  private clearTier() {
    if (this.tierLayer) {
      killTweensDeep(this.tierLayer);
      this.tierLayer.destroy({ children: true });
      this.tierLayer = undefined;
    }
  }
  private buildTier(word: string, amount: number) {
    const d = DESIGN[this.orientation];
    const portrait = this.orientation === "portrait";
    const layer = new Container();
    layer.addChild(this.fullRect(0x06030c, 0.55));
    const cx = d.w / 2;
    const cy = d.h / 2;
    // coins
    const coins: Text[] = [];
    for (let i = 0; i < 24; i++) {
      const coin = new Text({ text: ["🪙", "💰", "🟡"][i % 3], style: new TextStyle({ fontFamily: FONT, fontSize: portrait ? 22 : 48 }) });
      coin.anchor.set(0.5);
      layer.addChild(coin);
      coins.push(coin);
    }
    const w = new Text({ text: word, style: titleStyle(portrait ? 54 : 150, 0xffcf4a) });
    w.anchor.set(0.5);
    w.position.set(cx, cy - (portrait ? 20 : 40));
    const amt = new Text({ text: `$${fmt(amount)}`, style: titleStyle(portrait ? 30 : 68, COLORS.white) });
    amt.anchor.set(0.5);
    amt.position.set(cx, cy + (portrait ? 70 : 150));
    layer.addChild(w, amt);
    this.overlayLayer.addChild(layer);
    this.tierLayer = layer;
    gsap.from(w, { y: w.y - 80, alpha: 0, duration: 0.42, ease: "back.out(2.2)" });
    gsap.from(w.scale, { x: 0.5, y: 0.5, duration: 0.42, ease: "back.out(2.2)" });
    gsap.from(amt, { alpha: 0, y: amt.y + 20, duration: 0.3, delay: 0.2 });
    coins.forEach((coin, i) => {
      const startX = cx + gsap.utils.random(-d.w * 0.4, d.w * 0.4);
      coin.position.set(startX, -60);
      gsap.to(coin, {
        y: d.h + 60,
        rotation: gsap.utils.random(-6, 6),
        duration: gsap.utils.random(1.1, 1.8),
        ease: "power1.in",
        delay: (i % 12) * 0.06,
        repeat: -1,
      });
    });
  }

  destroy() {
    // kill only OUR tweens (not other PixiGame instances' — matters under React
    // StrictMode double-mount), then tear down the renderer.
    killTweensDeep(this.root);
    this.clearTier();
    this.app?.destroy(true, { children: true });
  }
}
