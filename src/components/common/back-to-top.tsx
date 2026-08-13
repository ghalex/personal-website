"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      title="Back to top"
      onClick={scrollTop}
      className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <ArrowUp className="size-3.5" />
    </button>
  );
}
