"use client";

import { useSyncExternalStore } from "react";

import { site } from "@/lib/content";

const subscribe = (callback: () => void) => {
  const timer = setInterval(callback, 30_000);
  return () => clearInterval(timer);
};

const getTime = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: site.timeZone,
  }).format(new Date());

export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getTime, () => null);

  return <span suppressHydrationWarning>{time ?? "--:-- --"}</span>;
}
