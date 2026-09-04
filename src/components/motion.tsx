import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Centralised motion configuration. Keep every duration/easing here so
 * the whole product shares one motion language.
 * ------------------------------------------------------------------ */
export const motionConfig = {
  fast: 200,
  base: 240,
  slow: 520,
  stagger: 80,
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** True when the visitor has not asked for reduced motion. */
export function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return allowed;
}

/** True on hover-capable, fine-pointer devices with motion enabled (desktop). */
export function usePremiumPointer() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const hover = window.matchMedia("(hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(fine.matches && hover.matches && !reduced.matches);
    update();
    [fine, hover, reduced].forEach((q) => q.addEventListener("change", update));
    return () => [fine, hover, reduced].forEach((q) => q.removeEventListener("change", update));
  }, []);
  return ok;
}

/** Fires once when the element scrolls into view. */
export function useInView<T extends HTMLElement>(options?: { rootMargin?: string; once?: boolean }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (options?.once !== false) observer.disconnect();
          } else if (options?.once === false) {
            setInView(false);
          }
        }
      },
      { rootMargin: options?.rootMargin ?? "0px 0px -12% 0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.once]);

  return { ref, inView };
}

type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade";

const offsets: Record<RevealVariant, string> = {
  up: "translate3d(0,24px,0)",
  down: "translate3d(0,-18px,0)",
  left: "translate3d(22px,0,0)",
  right: "translate3d(-22px,0,0)",
  scale: "scale(0.965)",
  fade: "none",
};

/** Scroll-triggered reveal. No-op under prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  as?: "div" | "li" | "section" | "span";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const allowed = useMotionAllowed();
  const shown = inView || !allowed;

  const style: CSSProperties = allowed
    ? {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offsets[variant],
        transition: `opacity ${motionConfig.slow}ms ${motionConfig.ease} ${delay}ms, transform ${motionConfig.slow}ms ${motionConfig.ease} ${delay}ms`,
        willChange: "opacity, transform",
      }
    : {};

  return (
    <Tag ref={ref as never} style={style} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers Reveal over a list of children. */
export function RevealGroup({
  children,
  className,
  step = motionConfig.stagger,
  variant = "up",
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  variant?: RevealVariant;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * step} variant={variant}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/** Counts from 0 to `value` when scrolled into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 900,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const allowed = useMotionAllowed();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (!allowed) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, allowed]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/** Animated circular score ring. */
export function ScoreRing({
  value,
  size = 76,
  label = "match",
  className,
}: {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const allowed = useMotionAllowed();
  const stroke = Math.max(4, Math.round(size / 12));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = inView || !allowed ? value / 100 : 0;

  return (
    <div ref={ref} className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-accent"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference * (1 - progress),
            transition: allowed ? `stroke-dashoffset 1100ms ${motionConfig.ease}` : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <span className="font-display text-sm font-bold">
            <CountUp value={value} suffix="%" />
          </span>
          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Animated horizontal score bar. */
export function ScoreBar({ value, className }: { value: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const allowed = useMotionAllowed();
  return (
    <div ref={ref} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-accent"
        style={{
          width: `${inView || !allowed ? value : 0}%`,
          transition: allowed ? `width 1000ms ${motionConfig.ease}` : undefined,
        }}
      />
    </div>
  );
}

/**
 * Magnetic wrapper for primary CTAs: the child drifts a few pixels toward the
 * cursor and springs back on leave. Desktop + motion-enabled only.
 */
export function Magnetic({
  children,
  className,
  strength = 0.22,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const enabled = usePremiumPointer();
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const node = ref.current;
      if (!enabled || !node) return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-max, Math.min(max, dx * strength));
      const y = Math.max(-max, Math.min(max, dy * strength));
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [enabled, strength, max],
  );

  const reset = useCallback(() => {
    const node = ref.current;
    if (node) node.style.transform = "translate3d(0,0,0)";
  }, []);

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={reset}
      className={cn("inline-flex", className)}
      style={enabled ? { transition: `transform ${motionConfig.base}ms ${motionConfig.ease}` } : undefined}
    >
      {children}
    </span>
  );
}

/** Subtle pointer-driven tilt for cards. Desktop + motion-enabled only. */
export function Tilt({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const enabled = usePremiumPointer();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!enabled || !node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translate3d(0,-4px,0)`;
    node.style.setProperty("--spot-x", `${(px + 0.5) * 100}%`);
    node.style.setProperty("--spot-y", `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = "perspective(900px) rotateX(0) rotateY(0) translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("tilt-surface", className)}
      style={enabled ? { transition: `transform ${motionConfig.base}ms ${motionConfig.ease}` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Returns a normalised pointer offset (-1..1) for the referenced container,
 * smoothed with a single rAF loop. Used for hero depth/parallax.
 */
export function usePointerDepth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const enabled = usePremiumPointer();

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width - 0.5;
      target.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      node.style.setProperty("--depth-x", current.x.toFixed(4));
      node.style.setProperty("--depth-y", current.y.toFixed(4));
      frame = requestAnimationFrame(loop);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return ref;
}

/** Shared props for magnetic-styled buttons. */
export function MagneticButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const memoClass = useMemo(() => cn("btn-press", className), [className]);
  return (
    <Magnetic>
      <button {...props} className={memoClass}>
        {children}
      </button>
    </Magnetic>
  );
}

/**
 * Media wrapper: fades + scales gently (1.0 -> 1.03) when scrolled into view
 * and drifts with a soft parallax offset. transform/opacity only.
 */
export function ParallaxMedia({
  children,
  className,
  distance = 14,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false });
  const allowed = useMotionAllowed();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!allowed || !inView) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      setOffset(Math.max(-1, Math.min(1, progress)) * distance);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [allowed, inView, distance, ref]);

  return (
    <div
      ref={ref}
      data-inview={allowed ? String(inView) : undefined}
      className={cn("media-fluid", className)}
      style={
        allowed
          ? {
              transform: `translate3d(0, ${offset}px, 0)`,
              transition: `transform 120ms linear`,
              willChange: "transform",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
