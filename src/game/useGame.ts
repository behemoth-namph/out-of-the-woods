import { useCallback, useEffect, useRef, useState } from "react";
import type { Board, BetMode, GameMode, RespinStep, WinningLine } from "./types";
import { ROWS, REELS } from "./types";
import { SYMBOLS } from "./symbols";
import { makeRng, seedFrom } from "./rng";
import { applyCap, freeSpinsForScatters, resolveSpin } from "./engine";

// ── config ───────────────────────────────────────────────────────────────────
const BETS = [0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0, 250.0];
const DEFAULT_BET_INDEX = 3; // $2.00
const BASE_SEED = 0xc0ffee;
const COST_FACTOR: Record<BetMode, number> = { normal: 1, ante: 5, "super-spin": 10 };

// presentation durations (ms at normal speed)
// drop/respinDrop cover the reel-blur phase + the staggered L→R landing in
// BoardView.spinReel/landReel (last reel: lead + 0.3s drop + row cascade).
const T = {
  drop: 1000,
  respinDrop: 750,
  stackDetect: 320,
  winHold: 1000,
  shift: 460,
  stepGap: 220,
  fsGap: 520,
  flame: 520,
  swirl: 900,
  tier: 2100,
};

// win-tier thresholds in × total bet
function tierFor(winX: number): { word: string; swirl: boolean } | null {
  if (winX >= 250) return { word: "SUPER WIN", swirl: true };
  if (winX >= 75) return { word: "MEGA WIN", swirl: true };
  if (winX >= 25) return { word: "BIG WIN", swirl: true };
  if (winX >= 8) return { word: "NICE!", swirl: false };
  return null;
}

const IDLE_BOARD: Board = [
  [{ sym: "10" }, { sym: "J" }, { sym: "Q" }, { sym: "K" }, { sym: "A" }],
  [{ sym: "A" }, { sym: "K" }, { sym: "Q" }, { sym: "J" }, { sym: "10" }],
  [{ sym: "J" }, { sym: "Q" }, { sym: "K" }, { sym: "A" }, { sym: "10" }],
  [{ sym: "Q" }, { sym: "A" }, { sym: "J" }, { sym: "K" }, { sym: "10" }],
];

export interface GameState {
  balance: number;
  betIndex: number;
  betMode: BetMode;
  mode: GameMode;
  board: Board;
  spinKey: number;
  heldReels: number[];
  badge: number;
  winningLines: WinningLine[];
  roundWin: number;
  callout: { amount: number; note: string } | null;
  freeSpinsRemaining: number;
  freeSpinIndex: number;
  busy: boolean;
  quickSpin: boolean;
  autoplay: boolean;
  modal: "buy" | "special" | null;
  fsIntro: number | null;
  fsOutro: { total: number; spins: number } | null;
  winTier: { word: string; amount: number } | null;
  flameReels: number[];
  swirl: boolean;
  rebuyOffered: boolean;
}

const initial: GameState = {
  balance: 100000,
  betIndex: DEFAULT_BET_INDEX,
  betMode: "normal",
  mode: "base",
  board: IDLE_BOARD,
  spinKey: 0,
  heldReels: [],
  badge: 1,
  winningLines: [],
  roundWin: 0,
  callout: null,
  freeSpinsRemaining: 0,
  freeSpinIndex: 0,
  busy: false,
  quickSpin: false,
  autoplay: false,
  modal: null,
  fsIntro: null,
  fsOutro: null,
  winTier: null,
  flameReels: [],
  swirl: false,
  rebuyOffered: false,
};

function lineNote(step: RespinStep): string {
  if (!step.winningLines.length) return "";
  const top = [...step.winningLines].sort((a, b) => b.linePay - a.linePay)[0];
  const name = SYMBOLS[top.sym].name.toUpperCase();
  const multTxt = top.lineMult > 1 ? ` ×${top.lineMult}` : "";
  const extra = step.winningLines.length > 1 ? ` +${step.winningLines.length - 1}` : "";
  return `${top.count}× ${name} · LINE ${top.line}${multTxt}${extra}`;
}

export function useGame() {
  const [state, setRaw] = useState<GameState>(initial);
  const ref = useRef<GameState>(initial);
  const spinCounter = useRef(0);
  const turbo = useRef(false);
  const continueResolver = useRef<null | (() => void)>(null);
  const autoTimer = useRef<number | null>(null);

  const set = useCallback((patch: Partial<GameState> | ((s: GameState) => Partial<GameState>)) => {
    const p = typeof patch === "function" ? patch(ref.current) : patch;
    ref.current = { ...ref.current, ...p };
    setRaw(ref.current);
  }, []);

  const speed = useCallback(
    () => (turbo.current ? 0.28 : ref.current.quickSpin ? 0.6 : 1),
    []
  );
  const wait = useCallback(
    (ms: number) => new Promise<void>((r) => setTimeout(r, Math.max(0, ms * speed()))),
    [speed]
  );

  const nextRng = useCallback(() => makeRng(seedFrom(BASE_SEED, spinCounter.current++)), []);

  const totalBet = () => BETS[ref.current.betIndex];

  const waitContinue = useCallback((timeout: number) => {
    return new Promise<void>((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        continueResolver.current = null;
        resolve();
      };
      continueResolver.current = finish;
      window.setTimeout(finish, timeout);
    });
  }, []);

  const onContinue = useCallback(() => continueResolver.current?.(), []);

  // ── present one spin's steps (initial land + respin chain) ─────────────────
  const presentSteps = useCallback(
    async (steps: RespinStep[], freeOffset = 0) => {
      let acc = 0;
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const held = i === 0 ? [] : steps[i - 1].stackReels;
        const newStacks = step.stackReels.filter((r) => !held.includes(r));

        // anticipation flame on newly-appearing stack reels
        if (newStacks.length) {
          set({ flameReels: newStacks });
          await wait(T.flame);
          set({ flameReels: [] });
        }

        set({ board: step.board, spinKey: ref.current.spinKey + 1, heldReels: held, winningLines: [], callout: null });
        await wait(i === 0 ? T.drop : T.respinDrop);

        if (step.topMultiplier) {
          set({ badge: step.topMultiplier });
          await wait(T.stackDetect);
        }

        if (step.winningLines.length) {
          acc += step.stepWin;
          set({
            winningLines: step.winningLines,
            roundWin: freeOffset + acc,
            callout: { amount: step.stepWin, note: lineNote(step) },
          });
          await wait(T.winHold);
          if (i < steps.length - 1) {
            // a respin follows — clear highlight, let the ladder climb
            set({ winningLines: [], callout: null });
            await wait(T.shift);
          }
        } else {
          set({ winningLines: [], callout: null });
        }
        await wait(T.stepGap);
      }
      return acc;
    },
    [set, wait]
  );

  // ── win-tier celebration ───────────────────────────────────────────────────
  const celebrate = useCallback(
    async (win: number) => {
      const t = tierFor(win / totalBet());
      if (!t) return;
      if (t.swirl) {
        set({ swirl: true });
        await wait(T.swirl);
        set({ swirl: false });
      }
      set({ winTier: { word: t.word, amount: win } });
      await wait(T.tier);
      set({ winTier: null });
    },
    [set, wait]
  );

  // ── free-spins feature ─────────────────────────────────────────────────────
  const runFreeSpins = useCallback(
    async (award: number, superMode: boolean) => {
      set({ fsIntro: award });
      await waitContinue(2800);
      set({ fsIntro: null, mode: "free", badge: 1, winningLines: [], callout: null, roundWin: 0 });

      let remaining = award;
      let idx = 0;
      let fsWin = 0;
      let stored = superMode ? nextRng().int(10, 13) : 0;

      while (remaining > 0) {
        idx++;
        set({ freeSpinsRemaining: remaining, freeSpinIndex: idx, badge: Math.max(1, stored), winningLines: [], callout: null });
        await wait(T.fsGap);

        const res = resolveSpin({ rng: nextRng(), totalBet: totalBet(), mode: "free", storedTop: stored });
        await presentSteps(res.steps, fsWin);
        // per-spin cap, then cumulative feature cap (docs: feature total ≤ 10,000× bet)
        fsWin = applyCap(fsWin + applyCap(res.chainWin, totalBet()), totalBet());
        stored = Math.max(stored, res.topMultReached);
        set({ roundWin: fsWin });

        const retrig = freeSpinsForScatters(res.scatterCount);
        if (retrig) {
          remaining += retrig;
          set({ freeSpinsRemaining: remaining });
          await wait(T.fsGap);
        }
        remaining -= 1;
        set({ freeSpinsRemaining: remaining });
        await wait(T.fsGap);
      }

      set({ fsOutro: { total: fsWin, spins: idx } });
      await waitContinue(60_000); // player-gated; require a click
      set((s) => ({
        fsOutro: null,
        mode: "base",
        balance: s.balance + fsWin,
        board: IDLE_BOARD,
        badge: 1,
        roundWin: fsWin,
        winningLines: [],
        callout: null,
        rebuyOffered: true,
      }));
    },
    [set, wait, waitContinue, presentSteps, nextRng]
  );

  // ── a base spin ────────────────────────────────────────────────────────────
  const doSpin = useCallback(async () => {
    const s = ref.current;
    if (s.busy || s.mode !== "base" || s.modal) return;
    const cost = totalBet() * COST_FACTOR[s.betMode];
    if (s.balance < cost) return;

    turbo.current = false;
    set({
      busy: true,
      balance: s.balance - cost,
      roundWin: 0,
      winningLines: [],
      callout: null,
      badge: 1,
      heldReels: [],
      rebuyOffered: false,
    });

    const bet = totalBet();
    const res = resolveSpin({
      rng: nextRng(),
      totalBet: bet,
      mode: "base",
      guaranteeStack: s.betMode === "super-spin",
    });

    await presentSteps(res.steps);

    const win = applyCap(res.chainWin, bet);
    set((st) => ({ balance: st.balance + win, roundWin: win }));

    if (win > 0) await celebrate(win);

    const award = s.betMode === "super-spin" ? 0 : freeSpinsForScatters(res.scatterCount);
    if (award > 0) await runFreeSpins(award, false);

    set({ busy: false });
  }, [set, presentSteps, celebrate, runFreeSpins, nextRng]);

  // ── buy feature ────────────────────────────────────────────────────────────
  const buy = useCallback(
    async (superMode: boolean) => {
      const s = ref.current;
      if (s.busy) return;
      const cost = (superMode ? 500 : 100) * totalBet();
      if (s.balance < cost) return;
      set({ busy: true, modal: null, balance: s.balance - cost, roundWin: 0, rebuyOffered: false });
      await runFreeSpins(10, superMode);
      set({ busy: false });
    },
    [set, runFreeSpins]
  );

  // ── actions ────────────────────────────────────────────────────────────────
  const actions = {
    spin: doSpin,
    stop: () => {
      turbo.current = true;
    },
    betDown: () => set((s) => ({ betIndex: Math.max(0, s.betIndex - 1) })),
    betUp: () => set((s) => ({ betIndex: Math.min(BETS.length - 1, s.betIndex + 1) })),
    toggleQuick: () => set((s) => ({ quickSpin: !s.quickSpin })),
    toggleAuto: () => set((s) => ({ autoplay: !s.autoplay })),
    openBuy: () => set({ modal: "buy" }),
    openSpecial: () => set({ modal: "special" }),
    closeModal: () => set({ modal: null }),
    setBetMode: (m: BetMode) => set({ betMode: m, modal: null }),
    buyStandard: () => buy(false),
    buySuper: () => buy(true),
    rebuy: () => buy(false),
    continueOverlay: onContinue,
  };

  // ── keyboard: space = spin / turbo ─────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (ref.current.fsIntro !== null || ref.current.fsOutro) {
        onContinue();
        return;
      }
      if (!e.repeat && !ref.current.busy && ref.current.mode === "base") doSpin();
      turbo.current = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") turbo.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [doSpin, onContinue]);

  // ── autoplay loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.autoplay && !state.busy && state.mode === "base" && !state.modal) {
      autoTimer.current = window.setTimeout(() => doSpin(), 500);
      return () => {
        if (autoTimer.current) window.clearTimeout(autoTimer.current);
      };
    }
  }, [state.autoplay, state.busy, state.mode, state.modal, doSpin]);

  const canBetDown = state.betIndex > 0;
  const canBetUp = state.betIndex < BETS.length - 1;

  return {
    state,
    totalBet: BETS[state.betIndex],
    rebuyCost: 100 * BETS[state.betIndex],
    canBetDown,
    canBetUp,
    actions,
    ROWS,
    REELS,
  };
}
