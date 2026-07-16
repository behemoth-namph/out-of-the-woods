import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Logo() {
  return (
    <div className="logo">
      <span className="wing left" />
      <span className="wing right" />
      <div className="l1">OUT OF THE</div>
      <div className="l2">WOODS</div>
    </div>
  );
}

/** Carved owl totem + the climbing WILD MULTIPLIER badge. */
export function OwlBadge({ multiplier }: { multiplier: number }) {
  const valRef = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      if (!valRef.current) return;
      gsap.fromTo(
        valRef.current,
        { scale: 1.6 },
        { scale: 1, duration: 0.45, ease: "back.out(2.4)" }
      );
    },
    { dependencies: [multiplier] }
  );
  return (
    <div className="owl-col">
      <div className="owl">🦉</div>
      <div className="owl-word">WILD MULTIPLIER</div>
      <div className="badge">
        <div className="cross" />
        <span className="val" ref={valRef}>
          {Math.max(1, multiplier)}x
        </span>
      </div>
    </div>
  );
}
