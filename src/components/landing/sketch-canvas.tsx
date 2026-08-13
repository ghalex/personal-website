"use client";

import { useEffect, useRef } from "react";

// 2D CAD sketch replay: plate outline with 2 holes + dimensions, drawn by a looping timeline
export function SketchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

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

      const fg = css("--foreground") || "#171717";
      const muted = css("--muted-foreground") || "#888";
      const accent = css("--primary") || "#08c";
      const mono = `9px ${css("--font-geist-mono") || "monospace"}`;

      const T = (t % 9000) / 9000; // 9s loop
      const cx = W / 2;
      const cy = H / 2 + 4;
      const w = 132;
      const h = 84;
      const r = 18; // rounded plate
      const ease = (k: number) => Math.min(1, Math.max(0, k));
      const outlineP = ease(T / 0.35);
      const holesP = ease((T - 0.4) / 0.2);
      const dimP = ease((T - 0.65) / 0.2);

      // plate outline (rounded rect) partial draw
      const path: [number, number][] = [];
      const seg = (x0: number, y0: number, x1: number, y1: number, n: number) => {
        for (let i = 0; i <= n; i++) {
          path.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]);
        }
      };
      const arc = (ax: number, ay: number, a0: number, a1: number, n: number) => {
        for (let i = 0; i <= n; i++) {
          const a = a0 + ((a1 - a0) * i) / n;
          path.push([ax + Math.cos(a) * r, ay + Math.sin(a) * r]);
        }
      };
      seg(cx - w / 2 + r, cy - h / 2, cx + w / 2 - r, cy - h / 2, 8);
      arc(cx + w / 2 - r, cy - h / 2 + r, -Math.PI / 2, 0, 6);
      seg(cx + w / 2, cy - h / 2 + r, cx + w / 2, cy + h / 2 - r, 6);
      arc(cx + w / 2 - r, cy + h / 2 - r, 0, Math.PI / 2, 6);
      seg(cx + w / 2 - r, cy + h / 2, cx - w / 2 + r, cy + h / 2, 8);
      arc(cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2, Math.PI, 6);
      seg(cx - w / 2, cy + h / 2 - r, cx - w / 2, cy - h / 2 + r, 6);
      arc(cx - w / 2 + r, cy - h / 2 + r, Math.PI, Math.PI * 1.5, 6);

      const upto = Math.floor(path.length * outlineP);
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i < upto; i++) {
        const p = path[i];
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();

      // pen dot at draw head
      if (outlineP < 1 && upto > 0) {
        const p = path[upto - 1];
        ctx.fillStyle = accent;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // holes with center crosses
      const holes: [number, number][] = [
        [cx - w / 2 + 30, cy],
        [cx + w / 2 - 30, cy],
      ];
      if (holesP > 0) {
        holes.forEach(([hx, hy], k) => {
          const hp = ease(holesP * 2 - k);
          if (hp <= 0) return;
          ctx.strokeStyle = fg;
          ctx.globalAlpha = 0.75;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(hx, hy, 11, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hp);
          ctx.stroke();
          ctx.strokeStyle = muted;
          ctx.globalAlpha = 0.6 * hp;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(hx - 16, hy);
          ctx.lineTo(hx + 16, hy);
          ctx.moveTo(hx, hy - 16);
          ctx.lineTo(hx, hy + 16);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      // dimension line with arrows + label
      if (dimP > 0) {
        const dy = cy - h / 2 - 18;
        const x0 = cx - w / 2;
        const x1 = x0 + w * dimP;
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, dy);
        ctx.lineTo(x1, dy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x0, dy - 4);
        ctx.lineTo(x0, dy + 4);
        ctx.moveTo(x1, dy - 4);
        ctx.lineTo(x1, dy + 4);
        ctx.stroke();
        if (dimP > 0.9) {
          ctx.fillStyle = accent;
          ctx.font = mono;
          ctx.textAlign = "center";
          ctx.fillText("132.00", cx, dy - 5);
        }
        // radius leader
        ctx.strokeStyle = muted;
        ctx.globalAlpha = 0.7 * dimP;
        const rx = cx + w / 2 - r + Math.cos(-Math.PI / 4) * r;
        const ry = cy - h / 2 + r + Math.sin(-Math.PI / 4) * r;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + 14, ry - 14);
        ctx.stroke();
        if (dimP > 0.9) {
          ctx.fillStyle = muted;
          ctx.textAlign = "left";
          ctx.fillText("R18", rx + 16, ry - 16);
        }
      }

      // "fully constrained" flash at end
      if (T > 0.9) {
        ctx.globalAlpha = (T - 0.9) * 6;
        ctx.fillStyle = accent;
        ctx.font = mono;
        ctx.textAlign = "center";
        ctx.fillText("✓ 0 DOF", cx, cy + h / 2 + 22);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}
