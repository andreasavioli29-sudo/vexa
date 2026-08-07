"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";

/**
 * Hero-critical imagery — the loader holds until both are decoded so the
 * cinematic scroll sequence never has to pop in a half-loaded frame.
 */
const CRITICAL_ASSETS = ["/hero-villa.jpg", "/images/vexa-one-hero.png"];

/**
 * Minimum time the mark stays on screen — long enough to read as a
 * considered reveal, short enough not to feel like a delay tactic.
 */
const MIN_DISPLAY_MS = 1900;

const EASE = [0.76, 0, 0.24, 1] as const;

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function PremiumLoader() {
  const [phase, setPhase] = useState<"loading" | "ready" | "done">("loading");
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    let cancelled = false;
    const startedAt = performance.now();
    const minDisplay = reduceMotion ? 400 : MIN_DISPLAY_MS;

    Promise.all(CRITICAL_ASSETS.map(preload)).then(() => {
      if (cancelled) return;
      const remaining = Math.max(minDisplay - (performance.now() - startedAt), 0);
      window.setTimeout(() => {
        if (!cancelled) setPhase("ready");
      }, remaining);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          ? { opacity: 0, transition: { duration: 0.4, ease: EASE } }
          : {
              opacity: 0,
              scale: 1.06,
              filter: "blur(6px)",
              transition: { duration: 1.1, ease: EASE },
            },
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <motion.svg
        viewBox="0 0 32 32"
        fill="none"
        className="h-9 w-9 text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.circle
          cx="16"
          cy="16"
          r="12.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <motion.circle
          cx="16"
          cy="4"
          r="2.25"
          className="fill-copper-400"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5, ease: EASE }}
        />
      </motion.svg>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
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
              ? { duration: 0.4, ease: EASE }
              : { delay: 1.5, duration: 2.6, ease: EASE }
          }
        />
      </motion.div>
    </motion.div>
  );
}
