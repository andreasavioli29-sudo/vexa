"use client";

import { useTransform, type MotionValue } from "framer-motion";

import { easeBreath, easeReveal } from "@/lib/motion";

export type HeroTimeline = {
  intro: {
    photoScale: MotionValue<number>;
    vignetteHole: MotionValue<number>;
    /** Brightness multiplier on the villa photo itself — the room's light fading, not a cover appearing over it. */
    villaDim: MotionValue<number>;
    /** Saturation multiplier, draining color alongside brightness as the light goes. */
    villaSaturate: MotionValue<number>;
    /** Opacity of a light-falloff darkening the photo's own edges toward its center (the bed) — hierarchy, not a uniform dim. */
    villaVignette: MotionValue<number>;
    /** Contrast multiplier — shadows deepen and separate from midtones as the room's light recedes. */
    villaContrast: MotionValue<number>;
  };
  transition: {
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
    /** Focus pull, in px of blur — heavy at arrival, zero once fully resolved, with one small later pulse as the camera re-focuses on a second detail. */
    revealBlur: MotionValue<number>;
    /** Position (%) of a directional light discovering the object — edge, then stitching, then top fabric, then the whole silhouette. */
    lightSweep: MotionValue<number>;
    /** transform-origin X (%) for the post-reveal detail push-ins — where on the object's own surface the camera is currently framed on. */
    detailOriginX: MotionValue<number>;
    /** transform-origin Y (%), paired with detailOriginX. */
    detailOriginY: MotionValue<number>;
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
 * The single source of truth for CinematicHero's scroll choreography — one
 * continuous shot, one physical space, one camera that never stops moving.
 * Grouped by scene (intro / transition / mattress / hero) so a future scene
 * can be added as its own group here without growing every existing
 * component's props.
 *
 *    0%     — a luxury bedroom, static.
 *   12%     — the camera slowly moves toward the bed.
 *   23%     — the bed fills most of the screen.
 *  23-30%   — the room's own light fades while a closing iris narrows
 *             attention onto the bed — the room going dark, not a shape
 *             covering it.
 *  30-38%   — that narrowing settles almost fully shut: the bed alone,
 *             dark, isolated.
 *  32-35%   — the camera pushes in on exactly that same dark shape —
 *             arriving, not cutting to a new object.
 *  35-39%   — extreme, softly-blurred close-up: material and stitching only.
 *  39-46%   — focus pulls and the aperture widens: the object's volume and
 *             silhouette resolve, still slightly soft.
 *  46-52%   — fully sharp, fully uncovered, at roughly 75% of the viewport
 *             — the climax the sequence has built toward so far.
 *  46-52%   — it settles back to its composed size, lifts, and rotates to
 *             its ~12deg resting angle: floating, centered, in the studio.
 *
 * That settle used to be the ending. It no longer is — the reveal is the
 * beginning of the product's story, not its conclusion:
 *
 *  52-56.5%  — held. The visitor's first real look at the finished product,
 *              at rest, before anything else happens.
 *  56.5-62%  — the camera pushes in again, past presentation size, onto the
 *              same central point the reveal itself already established
 *              (the stitching and copper trim) — a second, closer look.
 *  62-68%    — held on that detail.
 *  68-73.5%  — the frame re-centers toward the object's opposite long edge
 *              (where its nameplate sits), with one small, deliberate focus
 *              pull mid-move — a rack focus, not a jump cut.
 *  73.5-79%  — held on that second detail.
 *  79-83.5%  — the camera pulls back out to the full, composed product.
 *  83.5-86%  — held there, one last time, before the title card arrives.
 *  86-100%   — floating, centered, in a black premium studio, as the
 *              wordmark, kicker, headline, and CTAs unfurl.
 *
 * Nothing in that second half rotates the object or turns it into a
 * product-viewer toy — `mattressRotate` and `posLeft`/`posTop` are both
 * fully resolved by 52% and never move again. Every later beat is the
 * camera's own move (`scale` continuing its one existing curve, plus a new
 * `detailOriginX`/`detailOriginY` reframing where that scale expands from)
 * and the camera's own focus (`revealBlur`'s one small later pulse) — the
 * object itself just sits there, more desirable each time the camera
 * lingers on it, never spinning to prove it.
 *
 * Nothing above is an opacity cross-fade between two scenes. The studio
 * backdrop (grain, ambient glow, the dark gradients behind everything) is
 * rendered once, always at full opacity, sitting behind the villa photo in
 * paint order from the very first frame — it is never "faded up." What
 * changes is only ever the villa photo itself: its own brightness/
 * saturation falling (a real light dimming, via CSS filter) and an iris
 * mask narrowing its visible area (via CSS mask-image, not an opaque shape
 * drawn on top of it). As that mask closes, the backdrop already sitting
 * behind it is simply uncovered — depth and occlusion doing the work a
 * dissolve used to. The mattress reveal (below) picks up in the exact same
 * register: never an opacity fade of a separate image, always focus/
 * aperture/scale resolving an object that was already anchored there.
 *
 * Two easing registers do the work of "premium motion": `easeBreath` for
 * anything atmospheric or held (the light fading, a lift settling into a
 * hold), `easeReveal` for anything arriving at its final, resting state
 * (the settle into center, the text unfurling in, a camera move landing on
 * its subject). Nothing here is linear — a mechanical, constant-rate
 * interpolation is the single fastest way to make a scroll-scrub feel like
 * a slider instead of a shot.
 *
 * Light, not just visibility, does the directing. The villa's own vignette
 * and contrast (below) build hierarchy well before the room actually goes
 * dark, so the eye is already settling on the bed rather than the room
 * lighting flatly, uniformly, until it suddenly isn't. The mattress reveal
 * carries the same idea further: a directional light travels across the
 * object once it arrives (`lightSweep`), discovering edge, then stitching,
 * then the top fabric, then the whole silhouette — never switching the
 * object on all at once.
 */
export function useHeroTimeline(progress: MotionValue<number>): HeroTimeline {
  // 0% -> 23%: the camera dollies in continuously until the bed fills the
  // screen. Deliberately left linear — this is the one sustained,
  // motorized-feeling push of the whole sequence, and a constant rate reads
  // as more deliberate/inevitable here than an eased one would; every
  // shorter, punctuated beat after this gets a curve, this one earns its
  // plainness.
  const photoScale = useTransform(progress, [0, 0.232], [1, 1.6]);

  // The room's own light fading — a fast initial fall, then a much slower
  // continued settle that overlaps deliberately with the mattress's own
  // arrival below, so there's never a frame where the villa's light has
  // "finished" and the mattress hasn't "started": the handoff has no seam
  // to find. Never fully black — a real dim room still holds a little
  // light; 0.08 reads as darkness without going flat/dead.
  const DARK_STOPS = [0.232, 0.301, 0.376];
  const villaDim = useTransform(progress, DARK_STOPS, [1, 0.15, 0.08], {
    ease: [easeBreath, easeBreath],
  });
  const villaSaturate = useTransform(progress, DARK_STOPS, [1, 0.65, 0.5], {
    ease: [easeBreath, easeBreath],
  });

  // Hierarchy, not a uniform dim: a light-falloff anchored on the bed
  // itself grows from the first frame — soft and barely-there while the
  // room still reads as evenly, naturally lit, then deepening continuously
  // into the same dark stops above so the eye is already being pulled
  // toward the bed well before the room actually goes dark. Contrast rises
  // alongside it — shadows separating from midtones, the way a real room's
  // falls as its ambient fill drops away and only its strongest source
  // remains.
  const villaVignette = useTransform(progress, [0, DARK_STOPS[0], DARK_STOPS[1], DARK_STOPS[2]], [0, 0.45, 0.78, 0.9], {
    ease: [easeBreath, easeBreath, easeBreath],
  });
  const villaContrast = useTransform(progress, [0, DARK_STOPS[0], DARK_STOPS[2]], [1, 1.06, 1.22], {
    ease: [easeBreath, easeBreath],
  });

  // The same closing iris, narrowing around the bed's screen position — in
  // real px, not gradient-implicit percent. A radial-gradient's bare "%"
  // stops resolve against the distance to its *farthest corner*, which for
  // an off-center point like this one is large (over 1300px on a typical
  // desktop frame) — a "10%" hole would still be a ~130px-radius window,
  // nowhere near tight enough to read as "just the bed." Pixels give direct
  // control instead. By the last stop it's a small, almost-shut aperture —
  // not zero, a real iris never closes to a mathematical point — and from
  // here it's the mattress's own, separate reveal (below) that finishes the
  // job, painted in front of it.
  const vignetteHole = useTransform(progress, DARK_STOPS, [1100, 55, 18], {
    ease: [easeBreath, easeBreath],
  });

  // A few px of quiet drift as the mattress settles into its resting
  // composition — not enough to read as camera movement, just enough that
  // the backdrop isn't inert. Resolved before the product-story beats below
  // begin: once the camera starts exploring the object itself, the backdrop
  // holds still so nothing competes with it.
  const atmosphereDriftY = useTransform(progress, [0.463, 0.521], [-6, 0], { ease: easeBreath });

  // The object is visible (opacity) almost the instant the reveal begins —
  // what actually reveals it from here is arrival (scale), focus (blur),
  // and aperture, never opacity. Opacity's only job is avoiding a hard pop
  // the moment this element mounts into view.
  const mattressOpacity = useTransform(progress, [0.313, 0.33], [0, 1], { ease: easeReveal });

  // The reveal, in four beats — starting from the bed's own screen position
  // (72%, 66%; see the position drift below for why it doesn't stay there):
  //
  //   Arrival: scale rushes from bed-size toward its largest — the camera
  //     closing the remaining distance. Still tight, still blurred.
  //   Details: a soft, shallow-focus close-up on the stitching and the
  //     copper edge trim — the aperture opens a little, focus barely.
  //   Volume: the aperture opens across most of the frame and focus pulls
  //     further — the whole silhouette reads now, still soft.
  //   Whole product: fully open, fully sharp, held at its largest — the
  //     climax the first half of the shot has been building to.
  const REVEAL_STOPS = [0.318, 0.347, 0.394, 0.434, 0.463];

  const revealAperture = useTransform(progress, REVEAL_STOPS, [12, 15, 42, 96, 160], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath],
  });

  // The camera re-focuses exactly once more after the initial reveal
  // resolves — a small, brief blur pulse exactly where the frame re-centers
  // toward the second product detail below (see detailOriginX/Y). A rack
  // focus, the way a real lens would settle on a new point of interest
  // mid-move, not a jump cut to a sharp new shot.
  const revealBlur = useTransform(
    progress,
    [...REVEAL_STOPS, 0.68, 0.705, 0.735],
    [22, 20, 8, 2, 0, 0, 4, 0],
    { ease: [easeReveal, easeBreath, easeBreath, easeBreath, easeBreath, easeBreath, easeBreath] },
  );

  // Never illuminated all at once: a directional light travels across the
  // object in the same four beats as the reveal above, discovering it
  // rather than switching it on — first grazing the near edge and its
  // copper trim, then the stitching band, then sweeping across the top
  // fabric, then clearing the frame entirely by the climax so what's left
  // is the object's own, already-resolved lighting rather than a moving
  // highlight. A position (not opacity) drives it, so it reads as a beam
  // discovering material, not a layer dissolving in.
  const lightSweep = useTransform(progress, REVEAL_STOPS, [-15, 15, 50, 95, 135], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath],
  });

  // The anchor drifts gently toward center throughout the reveal — a
  // reframe, not a repositioning — so the object never clips the viewport
  // edge as it grows to climax size, then continues to its final, lower,
  // composed position once recomposing begins. This is the last time the
  // object's screen position or rotation ever changes: every beat of the
  // product story below moves the camera, not the object.
  const mattressLeft = useTransform(progress, [REVEAL_STOPS[0], 0.463, 0.521], ["72%", "52%", "50%"], {
    ease: [easeBreath, easeReveal],
  });
  const mattressTop = useTransform(progress, [REVEAL_STOPS[0], 0.463, 0.521], ["66%", "48%", "80%"], {
    ease: [easeBreath, easeReveal],
  });

  // 46% -> 52%: only now does the object rotate — turning to its resting
  // angle. "Revealed" and "coming alive" are different beats; rotation is
  // held at 0 through the entire reveal above so the object reads as
  // resolving into focus, not tumbling into view. It never rotates again —
  // the product story below is told entirely by the camera.
  const mattressRotate = useTransform(progress, [0.463, 0.521], [0, 12], { ease: easeReveal });

  // Studio dressing (ambient glow, contact shadow, fog) arrives right as the
  // reveal reaches full focus — the light turning on for the climax — and
  // holds through the settle into center and everything after.
  const studioOpacity = useTransform(progress, [0.434, 0.504], [0, 1], { ease: easeBreath });

  // The reveal used to end here. It doesn't anymore: the object is now at
  // rest, composed, floating — and the camera keeps going, telling the rest
  // of its story rather than handing straight off to the title card.
  //
  //   Held (52-56.5%): the first unhurried look at the finished product.
  //   Push (56.5-62%): the camera moves in past presentation size, onto the
  //     exact point the reveal already anchored on — the stitching and
  //     copper trim, dead-center of the source photograph.
  //   Held (62-68%): a second, closer look — this is the "I want to touch
  //     this" beat, not the "I've already seen it" one.
  //   Reframe (68-73.5%): the frame re-centers toward the object's opposite
  //     long edge, where its nameplate sits — one continuous camera move,
  //     not a cut, carrying the small focus pulse from revealBlur above.
  //   Held (73.5-79%): a second detail, given the same unhurried attention
  //     as the first.
  //   Pull back (79-83.5%): the camera retreats to the full, composed
  //     product — the story resolving, not simply stopping.
  //   Held (83.5-86%): one last, calm look before the title card.
  //
  // One continuous curve for the whole arc, exactly as the original reveal
  // was: scale rushing to its climax, settling to rest, then continuing
  // into these later pushes and pulls, rather than a second, separate
  // motion value bolted on top of a "finished" one.
  const mattressScale = useTransform(
    progress,
    [...REVEAL_STOPS, 0.521, 0.565, 0.62, 0.68, 0.735, 0.79, 0.835, 0.86],
    [0.4, 1.6, 2.0, 2.2, 2.3, 1, 1, 1.55, 1.55, 1.62, 1.62, 1, 1],
    {
      ease: [
        easeReveal,
        easeBreath,
        easeBreath,
        easeBreath,
        easeReveal,
        easeBreath,
        easeReveal,
        easeBreath,
        easeBreath,
        easeBreath,
        easeReveal,
        easeBreath,
      ],
    },
  );

  // Where the camera's later pushes (scale, above) expand from — the
  // reframe that makes a push read as "moving to a different part of the
  // object" rather than "the same close-up, bigger." Holds at the object's
  // own center (50/50 — where the reveal itself already centered the
  // stitching and trim) through the first detail, then eases toward its
  // opposite long edge for the second, then eases back to center as the
  // camera pulls out to the full product. Never touches posLeft/posTop or
  // rotate — the object's screen position and angle stay exactly where the
  // reveal left them.
  const detailOriginX = useTransform(progress, [0.565, 0.62, 0.68, 0.735, 0.79, 0.835], [50, 50, 50, 70, 70, 50], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath, easeReveal],
  });
  const detailOriginY = useTransform(progress, [0.565, 0.62, 0.68, 0.735, 0.79, 0.835], [50, 50, 50, 54, 54, 50], {
    ease: [easeReveal, easeBreath, easeBreath, easeBreath, easeReveal],
  });

  // The final arrival plays as one unhurried beat, not a scramble: logo
  // first and alone, then kicker, headline, and CTAs unfurl in a light
  // stagger — each overlapping the last rather than waiting for it, so it
  // reads as one continuous motion, not four cues. It's the title card
  // after the product's own story has already played, not a rushed
  // afterthought competing with it.
  // Only the opacity leg of each reveal carries a custom curve — at a 10-14px
  // drift, an eased Y offset and a linear one are visually indistinguishable,
  // and opacity alone already carries the "arriving" feel.
  const logoOpacity = useTransform(progress, [0.86, 0.916], [0, 1], { ease: easeReveal });
  const logoY = useTransform(progress, [0.86, 0.916], [14, 0]);

  const kickerOpacity = useTransform(progress, [0.916, 0.944], [0, 1], { ease: easeReveal });
  const kickerY = useTransform(progress, [0.916, 0.944], [12, 0]);

  const headlineOpacity = useTransform(progress, [0.937, 0.965], [0, 1], { ease: easeReveal });
  const headlineY = useTransform(progress, [0.937, 0.965], [12, 0]);

  const ctaOpacity = useTransform(progress, [0.958, 1], [0, 1], { ease: easeReveal });
  const ctaY = useTransform(progress, [0.958, 1], [10, 0]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  const scrollCueOpacity = useTransform(progress, [0.972, 1], [0, 1], { ease: easeReveal });

  return {
    intro: { photoScale, vignetteHole, villaDim, villaSaturate, villaVignette, villaContrast },
    transition: { atmosphereDriftY },
    mattress: {
      opacity: mattressOpacity,
      posLeft: mattressLeft,
      posTop: mattressTop,
      rotate: mattressRotate,
      scale: mattressScale,
      studioOpacity,
      revealAperture,
      revealBlur,
      lightSweep,
      detailOriginX,
      detailOriginY,
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
