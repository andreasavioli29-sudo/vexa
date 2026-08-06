"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { IntroScene } from "@/components/sections/intro-scene";
import { Hero } from "@/components/sections/hero";

/**
 * One continuous camera move, not a scene cut: the client's villa photo
 * dollies in toward the bed while a vignette closes in around it — the room
 * going dark, never a blur. The mattress emerges at that exact screen
 * position and drifts to centered as the black studio atmosphere and the
 * product headline arrive after it, in that order. All driven by real
 * scroll position via a single pinned, scroll-scrubbed wrapper.
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

  // The camera dollies in continuously — never stops, never cuts
  const photoScale = useTransform(progress, [0, 0.65], [1, 1.55]);

  // The room darkens as a closing iris around the bed's screen position
  const vignetteHole = useTransform(progress, [0.05, 0.55], [80, 3]);

  // Final cleanup once the iris has essentially closed
  const blackoutOpacity = useTransform(progress, [0.45, 0.6], [0, 1]);

  // The mattress emerges exactly where the bed sits, then drifts to centered
  const mattressOpacity = useTransform(progress, [0.3, 0.55], [0, 1]);
  const mattressX = useTransform(progress, [0.3, 0.62], ["17vw", "0vw"]);
  const mattressY = useTransform(progress, [0.3, 0.62], ["5vh", "0vh"]);
  const mattressScale = useTransform(progress, [0.3, 0.62], [0.52, 1]);

  // The black studio atmosphere settles in behind the mattress
  const atmosphereOpacity = useTransform(progress, [0.5, 0.65], [0, 1]);

  // The headline/CTAs arrive last, once the object is already in place
  const textOpacity = useTransform(progress, [0.64, 0.82], [0, 1]);
  const textPointerEvents = useTransform(textOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  // Scene 04 — near-imperceptible continued rotation once fully settled
  // (kept small so the total stays close to the ~12deg base rotation)
  const settleRotate = useTransform(progress, [0.85, 1], [0, -0.6]);
  const settleY = useTransform(progress, [0.85, 1], [0, -12]);

  return (
    <div ref={wrapperRef} className="relative h-[220vh] w-full sm:h-[260vh]">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <IntroScene photoScale={photoScale} vignetteHole={vignetteHole} />

        {/* Final cleanup once the iris has closed — sits between the photo and the product world */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: blackoutOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        <Hero
          atmosphereOpacity={atmosphereOpacity}
          textOpacity={textOpacity}
          textPointerEvents={textPointerEvents}
          mattressOpacity={mattressOpacity}
          mattressX={mattressX}
          mattressY={mattressY}
          mattressScale={mattressScale}
          settleRotate={settleRotate}
          settleY={settleY}
        />
      </div>
    </div>
  );
}
