"use client";

import { useSyncExternalStore } from "react";

const THEME_KEY = "ghalex-theme";

const subscribers = new Set<() => void>();

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const getTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(THEME_KEY, next);
    subscribers.forEach((callback) => callback());
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer rounded-full border border-border bg-transparent px-2.5 py-[5px] font-mono text-[11px] tracking-[0.04em] text-foreground transition-colors hover:border-muted-foreground"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
