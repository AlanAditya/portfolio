import { useEffect, useRef } from "react";
export type Shape = "torus" | "sphere" | "wave";
type Props = {
  shape?: Shape;
  paused?: boolean;
  density?: number;
  interactive?: boolean;
};
// Deterministic 3D projection, deliberately independent from the native project demos.
export default function PointCloud({
  shape = "torus",
  paused = false,
  density = 1,
  interactive = true,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ shape, paused, density });
  state.current = { shape, paused, density };
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d", { alpha: true });
    if (!node || !ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      angle = 0,
      last = 0;
    let visible = true,
      pointerX = 0,
      pointerY = 0,
      dirty = true;
    let pointColor = "38,43,38",
      accentColor = "231,76,37";
    const syncPalette = () => {
      const style = getComputedStyle(document.documentElement);
      pointColor = style.getPropertyValue("--point-rgb").trim() || "38,43,38";
      accentColor =
        style.getPropertyValue("--point-accent-rgb").trim() || "231,76,37";
      dirty = true;
    };
    const themeObserver = new MutationObserver(syncPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    syncPalette();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const points: { x: number; y: number; z: number; hot: boolean }[] = [];
    let previousShape = "",
      previousDensity = 0;
    const generate = () => {
      points.length = 0;
      const rings = Math.round(100 * state.current.density);
      const rows = 38;
      for (let i = 0; i < rings; i++)
        for (let j = 0; j < rows; j++) {
          const u = (i / rings) * Math.PI * 2,
            v = (j / rows) * Math.PI * 2;
          let x: number, y: number, z: number;
          if (state.current.shape === "sphere") {
            const phi = (j / (rows - 1)) * Math.PI;
            x = Math.sin(phi) * Math.cos(u) * 1.35;
            y = Math.cos(phi) * 1.35;
            z = Math.sin(phi) * Math.sin(u) * 1.35;
          } else if (state.current.shape === "wave") {
            x = (i / rings - 0.5) * 3.4;
            z = (j / rows - 0.5) * 3.4;
            y = Math.sin(x * 2.2) * Math.cos(z * 2.2) * 0.45;
          } else {
            const twist = v + u * 3;
            const radius = 0.43 + 0.06 * Math.cos(u * 3);
            x = (1 + radius * Math.cos(twist)) * Math.cos(u);
            y = (1 + radius * Math.cos(twist)) * Math.sin(u);
            z = radius * Math.sin(twist);
          }
          points.push({
            x,
            y,
            z,
            hot:
              (i > rings * 0.54 && i < rings * 0.72) ||
              (state.current.shape === "wave" && y > 0.22),
          });
        }
      previousShape = state.current.shape;
      previousDensity = state.current.density;
    };
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden || now - last < 32) return;
      const moving = !state.current.paused && !reduced.matches;
      const changed =
        previousShape !== state.current.shape ||
        previousDensity !== state.current.density;
      if (!moving && !dirty && !changed) {
        last = now;
        return;
      }
      if (moving) angle += Math.min(now - (last || now), 50) * 0.00013;
      last = now;
      if (changed) generate();
      dirty = false;
      ctx!.clearRect(0, 0, width, height);
      const ay = 0.32 + Math.sin(angle) * 0.48 + pointerX * 0.3,
        ax = -0.78 + Math.cos(angle * 0.7) * 0.15 + pointerY * 0.22;
      const cy = Math.cos(ay),
        sy = Math.sin(ay),
        cx = Math.cos(ax),
        sx = Math.sin(ax);
      const scale = Math.min(width, height) * 0.28;
      for (const p of points) {
        const xx = p.x * cy - p.z * sy,
          zz = p.x * sy + p.z * cy;
        const yy = p.y * cx - zz * sx,
          z = p.y * sx + zz * cx;
        const perspective = 4.8 / (4.8 + z);
        const x = width / 2 + xx * scale * perspective;
        const y = height / 2 + yy * scale * perspective;
        const opacity = 0.22 + ((1.7 - z) / 3.4) * 0.65;
        ctx!.fillStyle = p.hot
          ? `rgba(${accentColor},${opacity})`
          : `rgba(${pointColor},${opacity})`;
        const size = Math.max(
          0.7,
          1.35 * perspective * (width < 500 ? 0.8 : 1),
        );
        ctx!.fillRect(x, y, size, size);
      }
    }
    const resize = () => {
      dirty = true;
      const rect = node.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      if (!interactive || reduced.matches || state.current.paused) return;
      dirty = true;
      const rect = node.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    intersection.observe(node);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    resize();
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      intersection.disconnect();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }, [interactive]);
  return (
    <canvas
      ref={canvas}
      className="point-canvas"
      role="img"
      aria-label={`Generative ${shape} made of contrasting monochrome and orange points. A decorative browser visualization.`}
    />
  );
}
