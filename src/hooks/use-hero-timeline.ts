"use client";

import { useTransform, type MotionValue } from "framer-motion";

import { easeBreath, easeReveal } from "@/lib/motion";

export type HeroTimeline = {
  intro: {
    photoScale: MotionValue<number>;
    vignetteHole: MotionValue<number>;
  };
  transition: {
    blackoutOpacity: MotionValue<number>;
    atmosphereOpacity: MotionValue<number>;
    /** A whisper of parallax on the studio backdrop as the mattress settles — the camera is still quietly alive. */
    atmosphereDriftY: MotionValue<number>;
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
    kickerOpacity: MotionValue<number>;
    kickerY: MotionValue<number>;
    headlineOpacity: MotionValue<number>;
    headlineY: MotionValue<number>;
    ctaOpacity: MotionValue<number>;
    ctaY: MotionValue<number>;
    ctaPointerEvents: MotionValue<string>;
    scrollCueOpacity: MotionValue<number>;
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
 *
 * Two easing registers do the work of "premium motion": `easeBreath` for
 * anything atmospheric or held (the light closing in, a lift settling into
 * a hold), `easeReveal` for anything arriving at its final, resting state
 * (the settle into center, the text unfurling in). Nothing here is linear —
 * a mechanical, constant-rate interpolation is the single fastest way to
 * make a scroll-scrub feel like a slider instead of a shot.
 */
export function useHeroTimeline(progress: MotionValue<number>): HeroTimeline {
  // 0% -> 40%: the camera dollies in continuously until the bed fills the screen.
  // Deliberately left linear — this is the one sustained, motorized-feeling
  // push of the whole sequence, and a constant rate reads as more
  // deliberate/inevitable here than an eased one would; every shorter,
  // punctuated beat after this gets a curve, this one earns its plainness.
  const photoScale = useTransform(progress, [0, 0.4], [1, 1.6]);

  // 40% -> 60%: the room darkens as a closing iris around the bed's screen position
  const vignetteHole = useTransform(progress, [0.4, 0.6], [80, 3], { ease: easeBreath });

  // The iris's final cleanup — hides the frame/pillows/duvet for good
  const blackoutOpacity = useTransform(progress, [0.48, 0.6], [0, 1], { ease: easeBreath });

  // Given a touch more room than the mattress's own fade (ends 0.66, not
  // 0.62) so the studio doesn't finish saturating at the exact same instant
  // as the product — the atmosphere settles in a beat after the object does.
  const atmosphereOpacity = useTransform(progress, [0.5, 0.66], [0, 1], { ease: easeBreath });

  // A few px of quiet drift as the mattress lifts and settles — not enough
  // to read as camera movement, just enough that the backdrop isn't inert.
  const atmosphereDriftY = useTransform(progress, [0.75, 1], [-6, 0], { ease: easeBreath });

  // The mattress fades in exactly as the bed's bedding disappears into the
  // blackout — same screen position (72%, 66%, the IntroScene vignette's own
  // anchor), same small apparent size, no rotation: it reads as "the bed
  // became this" rather than a new object arriving.
  const mattressOpacity = useTransform(progress, [0.52, 0.62], [0, 1], { ease: easeReveal });

  // 60% -> 75%: it holds still, resting in place — "only the mattress remains"
  // 75% -> 100%: it lifts (a small upward shift), then drifts to centered —
  // low enough in the frame that the headline and buttons above always sit
  // clear of it (those buttons are transparent-fill by design, so anything
  // behind them shows through). The lift itself is a held, gentle breath;
  // only the final glide into center gets the confident settle curve.
  const mattressLeft = useTransform(progress, [0.6, 0.85, 1], ["72%", "72%", "50%"], {
    ease: easeReveal,
  });
  const mattressTop = useTransform(progress, [0.6, 0.75, 1], ["66%", "59%", "80%"], {
    ease: [easeBreath, easeReveal],
  });

  // 60% -> 85%: stays bed-sized while it lifts and turns; 85% -> 100%: grows
  // to its full presentation size as it settles centered
  const mattressScale = useTransform(progress, [0.6, 0.85, 1], [0.4, 0.4, 1], {
    ease: easeReveal,
  });

  // 75% -> 85%: rotates to its ~12deg resting angle, then holds — a settle, not a spin
  const mattressRotate = useTransform(progress, [0.75, 0.85], [0, 12], { ease: easeReveal });

  // Studio dressing (ambient glow, contact shadow, fog) only once it's
  // actually airborne — not while it's still sitting where the bed was
  const studioOpacity = useTransform(progress, [0.75, 0.95], [0, 1], { ease: easeBreath });

  // The final arrival plays as one unhurried beat, not a scramble in the
  // last 10% of scroll: logo first and alone, then kicker, headline, and
  // CTAs unfurl in a light stagger — each overlapping the last rather than
  // waiting for it, so it reads as one continuous motion, not four cues.
  // Only the opacity leg of each reveal carries a custom curve — at a 10-14px
  // drift, an eased Y offset and a linear one are visually indistinguishable,
  // and opacity alone already carries the "arriving" feel. Skipping the
  // redundant easing on Y measurably cuts per-frame cost during scroll
  // without giving up anything a viewer would perceive.
  const logoOpacity = useTransform(progress, [0.82, 0.9], [0, 1], { ease: easeReveal });
  const logoY = useTransform(progress, [0.82, 0.9], [14, 0]);

  const kickerOpacity = useTransform(progress, [0.9, 0.95], [0, 1], { ease: easeReveal });
  const kickerY = useTransform(progress, [0.9, 0.95], [12, 0]);

  const headlineOpacity = useTransform(progress, [0.925, 0.975], [0, 1], { ease: easeReveal });
  const headlineY = useTransform(progress, [0.925, 0.975], [12, 0]);

  const ctaOpacity = useTransform(progress, [0.95, 1], [0, 1], { ease: easeReveal });
  const ctaY = useTransform(progress, [0.95, 1], [10, 0]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  const scrollCueOpacity = useTransform(progress, [0.96, 1], [0, 1], { ease: easeReveal });

  return {
    intro: { photoScale, vignetteHole },
    transition: { blackoutOpacity, atmosphereOpacity, atmosphereDriftY },
    mattress: {
      opacity: mattressOpacity,
      posLeft: mattressLeft,
      posTop: mattressTop,
      rotate: mattressRotate,
      scale: mattressScale,
      studioOpacity,
    },
    hero: {
      logoOpacity,
      logoY,
      kickerOpacity,
      kickerY,
      headlineOpacity,
      headlineY,
      ctaOpacity,
      ctaY,
      ctaPointerEvents,
      scrollCueOpacity,
    },
  };
}
