"use client";

import { useEffect, useRef } from "react";

// Extruded involute-gear wireframe: z teeth, outer/root radii, center bore
const Z = 9;
const R1 = 46;
const R2 = 36;
const BORE = 14;
const DEPTH = 26;

export function GearCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const prof: [number, number][] = [];
    for (let i = 0; i < Z; i++) {
      const a0 = (i / Z) * Math.PI * 2;
      const step = (Math.PI * 2) / Z;
      prof.push(
        [a0, R2],
        [a0 + step * 0.18, R2],
        [a0 + step * 0.3, R1],
        [a0 + step * 0.62, R1],
        [a0 + step * 0.74, R2],
      );
    }
    const bore: [number, number][] = [];
    for (let i = 0; i < 24; i++) bore.push([(i / 24) * Math.PI * 2, BORE]);

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
      userTilt = Math.max(-1.1, Math.min(1.1, drag.t + (e.clientY - drag.y) * 0.008));
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

      const rot = t * 0.00035 + userRot;
      const tilt = -0.5 + userTilt;
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const cx = W / 2;
      const cy = H / 2 + 4;

      // polar profile point at height y -> screen
      const P = (a: number, r: number, y: number): [number, number] => {
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const x1 = x * cr + z * sr;
        const z1 = -x * sr + z * cr;
        return [cx + x1, cy + (y * ct - z1 * st)];
      };

      const fg = css("--foreground") || "#171717";
      const muted = css("--muted-foreground") || "#888";
      const accent = css("--primary") || "#08c";

      // dashed construction axes
      ctx.strokeStyle = muted;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 78);
      ctx.lineTo(cx, cy + 78);
      ctx.stroke();
      const ax1 = P(0, R1 + 18, 0);
      const ax2 = P(Math.PI, R1 + 18, 0);
      ctx.beginPath();
      ctx.moveTo(ax1[0], ax1[1]);
      ctx.lineTo(ax2[0], ax2[1]);
      ctx.stroke();

      // pitch circle (dashed, accent)
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const p = P((i / 48) * Math.PI * 2, (R1 + R2) / 2, DEPTH / 2);
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const ring = (pts: [number, number][], y: number, alpha: number) => {
        ctx.strokeStyle = fg;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        pts.forEach(([a, r], i) => {
          const p = P(a, r, y);
          if (i) ctx.lineTo(p[0], p[1]);
          else ctx.moveTo(p[0], p[1]);
        });
        ctx.closePath();
        ctx.stroke();
      };
      ring(prof, -DEPTH / 2, 0.85);
      ring(prof, DEPTH / 2, 0.4);
      ring(bore, -DEPTH / 2, 0.6);
      ring(bore, DEPTH / 2, 0.3);

      // vertical edges at tooth corners
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      prof.forEach(([a, r]) => {
        const p1 = P(a, r, -DEPTH / 2);
        const p2 = P(a, r, DEPTH / 2);
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
      });
      ctx.stroke();

      // accent vertex dots on top face tooth tips
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      for (let i = 0; i < Z; i++) {
        const [a, r] = prof[i * 5 + 2];
        const p = P(a, r, -DEPTH / 2);
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

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
