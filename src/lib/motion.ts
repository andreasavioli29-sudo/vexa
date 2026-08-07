/**
 * Shared motion primitives — the two cubic-bezier curves that make up
 * VEXA's "restrained" motion signature. Anything that reveals or dismisses
 * chrome (nav, loader, scenes) should pull from here instead of hand-typing
 * a bezier array, so the whole site keeps one consistent feel as more
 * scroll-driven scenes are added.
 */

/** Signature entrance curve — expo-out. Used for anything fading/sliding in. */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

/** The premium loader's curtain-exit curve — a sharper, more deliberate dismissal. */
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;
