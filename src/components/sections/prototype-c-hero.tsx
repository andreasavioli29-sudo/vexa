"use client";

import { useRef } from "react";
import { useMotionValue, useScroll, useTransform } from "framer-motion";

import { Hero } from "@/components/sections/hero";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";
import { easeBreath, easeReveal } from "@/lib/motion";

/**
 * Prototype C — the product is revealed only at the end. Almost the whole
 * scroll stays dark (a near-shut discovery window, heavy blur); the reveal
 * is one decisive jump in the last ~10% of scroll, not a progressive
 * sequence. Rough on purpose — comparison prototype, not production code.
 */
export function PrototypeCHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: [
      [0, 0],
      [1, 0.999],
    ],
  });
  const pointerTilt = usePointerTilt();

  const revealAperture = useTransform(progress, [0, 0.8, 0.9], [10, 10, 900], {
    ease: [easeBreath, easeReveal],
  });
  const revealBlur = useTransform(progress, [0, 0.8, 0.9], [24, 24, 0], {
    ease: [easeBreath, easeReveal],
  });
  const studioOpacity = useTransform(progress, [0.8, 0.9], [0, 1], { ease: easeBreath });

  const opacity = useMotionValue(1);
  const posLeft = useMotionValue("50%");
  const posTop = useMotionValue("50%");
  const rotate = useMotionValue(10);
  const scale = useMotionValue(1);
  const detailOriginX = useMotionValue(50);
  const detailOriginY = useMotionValue(50);

  const logoOpacity = useTransform(progress, [0.88, 0.94], [0, 1], { ease: easeReveal });
  const logoY = useTransform(progress, [0.88, 0.94], [14, 0]);
  const kickerOpacity = useTransform(progress, [0.91, 0.95], [0, 1], { ease: easeReveal });
  const kickerY = useTransform(progress, [0.91, 0.95], [12, 0]);
  const headlineOpacity = useTransform(progress, [0.93, 0.97], [0, 1], { ease: easeReveal });
  const headlineY = useTransform(progress, [0.93, 0.97], [12, 0]);
  const ctaOpacity = useTransform(progress, [0.96, 1], [0, 1], { ease: easeReveal });
  const ctaY = useTransform(progress, [0.96, 1], [10, 0]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v): string => (v > 0.6 ? "auto" : "none"));
  const scrollCueOpacity = useTransform(progress, [0, 0.08, 0.7], [1, 1, 0]);

  return (
    <div ref={wrapperRef} className="relative h-[260vh] w-full">
      <div
        onPointerMove={pointerTilt.onPointerMove}
        onPointerLeave={pointerTilt.onPointerLeave}
        className="sticky top-0 h-svh w-full overflow-hidden bg-black"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_-8%,var(--color-anthracite-800),transparent)] opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_84%_6%,var(--color-anthracite-900),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_100%,rgba(138,82,48,0.16),transparent_70%)]" />

        <MattressVisual
          tiltX={pointerTilt.tiltX}
          tiltY={pointerTilt.tiltY}
          lightX={pointerTilt.lightX}
          lightY={pointerTilt.lightY}
          opacity={opacity}
          posLeft={posLeft}
          posTop={posTop}
          rotate={rotate}
          scale={scale}
          studioOpacity={studioOpacity}
          revealAperture={revealAperture}
          revealBlur={revealBlur}
          detailOriginX={detailOriginX}
          detailOriginY={detailOriginY}
        />

        <Hero
          logoOpacity={logoOpacity}
          logoY={logoY}
          kickerOpacity={kickerOpacity}
          kickerY={kickerY}
          headlineOpacity={headlineOpacity}
          headlineY={headlineY}
          ctaOpacity={ctaOpacity}
          ctaY={ctaY}
          ctaPointerEvents={ctaPointerEvents}
          scrollCueOpacity={scrollCueOpacity}
        />
      </div>
    </div>
  );
}
