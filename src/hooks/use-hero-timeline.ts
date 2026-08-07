"use client";

import { useTransform, type MotionValue } from "framer-motion";

export type HeroTimeline = {
  intro: {
    photoScale: MotionValue<number>;
    vignetteHole: MotionValue<number>;
  };
  transition: {
    blackoutOpacity: MotionValue<number>;
    atmosphereOpacity: MotionValue<number>;
  };
  mattress: {
    opacity: MotionValue<number>;
    posLeft: MotionValue<string>;
    posTop: MotionValue<string>;
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    studioOpacity: MotionValue<number>;
  };
  hero: {
    logoOpacity: MotionValue<number>;
    logoY: MotionValue<number>;
    textOpacity: MotionValue<number>;
    textPointerEvents: MotionValue<string>;
  };
};

/**
 * The single source of truth for CinematicHero's scroll choreography, one
 * continuous shot broken into named scenes (intro / transition / mattress /
 * hero) instead of a flat list of values — so a future scene can be added
 * as its own group here without growing every existing component's props.
 *
 *   0%  — a luxury bedroom, static.
 *  20%  — the camera slowly moves toward the bed.
 *  40%  — the bed fills most of the screen.
 *  60%  — the room fades to black; the frame, pillows and duvet vanish;
 *         only the mattress remains, exactly where the bed was.
 *  75%  — the mattress gently lifts.
 *  85%  — it rotates to its ~12deg resting angle.
 * 100%  — floating, centered, in a black premium studio.
 */
export function useHeroTimeline(progress: MotionValue<number>): HeroTimeline {
  // 0% -> 40%: the camera dollies in continuously until the bed fills the screen
  const photoScale = useTransform(progress, [0, 0.4], [1, 1.6]);

  // 40% -> 60%: the room darkens as a closing iris around the bed's screen position
  const vignetteHole = useTransform(progress, [0.4, 0.6], [80, 3]);

  // The iris's final cleanup — hides the frame/pillows/duvet for good
  const blackoutOpacity = useTransform(progress, [0.48, 0.6], [0, 1]);
  const atmosphereOpacity = useTransform(progress, [0.5, 0.62], [0, 1]);

  // The mattress fades in exactly as the bed's bedding disappears into the
  // blackout — same screen position (72%, 66%, the IntroScene vignette's own
  // anchor), same small apparent size, no rotation: it reads as "the bed
  // became this" rather than a new object arriving.
  const mattressOpacity = useTransform(progress, [0.52, 0.62], [0, 1]);

  // 60% -> 75%: it holds still, resting in place — "only the mattress remains"
  // 75% -> 100%: it lifts (a small upward shift), then drifts to centered —
  // low enough in the frame that the headline and buttons above always sit
  // clear of it (those buttons are transparent-fill by design, so anything
  // behind them shows through).
  const mattressLeft = useTransform(progress, [0.6, 0.85, 1], ["72%", "72%", "50%"]);
  const mattressTop = useTransform(progress, [0.6, 0.75, 1], ["66%", "59%", "80%"]);

  // 60% -> 85%: stays bed-sized while it lifts and turns; 85% -> 100%: grows
  // to its full presentation size as it settles centered
  const mattressScale = useTransform(progress, [0.6, 0.85, 1], [0.4, 0.4, 1]);

  // 75% -> 85%: rotates to its ~12deg resting angle, then holds
  const mattressRotate = useTransform(progress, [0.75, 0.85], [0, 12]);

  // Studio dressing (ambient glow, contact shadow, fog) only once it's
  // actually airborne — not while it's still sitting where the bed was
  const studioOpacity = useTransform(progress, [0.75, 0.95], [0, 1]);

  // The logo reveals first, as its own moment, once the mattress has settled
  const logoOpacity = useTransform(progress, [0.84, 0.92], [0, 1]);
  const logoY = useTransform(progress, [0.84, 0.92], [14, 0]);

  // The kicker/headline/CTAs follow the logo in, once the mattress has fully settled
  const textOpacity = useTransform(progress, [0.9, 1], [0, 1]);
  const textPointerEvents = useTransform(textOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  return {
    intro: { photoScale, vignetteHole },
    transition: { blackoutOpacity, atmosphereOpacity },
    mattress: {
      opacity: mattressOpacity,
      posLeft: mattressLeft,
      posTop: mattressTop,
      rotate: mattressRotate,
      scale: mattressScale,
      studioOpacity,
    },
    hero: { logoOpacity, logoY, textOpacity, textPointerEvents },
  };
}
