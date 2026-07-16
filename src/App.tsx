import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGame } from "./game/useGame";
import { Board, winningCellSet } from "./components/Board";
import { Logo, OwlBadge } from "./components/Chrome";
import { LeftPanel } from "./components/LeftPanel";
import { Controls } from "./components/Controls";
import {
  BuyFeatureModal,
  SpecialBetsModal,
  FreeSpinsIntro,
  FreeSpinsOutro,
  WinTierBanner,
  WinCallout,
} from "./components/Overlays";

gsap.registerPlugin(useGSAP);

export default function App() {
  const g = useGame();
  const s = g.state;
  const stageRef = useRef<HTMLDivElement>(null);
  const swirlRef = useRef<HTMLDivElement>(null);

  // scale the fixed 1280×720 stage to fit the viewport
  useEffect(() => {
    const fit = () => {
      const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
      if (stageRef.current) stageRef.current.style.transform = `scale(${scale})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // full-screen swirl transition
  useGSAP(
    () => {
      if (!swirlRef.current) return;
      if (s.swirl) {
        gsap.fromTo(
          swirlRef.current,
          { opacity: 0, scale: 0.4, rotation: 0 },
          { opacity: 0.92, scale: 1.3, rotation: 90, duration: 0.45, ease: "power2.in" }
        );
      } else {
        gsap.to(swirlRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
      }
    },
    { dependencies: [s.swirl] }
  );

  const winCells = winningCellSet(s.winningLines);
  const anyWin = s.winningLines.length > 0;
  const speed = s.quickSpin ? 0.6 : 1;
  const isFree = s.mode === "free";

  const winLabel = isFree ? `FREE SPINS LEFT ${s.freeSpinsRemaining}` : "WINNER";

  return (
    <div className="viewport">
      <div className="stage" ref={stageRef}>
        {/* backgrounds */}
        <div className="bg bg-base" />
        <div className={`bg bg-free${isFree ? " show" : ""}`} />
        <div className="vignette" />
        <span className={`torch l${isFree ? " show" : ""}`}>🔥</span>
        <span className={`torch r${isFree ? " show" : ""}`}>🔥</span>

        <div className="layout">
          <LeftPanel
            mode={s.mode}
            freeSpinsRemaining={s.freeSpinsRemaining}
            rebuyOffered={s.rebuyOffered}
            rebuyCost={g.rebuyCost}
            busy={s.busy}
            onBuy={g.actions.openBuy}
            onSpecial={g.actions.openSpecial}
            onRebuy={g.actions.rebuy}
          />

          <div className="col-center">
            <Logo />
            <div className="frame">
              <Board
                board={s.board}
                spinKey={s.spinKey}
                heldReels={s.heldReels}
                winningCells={winCells}
                anyWin={anyWin}
                speed={speed}
                flameReels={s.flameReels}
              />
              {s.callout && <WinCallout amount={s.callout.amount} note={s.callout.note} />}
            </div>
          </div>

          <div className="col-right">
            <OwlBadge multiplier={s.badge} />
          </div>

          <div className="footer">
            <Controls
              balance={s.balance}
              totalBet={g.totalBet}
              betMode={s.betMode}
              mode={s.mode}
              roundWin={s.roundWin}
              busy={s.busy}
              quickSpin={s.quickSpin}
              autoplay={s.autoplay}
              canBetDown={g.canBetDown}
              canBetUp={g.canBetUp}
              winLabel={winLabel}
              onSpin={g.actions.spin}
              onStop={g.actions.stop}
              onBetDown={g.actions.betDown}
              onBetUp={g.actions.betUp}
              onToggleQuick={g.actions.toggleQuick}
              onToggleAuto={g.actions.toggleAuto}
            />
          </div>
        </div>

        <div className="brand">PRAGMATIC-STYLE DEMO · OUT OF THE WOODS</div>

        {/* effects */}
        <div className="swirl" ref={swirlRef} />

        {/* overlays */}
        {s.winTier && <WinTierBanner word={s.winTier.word} amount={s.winTier.amount} />}
        {s.fsIntro !== null && (
          <FreeSpinsIntro spins={s.fsIntro} onContinue={g.actions.continueOverlay} />
        )}
        {s.fsOutro && (
          <FreeSpinsOutro
            total={s.fsOutro.total}
            spins={s.fsOutro.spins}
            onContinue={g.actions.continueOverlay}
          />
        )}
        {s.modal === "buy" && (
          <BuyFeatureModal
            totalBet={g.totalBet}
            balance={s.balance}
            canDown={g.canBetDown}
            canUp={g.canBetUp}
            onBet={(d) => (d === 1 ? g.actions.betUp() : g.actions.betDown())}
            onBuyStandard={g.actions.buyStandard}
            onBuySuper={g.actions.buySuper}
            onClose={g.actions.closeModal}
          />
        )}
        {s.modal === "special" && (
          <SpecialBetsModal
            betMode={s.betMode}
            onSelect={g.actions.setBetMode}
            onClose={g.actions.closeModal}
          />
        )}
      </div>
    </div>
  );
}
