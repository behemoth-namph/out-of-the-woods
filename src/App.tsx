import { useEffect, useRef } from "react";
import { useGame } from "./game/useGame";
import { PixiGame, type GameApi } from "./pixi/PixiGame";

// The entire game is rendered on a WebGL canvas by PixiJS + GSAP.
// React is only a thin bootstrap: it mounts the Pixi app once and pushes each
// `useGame` state snapshot into the Pixi view. All interactions come back out
// through `actions`.
export default function App() {
  const g = useGame();
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PixiGame | null>(null);
  const readyRef = useRef(false);

  // keep the latest game api reachable from inside Pixi event handlers
  const apiRef = useRef<GameApi>(g as unknown as GameApi);
  apiRef.current = g as unknown as GameApi;

  useEffect(() => {
    let disposed = false;
    const game = new PixiGame();
    (async () => {
      await game.init(hostRef.current!);
      if (disposed) {
        game.destroy();
        return;
      }
      game.bind(() => apiRef.current);
      gameRef.current = game;
      readyRef.current = true;
      game.update(apiRef.current);
    })();
    return () => {
      disposed = true;
      readyRef.current = false;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  // push every state change into the Pixi view
  useEffect(() => {
    if (readyRef.current) gameRef.current?.update(apiRef.current);
  });

  return <div ref={hostRef} className="host" />;
}
