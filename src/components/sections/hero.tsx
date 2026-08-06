"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export function Hero() {
  return (
    <section
      id="top"
      className="bg-grain relative flex h-svh min-h-[720px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,var(--color-anthracite-900),transparent)]" />
        <div className="absolute left-1/2 top-[8%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-copper-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--color-black-900)_100%)] opacity-60" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center"
      >
        <motion.div variants={item}>
          <Logo
            markClassName="h-4 w-4 sm:h-5 sm:w-5"
            wordmarkClassName="text-base sm:text-lg"
          />
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex items-center gap-3 text-copper-300/90 sm:mt-12"
        >
          <span className="h-px w-8 bg-copper-400/60" />
          <span className="text-[11px] font-medium uppercase tracking-[0.4em] sm:text-xs">
            The Art of Sleeping
          </span>
          <span className="h-px w-8 bg-copper-400/60" />
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance mt-8 max-w-3xl text-[clamp(2.1rem,6.4vw,5.25rem)] font-light leading-[1.08] tracking-tight text-white sm:mt-10"
        >
          Not just a mattress.
          <br />
          A new standard of{" "}
          <span className="font-display italic font-normal text-copper-200">
            sleep.
          </span>
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-12 flex w-full flex-col items-center gap-4 sm:mt-14 sm:w-auto sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/one">Discover VEXA</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/signature">Explore ONE &amp; SIGNATURE</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 sm:bottom-10"
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
