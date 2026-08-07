"use client";

import { motion, type MotionValue } from "framer-motion";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type HeroProps = {
  logoOpacity: MotionValue<number>;
  logoY: MotionValue<number>;
  textOpacity: MotionValue<number>;
  textPointerEvents: MotionValue<string>;
};

/**
 * The headline/CTAs — the last layer to arrive in CinematicHero's single
 * continuous shot, once the mattress has already lifted, rotated, and
 * settled centered. Text overlay only; the black studio atmosphere and the
 * mattress itself both live directly in CinematicHero, painted in the
 * correct order behind this, never a separate section of their own. The
 * logo arrives fractionally ahead of the kicker/headline/CTAs, so it reads
 * as its own reveal rather than fading in alongside everything else.
 */
export function Hero({ logoOpacity, logoY, textOpacity, textPointerEvents }: HeroProps) {
  return (
    <section id="top" className="pointer-events-none relative h-full w-full">
      <div className="relative z-10 flex w-full flex-col items-center px-6 pt-32 text-center sm:pt-36 lg:pt-40">
        <motion.div style={{ opacity: logoOpacity, y: logoY }}>
          <Logo markClassName="h-4 w-4 sm:h-5 sm:w-5" wordmarkClassName="text-base sm:text-lg" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, pointerEvents: textPointerEvents }}
          className="flex w-full flex-col items-center"
        >
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
            <Button href="/one" size="lg" icon className="pointer-events-auto w-full sm:w-auto">
              Discover VEXA
            </Button>
            <Button
              href="/signature"
              variant="outline"
              size="lg"
              className="pointer-events-auto w-full sm:w-auto"
            >
              Explore ONE &amp; SIGNATURE
            </Button>
          </div>
        </motion.div>
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
