import type { GameMode } from "../game/types";

interface Props {
  mode: GameMode;
  freeSpinsRemaining: number;
  rebuyOffered: boolean;
  rebuyCost: number;
  busy: boolean;
  onBuy: () => void;
  onSpecial: () => void;
  onRebuy: () => void;
}

export function LeftPanel({
  mode,
  freeSpinsRemaining,
  rebuyOffered,
  rebuyCost,
  busy,
  onBuy,
  onSpecial,
  onRebuy,
}: Props) {
  if (mode === "free") {
    return (
      <div className="col-left">
        <div className="fs-counter">
          <div className="num">{freeSpinsRemaining}</div>
          <div className="lbl">FREE SPINS LEFT</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-left">
      <div className={`plate${busy ? " disabled" : ""}`} onClick={busy ? undefined : onBuy}>
        <div className="t1">BUY FEATURE</div>
        <div className="t2">2 OPTIONS</div>
      </div>

      {rebuyOffered && (
        <div className={`plate${busy ? " disabled" : ""}`} onClick={busy ? undefined : onRebuy}>
          <div className="t1">REBUY FREE SPINS</div>
          <div className="t2">${rebuyCost.toFixed(2)}</div>
        </div>
      )}

      <div className={`plate${busy ? " disabled" : ""}`} onClick={busy ? undefined : onSpecial}>
        <div className="t1">SPECIAL BETS</div>
        <div className="t2">2 OPTIONS</div>
        <div className="arrow">➜</div>
      </div>
    </div>
  );
}
