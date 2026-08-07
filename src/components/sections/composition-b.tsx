"use client";

import { useMotionValue } from "framer-motion";

import { Hero } from "@/components/sections/hero";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";

/**
 * Composition B — Centered Object, Generous Void. The product sits at a
 * moderate, believable scale surrounded by a large amount of quiet black —
 * dominance through isolation and contrast, not raw size. The existing
 * Hero text stack is reused unchanged above it.
 */
export function CompositionB() {
  const pointerTilt = usePointerTilt();

  const opacity = useMotionValue(1);
  const posLeft = useMotionValue("50%");
  const posTop = useMotionValue("68%");
  const rotate = useMotionValue(10);
  const scale = useMotionValue(1.15);
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_70%,rgba(120,70,40,0.09),transparent_70%)]" />

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
