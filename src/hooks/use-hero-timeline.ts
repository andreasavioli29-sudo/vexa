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
    /** Radius, in px, of the small window the object is currently being discovered through — a moving flashlight, not an opening iris. */
    revealAperture: MotionValue<number>;
    /** Focus pull, in px of blur — soft and mysterious for the earliest, most abstract fragments, tack-sharp by the full reveal. */
    revealBlur: MotionValue<number>;
    /** transform-origin X (%) — which point on the object's own surface the camera is currently investigating. */
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
 * THE PRODUCT IS NEVER SHOWN. IT IS DISCOVERED.
 *
 * The mattress reveal is not an object fading, focusing, or growing into
 * view as a single continuous action — that reads as a website animation,
 * not a film. Instead it is a sequence of small, dark, deliberately
 * incomplete fragments, each a fixed point of interest the camera lingers
 * on before moving to the next, in an order that answers less first and
 * more later:
 *
 *   shape       — a sliver of edge-lit contour against black. Could be
 *                 almost anything. Scale is at its most extreme here —
 *                 the fragment is magnified, isolated, unidentifiable.
 *   edge        — closer on where the trim meets the side. A glint, a
 *                 line of light. Slightly less magnified, slightly less
 *                 abstract.
 *   stitching   — the channel-quilting, now legible as fabric.
 *   material    — pulled back further onto the quilted plane itself.
 *                 Sharp, tactile — this is the "I want to touch this"
 *                 beat — but still no sense of the object's overall shape.
 *   proportions — the widest, least magnified fragment, aperture opened
 *                 the most so far. Two edges converge into view; for the
 *                 first time the mind can guess at scale and geometry —
 *                 but the guess is still unconfirmed.
 *   the whole   — a decisive, singular snap: the small discovery window
 *                 blows open and the camera pushes to its largest,
 *                 sharpest, fully composed frame in one motion. This is
 *                 the payoff every fragment before it was withholding.
 *
 * Two motion values do almost all of the work, moving in opposition to
 * each other: `mattressScale` (how magnified the current fragment is —
 * high for the most abstract fragments, easing down as they get more
 * legible, then surging back up for the final push) and `revealAperture`
 * (how large the discovery window is — small and barely-there for the
 * early fragments, widening fragment by fragment, then jumping open
 * entirely for the reveal). `detailOriginX`/`detailOriginY` decide *where*
 * on the object each fragment sits — the same coordinate drives both the
 * discovery window's own center and the point `scale` expands from, so a
 * fragment always reads as "this specific, fixed part of the object,
 * magnified" rather than "the same crop, resized." Every fragment holds
 * for a real, deliberate beat before the camera moves to the next — the
 * pauses are not empty space, they're where desire is built.
 *
 * The object never rotates and never repositions itself on screen through
 * any of this (`rotate`, `posLeft`, `posTop` are all untouched until the
 * settle afterward) — it is the camera's attention moving across a still,
 * confident object, never the object performing for the camera.
 *
 * After the reveal settles into its composed, floating rest position, the
 * same fragment-discovery language gets one more, much shorter use: a held
 * beat, a single push toward the object's nameplate, a hold, and a pull
 * back to the full product — a quiet coda, not a second set-piece — before
 * the title card arrives.
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
 * dissolve used to. The mattress fragments above pick up in the exact same
 * register: never an opacity fade of a separate image, always a window
 * (in real px, for the same farthest-corner reason documented on
 * `vignetteHole` below) moving across an object that was already there.
 *
 * Two easing registers do the work of "premium motion": `easeBreath` for
 * anything atmospheric, held, or resting (a fragment's hold, the light
 * fading, a lift settling), `easeReveal` for anything arriving at a new
 * fixed point (a fragment's own arrival, the settle into center, the text
 * unfurling in). Nothing here is linear — a mechanical, constant-rate
 * interpolation is the single fastest way to make a scroll-scrub feel like
 * a slider instead of a shot.
 *
 * Light still builds hierarchy the way the villa scene establishes it:
 * the villa's own vignette and contrast build well before the room
 * actually goes dark, so the eye is already settling on the bed rather
 * than the room lighting flatly, uniformly, until it suddenly isn't.
 */
export function useHeroTimeline(progress: MotionValue<number>): HeroTimeline {
  // 0% -> ~14%: the camera dollies in continuously until the bed fills the
  // screen. Deliberately left linear — this is the one sustained,
  // motorized-feeling push of the whole sequence, and a constant rate reads
  // as more deliberate/inevitable here than an eased one would; every
  // shorter, punctuated beat after this gets a curve, this one earns its
  // plainness.
  const photoScale = useTransform(progress, [0, 0.1417], [1, 1.6]);

  // The room's own light fading — a fast initial fall, then a much slower
  // continued settle that overlaps deliberately with the first fragment
  // below, so there's never a frame where the villa's light has "finished"
  // and the discovery hasn't "started": the handoff has no seam to find.
  // Never fully black — a real dim room still holds a little light; 0.08
  // reads as darkness without going flat/dead.
  const DARK_STOPS = [0.1417, 0.1967, 0.2333];
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
  // control instead, and the same reasoning is why every fragment window
  // below is also defined in px. By the last stop it's a small, almost-shut
  // aperture — not zero, a real iris never closes to a mathematical point.
  const vignetteHole = useTransform(progress, DARK_STOPS, [1100, 55, 18], {
    ease: [easeBreath, easeBreath],
  });

  // The object is visible (opacity) the instant the room goes dark and the
  // first fragment begins — what actually reveals anything from here is
  // never opacity again, only the fragment sequence below. Opacity's only
  // job is avoiding a hard pop the moment this element mounts.
  const mattressOpacity = useTransform(progress, [0.2333, 0.2467], [0, 1], { ease: easeReveal });

  // The fragment sequence itself. Each fragment is a flat pair of stops
  // (arrive, hold) — the *transition between* consecutive fragments' stops
  // is where the camera visibly moves from one point of interest to the
  // next. Six fragments, ending on the full reveal:
  //
  //   shape (23-27%)       -> edge (31-35%)      -> stitching (38-42%)
  //   -> material (46-50%) -> proportions (54-58%) -> the whole (63-68%)
  //
  // detailOriginX/Y decide *where* each fragment sits on the object's own
  // surface (see the anchors table below, chosen against the actual source
  // photograph: the stitching and copper trim sit dead-center of it; its
  // near corner and far corner are where "shape" and "edge" read cleanest
  // as pure contour/glint before anything else resolves).
  const FRAG_STOPS = [
    0.2333, 0.2733, // shape
    0.31, 0.3467, // edge
    0.3833, 0.4233, // stitching
    0.46, 0.5, // material
    0.54, 0.5833, // proportions
    0.6333, 0.6833, // the whole (arrives, then holds at climax)
  ];
  const FRAG_EASE = [
    easeBreath, easeReveal, easeBreath, easeReveal, easeBreath,
    easeReveal, easeBreath, easeReveal, easeBreath, easeReveal, easeBreath,
  ];

  // How magnified the current fragment is. High and abstract for "shape,"
  // easing down as each fragment gets more legible and more context
  // enters frame, then surging back up as the whole object finally
  // resolves — the camera's one decisive final push.
  const mattressScale = useTransform(
    progress,
    [...FRAG_STOPS, 0.7233, 0.7567, 0.7967, 0.84, 0.88],
    [3.3, 3.3, 2.9, 2.9, 2.6, 2.6, 2.3, 2.3, 1.7, 1.7, 2.3, 2.3, 1, 1, 1.55, 1.55, 1],
    {
      ease: [
        ...FRAG_EASE,
        easeReveal, // climax -> settles to resting, composed size
        easeBreath, // held at rest
        easeReveal, // pushes toward the nameplate detail
        easeBreath, // held on the nameplate
        easeReveal, // pulls back to the full, composed product
      ],
    },
  );

  // How large the discovery window is — barely a peephole for "shape,"
  // widening fragment by fragment as more is deliberately let through, then
  // jumping far past the object's own size for the full reveal so the mask
  // is, in effect, no longer a mask at all. Real px throughout, for the
  // same farthest-corner reason as vignetteHole above — off-center anchors
  // make bare percentages resolve unpredictably.
  const revealAperture = useTransform(
    progress,
    FRAG_STOPS,
    [28, 28, 36, 36, 50, 50, 65, 65, 105, 105, 800, 800],
    { ease: FRAG_EASE },
  );

  // Focus follows the same logic as the aperture: soft and uncertain for
  // the earliest, most abstract fragments (mystery is the point), sharper
  // as each fragment gets more materially specific, a touch of softness
  // returning for "proportions" (a slightly dreamier, pulled-back beat),
  // then tack-sharp for the reveal. One small extra pulse later, exactly as
  // the camera re-centers toward the nameplate after the settle — a rack
  // focus, the way a real lens would settle on a new point of interest
  // mid-move, not a jump cut to a sharp new shot.
  const revealBlur = useTransform(
    progress,
    [...FRAG_STOPS, 0.7567, 0.78, 0.7967],
    [15, 15, 11, 11, 5, 5, 1.5, 1.5, 3, 3, 0, 0, 0, 3, 0],
    { ease: [...FRAG_EASE, easeBreath, easeBreath, easeBreath] },
  );

  // Where each fragment sits on the object's own surface (see the sequence
  // doc above for why these specific points, chosen against the actual
  // source photograph). Holds at center through the reveal's climax, the
  // settle, and the held rest afterward, then makes one further move late
  // in the shot — toward the nameplate on the object's far edge — before
  // easing back to center as the camera pulls back to the full product.
  const detailOriginX = useTransform(
    progress,
    [...FRAG_STOPS, 0.7567, 0.7967, 0.84, 0.88],
    [38, 38, 28, 28, 50, 50, 58, 58, 48, 48, 50, 50, 50, 72, 72, 50],
    { ease: [...FRAG_EASE, easeBreath, easeReveal, easeBreath, easeReveal] },
  );
  const detailOriginY = useTransform(
    progress,
    [...FRAG_STOPS, 0.7567, 0.7967, 0.84, 0.88],
    [72, 72, 60, 60, 50, 50, 38, 38, 52, 52, 50, 50, 50, 53, 53, 50],
    { ease: [...FRAG_EASE, easeBreath, easeReveal, easeBreath, easeReveal] },
  );

  // Only now — after the whole object has already resolved at its climax
  // size — does it settle to its composed, resting proportions, lift, and
  // rotate to its ~12deg angle. It never rotates or repositions again;
  // every later beat (the nameplate push/pull above) is the camera
  // choosing where to look, never the object performing for it.
  const mattressRotate = useTransform(progress, [0.6833, 0.7233], [0, 12], { ease: easeReveal });
  const mattressLeft = useTransform(progress, [0.6833, 0.7233], ["72%", "50%"], { ease: easeReveal });
  const mattressTop = useTransform(progress, [0.6833, 0.7233], ["66%", "80%"], { ease: easeReveal });

  // A few px of quiet drift as the mattress settles into its resting
  // composition — not enough to read as camera movement, just enough that
  // the backdrop isn't inert. Resolved before anything else happens.
  const atmosphereDriftY = useTransform(progress, [0.6833, 0.7233], [-6, 0], { ease: easeBreath });

  // Studio dressing (ambient glow, contact shadow, fog) arrives right as
  // the whole object resolves — the light turning on for the climax — and
  // holds through everything after.
  const studioOpacity = useTransform(progress, [0.6333, 0.6833], [0, 1], { ease: easeBreath });

  // The final arrival plays as one unhurried beat, not a scramble: logo
  // first and alone, then kicker, headline, and CTAs unfurl in a light
  // stagger — each overlapping the last rather than waiting for it, so it
  // reads as one continuous motion, not four cues. It's the title card
  // after the product's own story has already played, not a rushed
  // afterthought competing with it.
  // Only the opacity leg of each reveal carries a custom curve — at a 10-14px
  // drift, an eased Y offset and a linear one are visually indistinguishable,
  // and opacity alone already carries the "arriving" feel.
  const logoOpacity = useTransform(progress, [0.907, 0.944], [0, 1], { ease: easeReveal });
  const logoY = useTransform(progress, [0.907, 0.944], [14, 0]);

  const kickerOpacity = useTransform(progress, [0.944, 0.963], [0, 1], { ease: easeReveal });
  const kickerY = useTransform(progress, [0.944, 0.963], [12, 0]);

  const headlineOpacity = useTransform(progress, [0.958, 0.977], [0, 1], { ease: easeReveal });
  const headlineY = useTransform(progress, [0.958, 0.977], [12, 0]);

  const ctaOpacity = useTransform(progress, [0.972, 1], [0, 1], { ease: easeReveal });
  const ctaY = useTransform(progress, [0.972, 1], [10, 0]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  const scrollCueOpacity = useTransform(progress, [0.981, 1], [0, 1], { ease: easeReveal });

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
