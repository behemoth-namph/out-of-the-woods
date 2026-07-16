import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { BetMode } from "../game/types";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Buy Feature modal ────────────────────────────────────────────────────────
export function BuyFeatureModal({
  totalBet,
  balance,
  onBet,
  canDown,
  canUp,
  onBuyStandard,
  onBuySuper,
  onClose,
}: {
  totalBet: number;
  balance: number;
  onBet: (dir: -1 | 1) => void;
  canDown: boolean;
  canUp: boolean;
  onBuyStandard: () => void;
  onBuySuper: () => void;
  onClose: () => void;
}) {
  const standardCost = 100 * totalBet;
  const superCost = 500 * totalBet;
  return (
    <div className="overlay">
      <div className="scrim" onClick={onClose} />
      <div className="modal">
        <span className="close" onClick={onClose}>
          ✕
        </span>
        <h2>BUY FEATURE</h2>
        <div className="buy-opts">
          <div
            className="buy-card"
            style={{ opacity: balance >= standardCost ? 1 : 0.5 }}
            onClick={balance >= standardCost ? onBuyStandard : undefined}
          >
            <div className="name">FREE SPINS</div>
            <div className="price">${fmt(standardCost)}</div>
            <div className="desc">STANDARD FREE SPINS</div>
          </div>
          <div
            className="buy-card"
            style={{ opacity: balance >= superCost ? 1 : 0.5 }}
            onClick={balance >= superCost ? onBuySuper : undefined}
          >
            <div className="name">SUPER FREE SPINS</div>
            <div className="price">${fmt(superCost)}</div>
            <div className="desc">WILDS START FROM 10×</div>
          </div>
        </div>
        <div className="bet-row">
          <span className="label">BASE BET</span>
          <button className="round-btn" onClick={() => onBet(-1)} disabled={!canDown}>
            −
          </button>
          <div className="bet-pill">${fmt(totalBet)}</div>
          <button className="round-btn" onClick={() => onBet(1)} disabled={!canUp}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Special Bets modal (Ante / Super Spin) ───────────────────────────────────
export function SpecialBetsModal({
  betMode,
  onSelect,
  onClose,
}: {
  betMode: BetMode;
  onSelect: (m: BetMode) => void;
  onClose: () => void;
}) {
  return (
    <div className="overlay">
      <div className="scrim" onClick={onClose} />
      <div className="modal">
        <span className="close" onClick={onClose}>
          ✕
        </span>
        <h2>SPECIAL BETS</h2>
        <div className="special-opts">
          <div
            className={`special-card${betMode === "normal" ? " active" : ""}`}
            onClick={() => onSelect("normal")}
          >
            <div>
              <div className="sc-name">NORMAL PLAY</div>
              <div className="sc-desc">Standard 25× bet. Free spins trigger naturally.</div>
            </div>
            <div className="sc-mult">25×</div>
          </div>
          <div
            className={`special-card${betMode === "ante" ? " active" : ""}`}
            onClick={() => onSelect("ante")}
          >
            <div>
              <div className="sc-name">ANTE BET</div>
              <div className="sc-desc">
                The chance to trigger the FREE SPINS feature is 12 times higher.
              </div>
            </div>
            <div className="sc-mult">125×</div>
          </div>
          <div
            className={`special-card${betMode === "super-spin" ? " active" : ""}`}
            onClick={() => onSelect("super-spin")}
          >
            <div>
              <div className="sc-name">SUPER SPIN</div>
              <div className="sc-desc">
                Guarantees a Wild Multiplier stack every spin. Disables free spins.
              </div>
            </div>
            <div className="sc-mult">250×</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Free-spins intro cinematic ───────────────────────────────────────────────
export function FreeSpinsIntro({ spins, onContinue }: { spins: number; onContinue: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(".congrats", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.8)" })
        .fromTo(".sub-w", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.1")
        .fromTo(".big-num", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.4)" }, "-=0.1");
    },
    { scope: root }
  );
  return (
    <div className="cine fs-intro" ref={root} onClick={onContinue}>
      <div className="moon" />
      <div>
        <div className="congrats">CONGRATULATIONS</div>
        <div className="sub-w">YOU HAVE WON</div>
        <div className="big-num">{spins}</div>
        <div className="sub-w">FREE SPINS</div>
        <div className="press">PRESS ANYWHERE TO CONTINUE</div>
      </div>
    </div>
  );
}

// ── Free-spins outro summary ─────────────────────────────────────────────────
export function FreeSpinsOutro({
  total,
  spins,
  onContinue,
}: {
  total: number;
  spins: number;
  onContinue: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".cine .congrats",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      const obj = { v: 0 };
      gsap.to(obj, {
        v: total,
        duration: 1.1,
        ease: "power1.out",
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = "$" + fmt(obj.v);
        },
      });
    },
    { scope: root }
  );
  return (
    <div className="cine fs-outro" ref={root} onClick={onContinue}>
      <div>
        <div className="congrats">FREE SPINS COMPLETED</div>
        <div className="sub-w">YOU HAVE WON</div>
        <div className="big-num" ref={numRef}>
          $0.00
        </div>
        <div className="sub-w">IN {spins} FREE SPINS</div>
        <div className="press">PRESS ANYWHERE TO CONTINUE</div>
      </div>
    </div>
  );
}

// ── Win-tier banner (NICE! / BIG WIN …) with coin fall ───────────────────────
const COIN_GLYPHS = ["🪙", "💰", "🟡"];
export function WinTierBanner({ word, amount }: { word: string; amount: number }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".tier .word", {
        y: -80,
        scale: 0.5,
        opacity: 0,
        duration: 0.42,
        ease: "back.out(2.2)",
      });
      gsap.from(".tier .tier-amt", { opacity: 0, y: 20, delay: 0.2, duration: 0.3 });
      // coins
      const coins = gsap.utils.toArray<HTMLElement>(".tier .coin");
      coins.forEach((coin, i) => {
        gsap.set(coin, { x: gsap.utils.random(-560, 560), y: -60, rotation: 0 });
        gsap.to(coin, {
          y: 460,
          rotation: gsap.utils.random(-360, 360),
          duration: gsap.utils.random(1.1, 1.8),
          ease: "power1.in",
          delay: (i % 12) * 0.06,
          repeat: -1,
        });
      });
    },
    { scope: root }
  );
  return (
    <div className="tier" ref={root}>
      <div className="scene" />
      {Array.from({ length: 24 }).map((_, i) => (
        <span className="coin" key={i}>
          {COIN_GLYPHS[i % COIN_GLYPHS.length]}
        </span>
      ))}
      <div className="word">{word}</div>
      <div className="tier-amt">${fmt(amount)}</div>
    </div>
  );
}

// ── Floating per-step win callout over the board ─────────────────────────────
export function WinCallout({ amount, note }: { amount: number; note: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        root.current,
        { y: 20, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.26, ease: "back.out(1.7)" }
      );
    },
    { dependencies: [amount, note] }
  );
  return (
    <div className="win-callout" ref={root}>
      <div className="amt">${fmt(amount)}</div>
      {note && <div className="line-note">{note}</div>}
    </div>
  );
}
