"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { GearCanvas } from "@/components/landing/gear-canvas";
import { SketchCanvas } from "@/components/landing/sketch-canvas";
import { WaveCanvas } from "@/components/landing/wave-canvas";

const figures = [
  { Canvas: GearCanvas, labels: ["involute gear", "z = 9 · m = 2.0"] },
  { Canvas: WaveCanvas, labels: ["z = sin(x)·cos(y)"] },
  { Canvas: SketchCanvas, labels: ["sketch.001 — fully constrained"] },
] as const;

export function HeroFigure() {
  const [index, setIndex] = useState(0);
  const { Canvas, labels } = figures[index];

  const step = (delta: number) =>
    setIndex((index + delta + figures.length) % figures.length);

  return (
    <>
      <Canvas key={index} />
      {labels.map((label, i) => (
        <span
          key={label}
          className={`pointer-events-none absolute left-3 font-mono text-[10px] text-muted-foreground ${
            i === 0 ? "top-2.5" : "top-6 opacity-70"
          }`}
        >
          {label}
        </span>
      ))}
      <div className="absolute bottom-2 left-3 flex gap-1.5">
        <button
          type="button"
          title="Previous figure"
          onClick={() => step(-1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          title="Next figure"
          onClick={() => step(1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
      <span className="pointer-events-none absolute right-3 bottom-2.5 font-mono text-[10px] text-muted-foreground">
        fig. {index + 1}
      </span>
    </>
  );
}
