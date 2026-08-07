"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";

import { IntroScene } from "@/components/sections/intro-scene";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { Hero } from "@/components/sections/hero";
import { useHeroTimeline } from "@/hooks/use-hero-timeline";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";
import { EASE_BREATH } from "@/lib/motion";

/**
 * One uninterrupted camera shot, not a sequence of sections. The actual
 * scroll choreography lives in useHeroTimeline (grouped by scene); this
 * component only wires that timeline to the DOM/paint order.
 *
 * The mattress is never a separate "product hero" element that fades in
 * elsewhere — it's anchored at the bed's own screen position (the same
 * left/top the IntroScene vignette closes around) from the moment it
 * appears, and only then animates to centered. Everything is driven by one
 * scroll progress value across a single pinned viewport.
 *
 * The wrapper's height gives the product reveal itself real room: it is
 * not a single fade or focus pull, but a sequence of small, held fragments
 * — shape, edge, stitching, material, proportions — each its own
 * deliberate beat before the whole object finally resolves (see
 * useHeroTimeline for the full sequence). That reveal settling into rest
 * is still the middle of this shot, not the end of it — the camera goes on
 * to push in once more, hold, and pull back before the title card, all
 * driven by the same single progress value.
 */
export function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    // Numeric (not "start start"/"end end") so this doesn't exactly match
    // Framer's built-in offset presets — an exact match makes it swap to a
    // native CSS ViewTimeline, which is degenerate (frozen) for a target
    // much taller than the viewport, like this pinned scroll-scrub wrapper.
    offset: [
      [0, 0],
      [1, 0.999],
    ],
  });

  const timeline = useHeroTimeline(progress);
  const pointerTilt = usePointerTilt();

  return (
    <div ref={wrapperRef} className="relative h-[600vh] w-full sm:h-[640vh]">
      <div
        onPointerMove={pointerTilt.onPointerMove}
        onPointerLeave={pointerTilt.onPointerLeave}
        className="sticky top-0 h-svh w-full overflow-hidden"
      >
        {/*
          The studio backdrop — rendered once, always at full opacity, from
          the very first frame. It is never faded up: it simply sits behind
          IntroScene in paint order, waiting to be uncovered as that scene's
          own iris mask narrows and its photo dims. There is no cross-fade
          here, only occlusion — depth doing what an opacity layer used to.
          A few px of scroll-linked drift (y) keeps it from feeling inert
          once the choreographed moves are done; it's a quiet, held camera,
          not a static frame.
        */}
        <motion.div
          aria-hidden="true"
          style={{ y: timeline.transition.atmosphereDriftY }}
          className="bg-grain pointer-events-none absolute inset-0 bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_-8%,var(--color-anthracite-800),transparent)] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_84%_6%,var(--color-anthracite-900),transparent)]" />
          {/*
            The one place the black background is allowed to feel alive: an
            extremely slow, low-amplitude opacity breathe on the warm glow
            only — perceived subconsciously, never as "an animation." Frozen
            for anyone who's asked for less motion.
          */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[65%] bg-[radial-gradient(ellipse_85%_70%_at_50%_100%,rgba(138,82,48,0.16),transparent_70%)]"
            animate={reduceMotion ? undefined : { opacity: [1, 0.82, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: EASE_BREATH }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--color-black-900)_92%)] opacity-70" />
          <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
        </motion.div>

        <IntroScene {...timeline.intro} />

        <MattressVisual
          tiltX={pointerTilt.tiltX}
          tiltY={pointerTilt.tiltY}
          lightX={pointerTilt.lightX}
          lightY={pointerTilt.lightY}
          {...timeline.mattress}
        />

        <Hero {...timeline.hero} />
      </div>
    </div>
  );
}
