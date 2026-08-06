"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { IntroScene } from "@/components/sections/intro-scene";
import { Hero } from "@/components/sections/hero";

/**
 * Scene 01 -> 02/03 in one scroll-scrubbed, pinned sequence:
 * an alpine villa at sunrise dissolves as its bed detaches, rotates and
 * becomes the floating product hero on matte black. No abrupt cuts —
 * everything is driven by real scroll position, not time.
 */
export function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Scene 01 exit
  const introOpacity = useTransform(progress, [0, 0.32, 0.48], [1, 1, 0]);
  const introScale = useTransform(progress, [0, 0.48], [1, 1.06]);
  const introBlur = useTransform(progress, [0.18, 0.48], [0, 12]);

  // The bed detaches and lifts, handing off to the floating mattress
  const bedRotate = useTransform(progress, [0.26, 0.48], [0, -13]);
  const bedLift = useTransform(progress, [0.26, 0.48], [0, -70]);
  const bedOpacity = useTransform(progress, [0.38, 0.5], [1, 0]);

  // Sunrise dissolves to matte black studio atmosphere
  const blackoutOpacity = useTransform(progress, [0.3, 0.55], [0, 1]);

  // Scene 02/03 entrance
  const heroOpacity = useTransform(progress, [0.38, 0.58], [0, 1]);
  const heroScale = useTransform(progress, [0.38, 0.58], [0.96, 1]);
  const heroPointerEvents = useTransform(heroOpacity, (v) => (v > 0.6 ? "auto" : "none"));

  // Scene 04 — near-imperceptible continued rotation once settled, tied to scroll
  const settleRotate = useTransform(progress, [0.7, 1], [0, -1.5]);
  const settleY = useTransform(progress, [0.7, 1], [0, -14]);

  return (
    <div ref={wrapperRef} className="relative h-[220vh] w-full sm:h-[260vh]">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <IntroScene
          opacity={introOpacity}
          scale={introScale}
          blur={introBlur}
          bedRotate={bedRotate}
          bedLift={bedLift}
          bedOpacity={bedOpacity}
        />

        <motion.div
          aria-hidden="true"
          style={{ opacity: blackoutOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, pointerEvents: heroPointerEvents }}
          className="absolute inset-0"
        >
          <Hero settleRotate={settleRotate} settleY={settleY} />
        </motion.div>
      </div>
    </div>
  );
}
