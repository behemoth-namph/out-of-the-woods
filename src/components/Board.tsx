import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Board as BoardT, WinningLine } from "../game/types";
import { REELS, ROWS } from "../game/types";
import { SymbolIcon } from "./SymbolIcon";

interface Props {
  board: BoardT;
  /** increments each time reels should re-drop; drives the drop animation. */
  spinKey: number;
  /** which reels are held (stack reels) during a respin — they don't re-drop. */
  heldReels: number[];
  winningCells: Set<string>;
  anyWin: boolean;
  speed: number; // 1 normal, 0.6 quick, 0.3 turbo
  flameReels: number[];
}

const cellKey = (r: number, c: number) => `${r}-${c}`;

export function Board({ board, spinKey, heldReels, winningCells, anyWin, speed, flameReels }: Props) {
  const root = useRef<HTMLDivElement>(null);

  // Reel-drop animation: each non-held reel column slides/fades in, staggered L→R.
  useGSAP(
    () => {
      if (spinKey === 0) return;
      const drop = 0.34 * speed;
      for (let reel = 0; reel < REELS; reel++) {
        if (heldReels.includes(reel)) continue;
        const cells = gsap.utils.toArray<HTMLElement>(`[data-reel="${reel}"]`);
        gsap.fromTo(
          cells,
          { y: -60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: drop,
            ease: "back.out(1.5)",
            stagger: 0.03 * speed,
            delay: reel * 0.06 * speed,
            overwrite: true,
          }
        );
      }
    },
    { dependencies: [spinKey], scope: root }
  );

  return (
    <div className="board" ref={root}>
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: REELS }).map((_, c) => {
          const cell = board[r]?.[c];
          if (!cell) return null;
          const isWin = winningCells.has(cellKey(r, c));
          const dim = anyWin && !isWin;
          return (
            <div
              key={cellKey(r, c)}
              data-reel={c}
              className={`cell${isWin ? " win" : ""}${dim ? " dim" : ""}`}
            >
              <SymbolIcon cell={cell} />
              <span className="win-hi" />
            </div>
          );
        })
      )}
      {flameReels.map((c) => (
        <div key={`flame-${c}`} className="flame-col" style={{ left: 6 + c * 98 }} />
      ))}
    </div>
  );
}

export function winningCellSet(lines: WinningLine[]): Set<string> {
  const s = new Set<string>();
  for (const l of lines) for (const [r, c] of l.cells) s.add(cellKey(r, c));
  return s;
}
