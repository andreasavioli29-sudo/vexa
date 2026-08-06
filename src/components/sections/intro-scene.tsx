"use client";

import Image from "next/image";
import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

import { Logo } from "@/components/logo";

const EASE = [0.16, 1, 0.3, 1] as const;

type IntroSceneProps = {
  opacity: MotionValue<number>;
  photoScale: MotionValue<number>;
  blur: MotionValue<number>;
};

/**
 * Scene 01 — the real photograph, full-bleed. No illustration, no
 * reinterpretation: this is the client's own architectural photography.
 * On scroll the camera pushes in toward the bed (Ken Burns, transform-origin
 * pinned to the bed's actual position in the frame) while the room dissolves
 * to black, handing off to the floating product mattress in Scene 02.
 */
export function IntroScene({ opacity, photoScale, blur }: IntroSceneProps) {
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ scale: photoScale, filter, transformOrigin: "78% 66%" }}
        className="absolute inset-0"
      >
        <Image
          src="/hero-villa.jpg"
          alt="Contemporary villa bedroom with floor-to-ceiling glass overlooking a mountain sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Top vignette — keeps the navbar and headline legible over the bright sky */}
      <div className="absolute inset-x-0 top-0 h-[46vh] bg-[linear-gradient(to_bottom,rgba(5,5,5,0.62),rgba(5,5,5,0.12)_65%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(to_top,rgba(5,5,5,0.4),transparent)]" />

      {/* Almost no interface: logo, kicker, headline — fading in slowly, in sequence */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-start px-6 pt-[15vh] text-center sm:pt-[16vh]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
        >
          <Logo
            markClassName="h-4 w-4 sm:h-5 sm:w-5"
            wordmarkClassName="text-base text-white sm:text-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.6 }}
          className="mt-7 flex items-center gap-3 text-copper-200/90"
        >
          <span className="h-px w-8 bg-copper-300/50" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.42em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-copper-300/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 2.6 }}
          className="mt-7 max-w-2xl text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.01em] text-white"
        >
          Every great day begins the{" "}
          <span className="font-display italic font-normal text-copper-200">
            night before.
          </span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 sm:bottom-10"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/60">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-full bg-copper-300"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </motion.div>
  );
}
