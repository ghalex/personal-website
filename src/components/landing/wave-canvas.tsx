"use client";

import { useEffect, useRef } from "react";

// Parametric surface: z = sin(x)·cos(y) wave grid
const N = 13; // grid points
const S = 9; // spacing

export function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    let drag: { x: number; y: number; r: number; t: number } | null = null;
    let userRot = 0;
    let userTilt = 0;

    const onPointerDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, r: userRot, t: userTilt };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      userRot = drag.r + (e.clientX - drag.x) * 0.012;
      userTilt = Math.max(-0.9, Math.min(0.9, drag.t + (e.clientY - drag.y) * 0.008));
    };
    const onPointerUp = () => {
      drag = null;
      cv.style.cursor = "grab";
    };
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);

    const css = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    let raf = 0;
    const loop = (t: number) => {
      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      if (cv.width !== W * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const rot = 0.6 + userRot;
      const tilt = -0.55 + userTilt;
      const ph = t * 0.0012;
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const cx = W / 2;
      const cy = H / 2 + 6;

      const fg = css("--foreground") || "#171717";
      const muted = css("--muted-foreground") || "#888";
      const accent = css("--primary") || "#08c";

      const pt = (i: number, j: number): [number, number, number] => {
        const x = (i - (N - 1) / 2) * S;
        const z = (j - (N - 1) / 2) * S;
        const y = Math.sin(x * 0.09 + ph) * Math.cos(z * 0.09 + ph * 0.7) * 16;
        const x1 = x * cr + z * sr;
        const z1 = -x * sr + z * cr;
        return [cx + x1, cy + (-y * ct - z1 * st), y];
      };

      ctx.lineWidth = 1;
      for (let j = 0; j < N; j++) {
        ctx.strokeStyle = fg;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p = pt(i, j);
          if (i) ctx.lineTo(p[0], p[1]);
          else ctx.moveTo(p[0], p[1]);
        }
        ctx.stroke();
      }
      for (let i = 0; i < N; i++) {
        ctx.strokeStyle = fg;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        for (let j = 0; j < N; j++) {
          const p = pt(i, j);
          if (j) ctx.lineTo(p[0], p[1]);
          else ctx.moveTo(p[0], p[1]);
        }
        ctx.stroke();
      }

      // accent dots on wave crests
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      for (let i = 0; i < N; i += 3) {
        for (let j = 0; j < N; j += 3) {
          const p = pt(i, j);
          if (p[2] > 10) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // dashed vertical axis
      ctx.strokeStyle = muted;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 72);
      ctx.lineTo(cx, cy + 72);
      ctx.stroke();
      ctx.setLineDash([]);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerup", onPointerUp);
      cv.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full cursor-grab touch-none"
    />
  );
}
