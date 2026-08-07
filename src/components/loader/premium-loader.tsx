"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";

import { LogoMark } from "@/components/logo";
import { useHeroAssetsReady } from "@/components/providers/hero-assets-provider";
import { HERO_MATTRESS_IMAGE, HERO_VILLA_IMAGE } from "@/lib/hero-assets";
import { EASE_CURTAIN } from "@/lib/motion";

/**
 * Hero-critical imagery — the loader holds until both have reported loaded
 * (via HeroAssetsProvider) so the cinematic scroll sequence never has to
 * pop in a half-loaded frame. This reads the same load event the actual
 * <Image> elements fire, rather than re-fetching the assets itself.
 */
const CRITICAL_ASSETS = [HERO_VILLA_IMAGE, HERO_MATTRESS_IMAGE];

/**
 * Minimum time the mark stays on screen — long enough to read as a
 * considered reveal, short enough not to feel like a delay tactic.
 */
const MIN_DISPLAY_MS = 1900;

export function PremiumLoader() {
  const [phase, setPhase] = useState<"loading" | "ready" | "done">("loading");
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const assetsReady = useHeroAssetsReady(CRITICAL_ASSETS);
  const [mountedAt] = useState(() => performance.now());

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    if (!assetsReady) return;
    const minDisplay = reduceMotion ? 400 : MIN_DISPLAY_MS;
    const remaining = Math.max(minDisplay - (performance.now() - mountedAt), 0);
    const timeout = window.setTimeout(() => setPhase("ready"), remaining);
    return () => window.clearTimeout(timeout);
  }, [assetsReady, reduceMotion, mountedAt]);

  useEffect(() => {
    if (phase !== "ready") return;
    document.documentElement.style.overflow = "";
    lenis?.start();
  }, [phase, lenis]);

  if (phase === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      animate={phase === "ready" ? "exit" : "visible"}
      onAnimationComplete={(definition) => {
        if (definition === "exit") setPhase("done");
      }}
      variants={{
        visible: { opacity: 1 },
        exit: reduceMotion
          ? { opacity: 0, transition: { duration: 0.4, ease: EASE_CURTAIN } }
          : {
              opacity: 0,
              scale: 1.06,
              filter: "blur(6px)",
              transition: { duration: 1.1, ease: EASE_CURTAIN },
            },
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_CURTAIN }}
      >
        <LogoMark
          className="h-9 w-9 text-white/70"
          ringProps={{
            initial: { pathLength: 0 },
            animate: { pathLength: 1 },
            transition: { duration: 1.4, ease: EASE_CURTAIN },
          }}
          dotProps={{
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 1.1, duration: 0.5, ease: EASE_CURTAIN },
          }}
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7, ease: EASE_CURTAIN }}
        className="mt-5 font-sans text-sm font-medium uppercase tracking-[0.5em] text-white"
      >
        Vexa
      </motion.span>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-8 h-px w-32 overflow-hidden bg-white/10"
      >
        <motion.div
          className="h-full bg-copper-400"
          initial={{ width: "0%" }}
          animate={{ width: phase === "ready" ? "100%" : "78%" }}
          transition={
            phase === "ready"
              ? { duration: 0.4, ease: EASE_CURTAIN }
              : { delay: 1.5, duration: 2.6, ease: EASE_CURTAIN }
          }
        />
      </motion.div>
    </motion.div>
  );
}
