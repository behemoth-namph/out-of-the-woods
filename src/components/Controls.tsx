import type { BetMode, GameMode } from "../game/types";

interface Props {
  balance: number;
  totalBet: number;
  betMode: BetMode;
  mode: GameMode;
  roundWin: number;
  busy: boolean;
  quickSpin: boolean;
  autoplay: boolean;
  canBetDown: boolean;
  canBetUp: boolean;
  winLabel: string; // e.g. "WINNER", "FREE SPINS LEFT 6", ""
  onSpin: () => void;
  onStop: () => void;
  onBetDown: () => void;
  onBetUp: () => void;
  onToggleQuick: () => void;
  onToggleAuto: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BET_LABEL: Record<BetMode, string> = {
  normal: "",
  ante: "ANTE 125×",
  "super-spin": "SUPER 250×",
};

export function Controls(p: Props) {
  return (
    <div className="footer">
      <div className="readouts">
        <div>
          <div className="ro-label">CREDIT</div>
          <div className="ro-val">${fmt(p.balance)}</div>
        </div>
        <div>
          <div className="ro-label">BET{BET_LABEL[p.betMode] ? ` · ${BET_LABEL[p.betMode]}` : ""}</div>
          <div className="ro-val">${fmt(p.totalBet)}</div>
        </div>
      </div>

      <div className="win-readout">
        {p.roundWin > 0 ? (
          <>
            <div className="wl">WIN</div>
            <div className="wv">${fmt(p.roundWin)}</div>
            <div className="sub">{p.winLabel}</div>
          </>
        ) : (
          <div className="sub">{p.mode === "free" ? p.winLabel : "SPIN TO WIN!"}</div>
        )}
      </div>

      <div className="spin-cluster">
        <div className="mini-toggles">
          <span className={`mini${p.quickSpin ? " on" : ""}`} onClick={p.onToggleQuick}>
            QUICK
          </span>
          <span className={`mini${p.autoplay ? " on" : ""}`} onClick={p.onToggleAuto}>
            AUTO
          </span>
        </div>
        <button
          className="bet-step"
          onClick={p.onBetDown}
          disabled={p.busy || !p.canBetDown || p.mode === "free"}
        >
          −
        </button>
        <button
          className="bet-step"
          onClick={p.onBetUp}
          disabled={p.busy || !p.canBetUp || p.mode === "free"}
        >
          +
        </button>
        <div style={{ position: "relative" }}>
          <button
            className={`spin-btn${p.busy ? " busy" : ""}${p.autoplay ? " stop" : ""}`}
            onClick={p.busy ? p.onStop : p.onSpin}
          >
            <span className="glyph">{p.autoplay && !p.busy ? "■" : "⟳"}</span>
          </button>
          <div className="autoplay-label">
            {p.mode === "free" ? "FREE SPIN" : "HOLD SPACE = TURBO"}
          </div>
        </div>
      </div>
    </div>
  );
}
