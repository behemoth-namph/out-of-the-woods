import type { CSSProperties } from "react";
import type { Cell } from "../game/types";
import { SYMBOLS } from "../game/symbols";

/** Renders a single landed cell as procedural comic-woodland art. */
export function SymbolIcon({ cell }: { cell: Cell }) {
  const meta = SYMBOLS[cell.sym];

  if (cell.sym === "wild") {
    return (
      <div className={`sym-wild${cell.gold ? " gold" : ""}`}>
        <div className="cross" />
        <span className="nx">{cell.mult ?? 1}x</span>
      </div>
    );
  }

  if (cell.sym === "scatter") {
    return (
      <div className="sym-scatter">
        <span className="glyph">{meta.glyph}</span>
      </div>
    );
  }

  if (meta.tier === "high") {
    return (
      <div className="sym-char" style={{ "--sym-frame": meta.frame! } as CSSProperties}>
        <span className="glyph">{meta.glyph}</span>
      </div>
    );
  }

  // low card symbol
  const style = {
    "--sym-g0": meta.grad[0],
    "--sym-g1": meta.grad[1],
    "--sym-accent": meta.accent,
    "--sym-rim": meta.rim,
  } as CSSProperties;
  return (
    <div className="cell-inner">
      <span className={`sym-letter${cell.sym === "10" ? " ten" : ""}`} style={style}>
        {meta.glyph}
      </span>
      <span className="sym-trap" />
    </div>
  );
}
