"use client";

import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type IntroSceneProps = {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  blur: MotionValue<number>;
  bedRotate: MotionValue<number>;
  bedLift: MotionValue<number>;
  bedOpacity: MotionValue<number>;
};

/**
 * Scene 01 — a contemporary alpine villa at sunrise, built entirely from
 * layered CSS/SVG (no photography or 3D assets exist yet). Kept abstract
 * and evocative rather than literal: gradient sky, receding mountain
 * silhouettes, drifting mist, a quiet resting bed. The bed is the same
 * object that detaches and becomes the floating hero mattress in Scene 02.
 */
export function IntroScene({
  opacity,
  scale,
  blur,
  bedRotate,
  bedLift,
  bedOpacity,
}: IntroSceneProps) {
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      style={{ opacity, scale, filter }}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Sunrise sky */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#e8a66b_0%,#e9c79a_22%,#d9d3c9_45%,#aab8c2_72%,#8d9aa6_100%)]" />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 3.5, ease: EASE }}
        className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(255,214,153,0.55),transparent_75%)]"
      />

      {/* Mountains — three receding silhouette layers */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] opacity-60 blur-[3px]"
        style={{
          background: "linear-gradient(180deg, transparent, #b9c3ca 60%)",
          clipPath:
            "polygon(0% 100%,0% 58%,8% 42%,15% 60%,24% 32%,33% 54%,42% 22%,50% 50%,60% 36%,68% 56%,78% 27%,88% 52%,100% 40%,100% 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[32%] opacity-80 blur-[1.5px]"
        style={{
          background: "linear-gradient(180deg, #cdb497, #8f7c68 65%)",
          clipPath:
            "polygon(0% 100%,0% 70%,10% 52%,20% 67%,30% 44%,40% 64%,52% 40%,62% 62%,72% 47%,84% 64%,92% 50%,100% 62%,100% 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[24%]"
        style={{
          background: "linear-gradient(180deg, #4a4038, #221d19 70%)",
          clipPath:
            "polygon(0% 100%,0% 82%,12% 70%,22% 80%,34% 62%,46% 78%,58% 64%,70% 82%,82% 67%,92% 80%,100% 72%,100% 100%)",
        }}
      />

      {/* Drifting mist */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[-10%] bottom-[14%] h-24 bg-white/[0.10] blur-2xl"
        animate={{ x: ["-3%", "3%", "-3%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[-10%] bottom-[8%] h-16 bg-white/[0.08] blur-3xl"
        animate={{ x: ["4%", "-4%", "4%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top vignette — keeps the navbar legible against a bright sky */}
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.55),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(to_top,rgba(5,5,5,0.4),transparent)]" />

      {/* The bed — resting, quiet, warm-lit. Not yet the protagonist. */}
      <motion.div
        aria-hidden="true"
        style={{ rotate: bedRotate, y: bedLift, opacity: bedOpacity }}
        className="absolute bottom-[17%] left-1/2 w-[clamp(220px,34vw,420px)] -translate-x-1/2 aspect-[16/7] rounded-[1.5rem] bg-[linear-gradient(160deg,#e7d3b3,#b99a72_75%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]"
      >
        <div className="mattress-quilt absolute inset-3 rounded-[1.2rem] opacity-30" />
        <div className="absolute inset-0 rounded-[1.5rem] shadow-[inset_0_0_50px_20px_rgba(0,0,0,0.12)]" />
      </motion.div>

      {/* Text */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-6 pt-[16vh] text-center sm:pt-[18vh]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="flex items-center gap-3 text-[#3a2f22]/80"
        >
          <span className="h-px w-8 bg-[#3a2f22]/40" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-[#3a2f22]/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="mt-8 max-w-3xl text-balance text-[clamp(1.9rem,5vw,3.75rem)] font-light leading-[1.12] tracking-[-0.01em] text-[#221b12] sm:mt-10"
        >
          Every great day begins the{" "}
          <span className="font-display italic font-normal">night before.</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 sm:bottom-10"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#3a2f22]/70">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-[#3a2f22]/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-full bg-[#3a2f22]/70"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </motion.div>
  );
}
