"use client";

import { type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { MattressVisual } from "@/components/sections/mattress-visual";

type HeroProps = {
  atmosphereOpacity: MotionValue<number>;
  textOpacity: MotionValue<number>;
  textPointerEvents: MotionValue<string>;
  mattressOpacity: MotionValue<number>;
  mattressX: MotionValue<string>;
  mattressY: MotionValue<string>;
  mattressScale: MotionValue<number>;
  settleRotate: MotionValue<number>;
  settleY: MotionValue<number>;
};

/**
 * Scene 02/03 — the product world. Everything here arrives in its own time,
 * driven by CinematicHero's scroll progress: the mattress emerges first (at
 * the bed's own screen position, drifting to centered), the black studio
 * atmosphere settles in behind it, and the headline/CTAs arrive last, once
 * the object is already in place — never as a single all-at-once cross-fade.
 */
export function Hero({
  atmosphereOpacity,
  textOpacity,
  textPointerEvents,
  mattressOpacity,
  mattressX,
  mattressY,
  mattressScale,
  settleRotate,
  settleY,
}: HeroProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });

  const tiltX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const lightX = useTransform(springX, [-0.5, 0.5], [35, 65]);
  const lightY = useTransform(springY, [-0.5, 0.5], [30, 60]);

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="bg-grain relative flex h-full w-full flex-col overflow-hidden"
    >
      {/* Atmosphere — never flat black: layered soft gradients, arrives once the room has gone dark */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: atmosphereOpacity }}
        className="pointer-events-none absolute inset-0 bg-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_-8%,var(--color-anthracite-800),transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_84%_6%,var(--color-anthracite-900),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[radial-gradient(ellipse_85%_70%_at_50%_100%,rgba(138,82,48,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--color-black-900)_92%)] opacity-70" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, pointerEvents: textPointerEvents }}
        className="relative z-10 flex w-full flex-col items-center px-6 pt-32 text-center sm:pt-36 lg:pt-40"
      >
        <Logo markClassName="h-4 w-4 sm:h-5 sm:w-5" wordmarkClassName="text-base sm:text-lg" />

        <div className="mt-9 flex items-center gap-3 text-copper-300/90 sm:mt-11">
          <span className="h-px w-8 bg-copper-400/50" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-copper-400/50" />
        </div>

        <h1 className="mt-8 max-w-4xl text-[clamp(2rem,5.6vw,4.75rem)] font-light leading-[1.06] tracking-[-0.01em] text-white sm:mt-10">
          Not just a mattress.
          <br />
          A new standard of{" "}
          <span className="font-display italic font-normal text-copper-200">sleep.</span>
        </h1>

        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:mt-12 sm:w-auto sm:flex-row sm:justify-center sm:gap-5">
          <Button href="/one" size="lg" icon className="w-full sm:w-auto">
            Discover VEXA
          </Button>
          <Button
            href="/signature"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Explore ONE &amp; SIGNATURE
          </Button>
        </div>
      </motion.div>

      <div className="relative z-10 mt-8 flex flex-1 items-end justify-center pb-[6vh] sm:mt-10">
        <MattressVisual
          tiltX={tiltX}
          tiltY={tiltY}
          lightX={lightX}
          lightY={lightY}
          settleRotate={settleRotate}
          settleY={settleY}
          entranceOpacity={mattressOpacity}
          entranceX={mattressX}
          entranceY={mattressY}
          entranceScale={mattressScale}
        />
      </div>

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 sm:bottom-10"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-anthracite-300">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-full bg-copper-300"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
