"use client";

import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { MattressVisual } from "@/components/sections/mattress-visual";

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const lineReveal = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });

  const tiltX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const lightX = useTransform(springX, [-0.5, 0.5], [35, 65]);
  const lightY = useTransform(springY, [-0.5, 0.5], [30, 60]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mattressY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const mattressOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.35]);

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
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="bg-grain relative flex min-h-[112svh] w-full flex-col overflow-hidden bg-black lg:min-h-[124svh]"
    >
      {/* Atmosphere — never flat black: layered soft gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_-8%,var(--color-anthracite-800),transparent)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_84%_6%,var(--color-anthracite-900),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[radial-gradient(ellipse_85%_70%_at_50%_100%,rgba(138,82,48,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--color-black-900)_92%)] opacity-70" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col items-center px-6 pt-40 text-center sm:pt-48 lg:pt-52"
      >
        <motion.div variants={fadeUp}>
          <Logo
            markClassName="h-4 w-4 sm:h-5 sm:w-5"
            wordmarkClassName="text-base sm:text-lg"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex items-center gap-3 text-copper-300/90 sm:mt-11"
        >
          <span className="h-px w-8 bg-copper-400/50" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-copper-400/50" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-8 max-w-4xl text-[clamp(2.4rem,6.8vw,5.75rem)] font-light leading-[1.04] tracking-[-0.01em] text-white sm:mt-10"
        >
          <span className="block overflow-hidden">
            <motion.span variants={lineReveal} className="block">
              Not just a mattress.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span variants={lineReveal} className="block">
              A new standard of{" "}
              <span className="font-display italic font-normal text-copper-200">
                sleep.
              </span>
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="mt-11 flex w-full flex-col items-center gap-4 sm:mt-14 sm:w-auto sm:flex-row sm:justify-center sm:gap-5"
        >
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
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: mattressY, opacity: mattressOpacity }}
        className="relative z-10 mt-16 flex flex-1 items-end justify-center pb-[8vh] sm:mt-20"
      >
        <MattressVisual tiltX={tiltX} tiltY={tiltY} lightX={lightX} lightY={lightY} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 sm:bottom-10"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-anthracite-300">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-full bg-copper-300"
            animate={{ y: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </span>
      </motion.div>
    </section>
  );
}
