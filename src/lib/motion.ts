import { cubicBezier } from "framer-motion";

/**
 * Shared motion primitives — the three cubic-bezier curves that make up
 * VEXA's "restrained" motion signature. Anything that reveals, dismisses,
 * or idles chrome (nav, loader, scenes) should pull from here instead of
 * hand-typing a bezier array, so the whole site keeps one consistent feel
 * as more scroll-driven scenes are added.
 *
 * Array form (`EASE_*`) is for time-based `transition.ease` (mount
 * animations, ambient loops) — it accepts a bezier array directly. Function
 * form (`ease*`) is for scroll-linked `useTransform(..., { ease })` calls,
 * which require an `(t: number) => number` easing function rather than an
 * array — both forms share the same control points, so a curve reads
 * identically whether it's driving wall-clock time or scroll progress.
 */

/** Signature entrance curve — expo-out. Confident arrivals: something settling into its final, resting state. */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

/** The premium loader's curtain-exit curve — a sharper, more deliberate dismissal. */
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

/**
 * Gentle in-out curve for anything ambient or atmospheric — idle loops,
 * light transitions, background drift. Slower and quieter than either
 * reveal or dismiss; nothing here should ever announce itself. Added as a
 * third curve only once idle/atmospheric motion needed its own register —
 * see the Bible's Motion Principles and Backlog LOW-2 for the criterion.
 */
export const EASE_BREATH = [0.45, 0, 0.55, 1] as const;

export const easeReveal = cubicBezier(...EASE_REVEAL);
export const easeCurtain = cubicBezier(...EASE_CURTAIN);
export const easeBreath = cubicBezier(...EASE_BREATH);
