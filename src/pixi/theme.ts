// Shared palette, fonts and small display helpers for the Pixi scene.
// The landscape scene is authored in a 2560×1440 design space (16:9); the
// portrait scene in 360×640 (9:16). Groups are positioned/scaled per orientation
// by PixiGame.layout(). Text is authored at the large (landscape) size and scaled
// DOWN for portrait so it always stays crisp.
import { FillGradient, Graphics, TextStyle } from "pixi.js";

export const COLORS = {
  coreEmber: 0xe8681c,
  sparkGold: 0xf3b637,
  bloomFlame: 0xffd24a,
  wildCyan: 0x5cc6e8,
  bgForest: 0x7a2e44,
  boardVoid: 0x241634,
  panelWood: 0x8a2b2e,
  panelEdge: 0xf2b23a,
  winText: 0xf6c63a,
  ink: 0x2a1206,
  cream: 0xfff2dc,
  white: 0xffffff,
};

export const FONT = '"Baloo 2", "Trebuchet MS", "Segoe UI", system-ui, sans-serif';

export const DESIGN = {
  landscape: { w: 2560, h: 1440 },
  portrait: { w: 360, h: 640 },
};

export type Orientation = "landscape" | "portrait";

/** A bold display TextStyle with an ink stroke, at the given (landscape) size. */
export function titleStyle(size: number, fill: number | string = COLORS.cream): TextStyle {
  return new TextStyle({
    fontFamily: FONT,
    fontSize: size,
    fontWeight: "900",
    fill,
    stroke: { color: COLORS.ink, width: Math.max(2, size * 0.06) },
    letterSpacing: 1,
    dropShadow: {
      color: 0x000000,
      alpha: 0.5,
      blur: 4,
      distance: Math.max(2, size * 0.04),
      angle: Math.PI / 2,
    },
  });
}

export function labelStyle(size: number, fill: number | string = COLORS.sparkGold): TextStyle {
  return new TextStyle({
    fontFamily: FONT,
    fontSize: size,
    fontWeight: "800",
    fill,
    letterSpacing: 2,
  });
}

/** Vertical two-stop gradient fill in LOCAL space — maps to the filled shape's
 *  own bounding box, so geometry args are only kept for call-site readability. */
export function vGrad(_x: number, _y: number, _w: number, _h: number, top: number, bottom: number): FillGradient {
  return new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    textureSpace: "local",
    colorStops: [
      { offset: 0, color: top },
      { offset: 1, color: bottom },
    ],
  });
}

/** Vertical multi-stop gradient in local space (for gradient text fills). */
export function vGradStops(stops: { offset: number; color: number | string }[]): FillGradient {
  return new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    textureSpace: "local",
    colorStops: stops,
  });
}

/** Rounded wooden plate/button used across the UI. Returns the drawn Graphics. */
export function plate(
  w: number,
  h: number,
  opts: { r?: number; top?: number; bottom?: number; border?: number; borderW?: number } = {}
): Graphics {
  const r = opts.r ?? 18;
  const top = opts.top ?? 0xa23438;
  const bottom = opts.bottom ?? 0x6e1e22;
  const border = opts.border ?? 0x3a1010;
  const borderW = opts.borderW ?? 4;
  const g = new Graphics();
  g.roundRect(0, 0, w, h, r).fill(vGrad(0, 0, w, h, top, bottom));
  g.roundRect(0, 0, w, h, r).stroke({ width: borderW, color: border, alignment: 1 });
  // inner gold hairline
  g.roundRect(borderW, borderW, w - borderW * 2, h - borderW * 2, r - borderW)
    .stroke({ width: 2, color: COLORS.panelEdge, alpha: 0.4, alignment: 0 });
  return g;
}
