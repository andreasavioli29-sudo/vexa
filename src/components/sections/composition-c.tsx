"use client";

import { useMotionValue } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";

/**
 * Composition C — Split Frame / Off-Center Anchor. The product is large
 * and anchored right-of-center, allowed to bleed toward the frame edge —
 * an editorial, magazine-page layout rather than a centered hero. Type
 * lives in its own quiet column on the left, never overlapping the object.
 */
export function CompositionC() {
  const pointerTilt = usePointerTilt();

  const opacity = useMotionValue(1);
  const posLeft = useMotionValue("68%");
  const posTop = useMotionValue("55%");
  const rotate = useMotionValue(10);
  const scale = useMotionValue(1.9);
  const studioOpacity = useMotionValue(1);
  const revealAperture = useMotionValue(900);
  const revealBlur = useMotionValue(0);
  const detailOriginX = useMotionValue(50);
  const detailOriginY = useMotionValue(50);

  return (
    <div
      onPointerMove={pointerTilt.onPointerMove}
      onPointerLeave={pointerTilt.onPointerLeave}
      className="relative h-svh w-full overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_68%_55%,rgba(120,70,40,0.1),transparent_70%)]" />

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

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-full max-w-md flex-col justify-center px-8 sm:px-14 lg:px-20">
        <Logo markClassName="h-4 w-4" wordmarkClassName="text-base" />

        <div className="mt-9 flex items-center gap-3 text-copper-300/90">
          <span className="h-px w-8 bg-copper-400/50" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em]">
            The Art of Sleeping
          </span>
        </div>

        <h1 className="mt-8 text-[clamp(1.9rem,4.4vw,3.4rem)] font-light leading-[1.08] tracking-[-0.01em] text-white">
          Stillness,
          <br />
          by design.
          <br />
          <span className="font-display italic font-normal text-copper-200">Sleep.</span>
        </h1>

        <div className="mt-10 flex flex-col items-start gap-4">
          <Button href="/one" size="lg" icon className="pointer-events-auto">
            Discover VEXA
          </Button>
          <Button href="/signature" variant="outline" size="lg" className="pointer-events-auto">
            Explore ONE &amp; SIGNATURE
          </Button>
        </div>
      </div>
    </div>
  );
}
