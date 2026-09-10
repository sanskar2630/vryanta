type RendererOptions = {
  canvas: HTMLCanvasElement;
};

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
};

const TAU = Math.PI * 2;
const COLORS = ["#8be9fd", "#65d8ff", "#a78bfa", "#f0abfc", "#f8fafc"];

export function createRenderer({ canvas }: RendererOptions) {
  const context = canvas.getContext("2d");
  if (!context) {
    return {
      ready: Promise.resolve(),
      dispose: () => undefined,
    };
  }

  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let ratio = 1;
  let elapsed = 0;
  let lastTime = performance.now();
  let pointerX = 0.5;
  let pointerY = 0.5;
  let disposed = false;

  const particles: Particle[] = Array.from({ length: 170 }, (_, index) => ({
    angle: Math.random() * TAU,
    radius: 0.2 + Math.random() * 0.8,
    speed: 0.09 + Math.random() * 0.2,
    size: 0.5 + Math.random() * 1.8,
    alpha: 0.24 + Math.random() * 0.7,
    color: COLORS[index % COLORS.length] ?? COLORS[0],
  }));

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const move = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  };

  const draw = (time: number) => {
    if (disposed) return;
    const delta = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;
    elapsed += delta;

    context.clearRect(0, 0, width, height);

    const centerX = width * (0.5 + (pointerX - 0.5) * 0.035);
    const centerY = height * (0.5 + (pointerY - 0.5) * 0.035);
    const scale = Math.min(width, height);
    const diskX = scale * 0.3;
    const diskY = scale * 0.105;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(-0.1 + (pointerX - 0.5) * 0.08);
    context.scale(1, 0.36);

    const diskGradient = context.createRadialGradient(0, 0, scale * 0.075, 0, 0, diskX);
    diskGradient.addColorStop(0, "rgba(4, 7, 18, 0.98)");
    diskGradient.addColorStop(0.22, "rgba(14, 15, 42, 0.98)");
    diskGradient.addColorStop(0.5, "rgba(115, 83, 255, 0.62)");
    diskGradient.addColorStop(0.72, "rgba(65, 210, 255, 0.2)");
    diskGradient.addColorStop(1, "rgba(65, 210, 255, 0)");
    context.fillStyle = diskGradient;
    context.beginPath();
    context.ellipse(0, 0, diskX, diskY * 2.5, 0, 0, TAU);
    context.fill();
    context.restore();

    for (const particle of particles) {
      particle.angle += particle.speed * delta;
      const radius = particle.radius * diskX;
      const wobble = Math.sin(elapsed * 1.4 + particle.angle * 3) * diskY * 0.38;
      const x = centerX + Math.cos(particle.angle) * radius;
      const y = centerY + Math.sin(particle.angle) * radius * 0.28 + wobble;
      const depth = 0.45 + 0.55 * (0.5 + Math.sin(particle.angle));

      context.globalAlpha = particle.alpha * depth;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(x, y, particle.size * depth, 0, TAU);
      context.fill();
    }
    context.globalAlpha = 1;

    const shadowRadius = scale * 0.09;
    const shadow = context.createRadialGradient(centerX, centerY, shadowRadius * 0.38, centerX, centerY, shadowRadius * 1.8);
    shadow.addColorStop(0, "rgba(0, 0, 0, 1)");
    shadow.addColorStop(0.45, "rgba(2, 4, 14, 0.98)");
    shadow.addColorStop(0.67, "rgba(119, 91, 255, 0.22)");
    shadow.addColorStop(1, "rgba(65, 210, 255, 0)");
    context.fillStyle = shadow;
    context.beginPath();
    context.arc(centerX, centerY, shadowRadius * 1.8, 0, TAU);
    context.fill();

    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", move, { passive: true });
  animationFrame = requestAnimationFrame(draw);

  return {
    ready: Promise.resolve(),
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", move);
    },
  };
}