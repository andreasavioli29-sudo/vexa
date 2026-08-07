"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type HeroAssetsContextValue = {
  loaded: Set<string>;
  markLoaded: (src: string) => void;
};

const HeroAssetsContext = createContext<HeroAssetsContextValue | null>(null);

/**
 * Lets a hero-critical image report its own load completion exactly once,
 * so a gate like PremiumLoader can wait on the same request the browser
 * already made for that image — instead of re-fetching it separately just
 * to find out when it's ready, which downloads it twice.
 */
export function HeroAssetsProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());

  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);

  return (
    <HeroAssetsContext.Provider value={{ loaded, markLoaded }}>
      {children}
    </HeroAssetsContext.Provider>
  );
}

/** Called by the component that owns the `<Image>` once it loads (or fails). */
export function useMarkHeroAssetLoaded() {
  const ctx = useContext(HeroAssetsContext);
  return ctx?.markLoaded ?? (() => {});
}

/** True once every listed asset has reported loaded. */
export function useHeroAssetsReady(sources: string[]) {
  const ctx = useContext(HeroAssetsContext);
  if (!ctx) return false;
  return sources.every((src) => ctx.loaded.has(src));
}
