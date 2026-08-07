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
    /** Radius (%) of the reveal aperture — how much of the object is uncovered so far. */
    revealAperture: MotionValue<number>;
    /** Focus pull, in px of blur — heavy at arrival, zero once fully resolved. */
    revealBlur: MotionValue<number>;
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
 *   0%    — a luxury bedroom, static.
 *  20%    — the camera slowly moves toward the bed.
 *  40%    — the bed fills most of the screen.
 *  60%    — the room fades to black; the frame, pillows and duvet vanish.
 *  55-60% — the camera pushes in close on exactly where the bed was —
 *           arriving, not cutting to a new object.
 *  60-68% — extreme, softly-blurred close-up: material and stitching only.
 *  68-75% — focus pulls and the aperture widens: the object's volume and
 *           silhouette resolve, still slightly soft.
 *  75-80% — fully sharp, fully uncovered, at roughly 75% of the viewport —
 *           the climax.
 *  80-90% — it settles back to its composed size, lifts, and rotates to
 *           its ~12deg resting angle.
 * 100%    — floating, centered, in a black premium studio.
 *
 * The mattress reveal is deliberately never an opacity cross-fade of a
 * separate image: it starts anchored exactly where the bed was and arrives
 * via scale, growing outward from that same point — it never repositions
 * before it's recognizable. It uncovers through a shrinking blur + widening
 * aperture centered on the object's own material detail, never through
 * visibility appearing out of nothing. Because the climax scale is large
 * enough to fill most of the viewport, the anchor itself drifts gently
 * toward center as it grows (72%/66% -> 52%/48%) — a camera reframing to
 * keep its subject in frame as it fills more of the shot, not a jump; it
 * still begins at, and reads as having come from, exactly the bed's spot.
 * Rotation is held at 0 through all of this — turning to its resting angle
 * is reserved for after the reveal, its own, later beat: "revealed" and
 * "coming alive" are different moments, and conflating them is what used to
 * read as a picture popping in.
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

  // The studio settles in a beat after the object starts arriving, not at
  // the exact same instant — gives the reveal room to be the whole event.
  const atmosphereOpacity = useTransform(progress, [0.5, 0.66], [0, 1], { ease: easeBreath });

  // A few px of quiet drift as the mattress settles into its resting
  // composition — not enough to read as camera movement, just enough that
  // the backdrop isn't inert.
  const atmosphereDriftY = useTransform(progress, [0.8, 1], [-6, 0], { ease: easeBreath });

  // The object is visible (opacity) almost the instant the reveal begins —
  // what actually reveals it from here is arrival (scale), focus (blur),
  // and aperture, never opacity. Opacity's only job is avoiding a hard pop
  // the moment this element mounts into view.
  const mattressOpacity = useTransform(progress, [0.54, 0.57], [0, 1], { ease: easeReveal });

  // The reveal, in four beats — starting from the bed's own screen position
  // (72%, 66%; see the position drift below for why it doesn't stay there):
  //
  //   Arrival (55-60%): scale rushes from bed-size toward its largest —
  //     the camera closing the remaining distance. Still tight, still blurred.
  //   Details (60-68%): a soft, shallow-focus close-up on the stitching and
  //     the copper edge trim — the aperture opens a little, focus barely.
  //   Volume (68-75%): the aperture opens across most of the frame and
  //     focus pulls further — the whole silhouette reads now, still soft.
  //   Whole product (75-80%): fully open, fully sharp, held at its largest —
  //     this is the climax the rest of the shot has been building to.
  const REVEAL_STOPS = [0.55, 0.6, 0.68, 0.75, 0.8];

  const revealAperture = useTransform(progress, REVEAL_STOPS, [12, 15, 42, 96, 160], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath],
  });
  const revealBlur = useTransform(progress, REVEAL_STOPS, [22, 20, 8, 2, 0], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath],
  });

  // The anchor drifts gently toward center throughout the reveal — a
  // reframe, not a repositioning — so the object never clips the viewport
  // edge as it grows to climax size, then continues to its final, lower,
  // composed position once recomposing begins at 80%.
  const mattressLeft = useTransform(progress, [0.55, 0.8, 0.9], ["72%", "52%", "50%"], {
    ease: [easeBreath, easeReveal],
  });
  const mattressTop = useTransform(progress, [0.55, 0.8, 0.9], ["66%", "48%", "80%"], {
    ease: [easeBreath, easeReveal],
  });

  // One continuous curve for the whole arc: bed-anchored size (0.4, matching
  // the dollied-in photo's own bed) rushes past its final presentation size
  // to ~2.3x the box's base width — roughly 70-80% of the viewport on
  // common desktop sizes, verified against the box's own min()-of-three
  // sizing formula, not assumed — holds near that peak through the rest of
  // the reveal, then settles back down once recomposing begins.
  const mattressScale = useTransform(
    progress,
    [...REVEAL_STOPS, 0.9],
    [0.4, 1.6, 2.0, 2.2, 2.3, 1],
    { ease: [easeReveal, easeBreath, easeBreath, easeBreath, easeReveal] },
  );

  // 80% -> 90%: only now does the object rotate — turning to its resting
  // angle. "Revealed" and "coming alive" are different beats; rotation is
  // held at 0 through the entire reveal above so the object reads as
  // resolving into focus, not tumbling into view.
  const mattressRotate = useTransform(progress, [0.8, 0.9], [0, 12], { ease: easeReveal });

  // Studio dressing (ambient glow, contact shadow, fog) arrives right as the
  // reveal reaches full focus — the light turning on for the climax — and
  // holds through the settle into center.
  const studioOpacity = useTransform(progress, [0.75, 0.87], [0, 1], { ease: easeBreath });

  // The final arrival plays as one unhurried beat, not a scramble: logo
  // first and alone, then kicker, headline, and CTAs unfurl in a light
  // stagger — each overlapping the last rather than waiting for it, so it
  // reads as one continuous motion, not four cues. Compressed into the last
  // 10% of scroll (rather than the last 18%, pre-reveal-redesign) on
  // purpose — after the climax above, a quick, confident title card is the
  // right denouement, not a second competing set-piece.
  // Only the opacity leg of each reveal carries a custom curve — at a 10-14px
  // drift, an eased Y offset and a linear one are visually indistinguishable,
  // and opacity alone already carries the "arriving" feel.
  const logoOpacity = useTransform(progress, [0.9, 0.94], [0, 1], { ease: easeReveal });
  const logoY = useTransform(progress, [0.9, 0.94], [14, 0]);

  const kickerOpacity = useTransform(progress, [0.94, 0.96], [0, 1], { ease: easeReveal });
  const kickerY = useTransform(progress, [0.94, 0.96], [12, 0]);

  const headlineOpacity = useTransform(progress, [0.955, 0.975], [0, 1], { ease: easeReveal });
  const headlineY = useTransform(progress, [0.955, 0.975], [12, 0]);

  const ctaOpacity = useTransform(progress, [0.97, 1], [0, 1], { ease: easeReveal });
  const ctaY = useTransform(progress, [0.97, 1], [10, 0]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  const scrollCueOpacity = useTransform(progress, [0.98, 1], [0, 1], { ease: easeReveal });

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
      revealAperture,
      revealBlur,
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
