"use client";

import { useMotionValue } from "framer-motion";

import { Button } from "@/components/ui/button";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";

/**
 * Composition A — Full Bleed Dominance. The product fills almost the
 * entire first screen; everything else is stripped to bare black plus one
 * soft glow. Minimal type, positioned small and low, so it never competes.
 */
export function CompositionA() {
  const pointerTilt = usePointerTilt();

  const opacity = useMotionValue(1);
  const posLeft = useMotionValue("50%");
  const posTop = useMotionValue("52%");
  const rotate = useMotionValue(9);
  const scale = useMotionValue(2.4);
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(120,70,40,0.1),transparent_70%)]" />

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

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-4 px-6 text-center sm:bottom-14">
        <div className="flex items-center gap-3 text-copper-300/90">
          <span className="h-px w-8 bg-copper-400/50" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-copper-400/50" />
        </div>
        <Button href="/one" size="lg" icon className="pointer-events-auto">
          Discover VEXA
        </Button>
      </div>
    </div>
  );
}
