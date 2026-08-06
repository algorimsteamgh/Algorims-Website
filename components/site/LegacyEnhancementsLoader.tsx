"use client";

import { useEffect, useState, type ComponentType } from "react";

type LegacyEnhancementsProps = {
  agenticAi?: boolean;
  ccaf?: boolean;
};

type LegacyEnhancementsComponent = ComponentType<LegacyEnhancementsProps>;

const scheduleIdle = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }

  const id = setTimeout(callback, 250);
  return () => clearTimeout(id);
};

export function LegacyEnhancementsLoader(props: LegacyEnhancementsProps) {
  const [Component, setComponent] =
    useState<LegacyEnhancementsComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = scheduleIdle(() => {
      import("./LegacyEnhancements").then((mod) => {
        if (!cancelled) {
          setComponent(() => mod.LegacyEnhancements);
        }
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, []);

  return Component ? <Component {...props} /> : null;
}
