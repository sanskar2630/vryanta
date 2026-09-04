import { useEffect, useRef, useState } from "react";
import { usePremiumPointer } from "@/components/motion";

export { Reveal, RevealGroup, CountUp, ScoreRing, ScoreBar, Magnetic, Tilt } from "@/components/motion";

type CursorState = "default" | "link" | "button" | "card";

/**
 * Premium Vryanta cursor: inertial ring + precise dot, with hover states for
 * links, buttons and cards (cards show a subtle "VIEW" label).
 * Desktop hover pointers only; disabled for touch and prefers-reduced-motion.
 */
export function CursorGlow() {
  const enabled = usePremiumPointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      const el = event.target as HTMLElement | null;
      const card = el?.closest("[data-cursor='card']");
      const button = el?.closest("button,[role='button'],[data-cursor='button'],input[type='submit']");
      const link = el?.closest("a,[data-cursor='link']");
      setState(card ? "card" : button ? "button" : link ? "link" : "default");
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.17;
      ring.y += (target.y - ring.y) * 0.17;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
        ringRef.current.style.opacity = "1";
      }
      frame = requestAnimationFrame(loop);
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = state === "card" ? 64 : state === "button" ? 44 : state === "link" ? 34 : 26;
  const scale = pressed ? 0.85 : 1;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 opacity-0 fluid duration-300"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      >
        <div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/60 bg-accent/8 backdrop-blur-[1px]"
          style={{
            width: size,
            height: size,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transition: "width 260ms cubic-bezier(0.22,1,0.36,1), height 260ms cubic-bezier(0.22,1,0.36,1), transform 140ms ease-out, background-color 200ms ease",
            boxShadow: "0 0 18px -4px color-mix(in oklab, var(--accent) 55%, transparent)",
          }}
        >
          <span
            className="font-display text-[9px] font-bold uppercase tracking-widest text-accent"
            style={{ opacity: state === "card" ? 1 : 0, transition: "opacity 180ms ease" }}
          >
            View
          </span>
        </div>
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-accent opacity-0"
      />
    </div>
  );
}

/** Brief brand splash on first load. Never delays interaction artificially. */
export function BootSplash() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("vryanta:booted")) {
      setDone(true);
      setHidden(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFor = reduced ? 0 : 620;
    const t1 = setTimeout(() => setDone(true), showFor);
    const t2 = setTimeout(() => {
      setHidden(true);
      sessionStorage.setItem("vryanta:booted", "1");
    }, showFor + 420);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="surface-navy pointer-events-none fixed inset-0 z-[200] grid place-items-center fluid duration-400"
      style={{ opacity: done ? 0 : 1 }}
    >
      <div className="text-center">
        <p className="font-display text-2xl font-bold tracking-[0.32em]">VRYANTA</p>
        <div className="mx-auto mt-4 h-0.5 w-28 overflow-hidden rounded-full bg-navy-foreground/20">
          <div className="h-full w-full origin-left bg-accent" style={{ animation: "boot-progress 700ms ease-out forwards" }} />
        </div>
      </div>
    </div>
  );
}
