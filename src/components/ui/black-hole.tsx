import { useEffect, useRef, type CSSProperties } from "react";
import { createRenderer } from "./black-hole-utils/renderer";

type BlackHoleProps = {
  className?: string;
  style?: CSSProperties;
};

export function BlackHole({ className = "", style }: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createRenderer({ canvas });
    void renderer.ready;

    return () => renderer.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      style={style}
    />
  );
}

export default BlackHole;