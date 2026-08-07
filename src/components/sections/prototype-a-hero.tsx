"use client";

import { useMotionValue } from "framer-motion";

import { Hero } from "@/components/sections/hero";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";

/**
 * Prototype A — the product is visible immediately. No reveal, no scroll
 * gate: everything MattressVisual/Hero can show is already at its final
 * value the instant this mounts. Rough on purpose — this is a comparison
 * prototype, not production code.
 */
export function PrototypeAHero() {
  const pointerTilt = usePointerTilt();

  const opacity = useMotionValue(1);
  const posLeft = useMotionValue("50%");
  const posTop = useMotionValue("50%");
  const rotate = useMotionValue(10);
  const scale = useMotionValue(1);
  const studioOpacity = useMotionValue(1);
  const revealAperture = useMotionValue(900);
  const revealBlur = useMotionValue(0);
  const detailOriginX = useMotionValue(50);
  const detailOriginY = useMotionValue(50);

  const heroVisible = useMotionValue(1);
  const heroY = useMotionValue(0);
  const heroPointerEvents = useMotionValue("auto");

  return (
    <div
      onPointerMove={pointerTilt.onPointerMove}
      onPointerLeave={pointerTilt.onPointerLeave}
      className="relative h-svh w-full overflow-hidden bg-black"
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
        logoOpacity={heroVisible}
        logoY={heroY}
        kickerOpacity={heroVisible}
        kickerY={heroY}
        headlineOpacity={heroVisible}
        headlineY={heroY}
        ctaOpacity={heroVisible}
        ctaY={heroY}
        ctaPointerEvents={heroPointerEvents}
        scrollCueOpacity={heroVisible}
      />
    </div>
  );
}
