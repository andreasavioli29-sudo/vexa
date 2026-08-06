"use client";

import Image from "next/image";
import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

type MattressVisualProps = {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
  /** Extra, near-imperceptible rotation tied to real scroll position (Scene 04). */
  settleRotate: MotionValue<number>;
  /** Extra, near-imperceptible vertical drift tied to real scroll position. */
  settleY: MotionValue<number>;
  /** Entrance — emerges at the bed's own screen position, then drifts to centered. */
  entranceOpacity: MotionValue<number>;
  entranceX: MotionValue<string>;
  entranceY: MotionValue<string>;
  entranceScale: MotionValue<number>;
};

/**
 * The official VEXA ONE product photograph — animated, not redrawn. The
 * camera angle, rotation, proportions, and lighting are already baked into
 * this image; every motion layer here (entrance, mouse-tilt, float,
 * Scene 04 settle) moves the photo itself rather than reconstructing it.
 */
export function MattressVisual({
  tiltX,
  tiltY,
  lightX,
  lightY,
  settleRotate,
  settleY,
  entranceOpacity,
  entranceX,
  entranceY,
  entranceScale,
}: MattressVisualProps) {
  const sheen = useMotionTemplate`radial-gradient(620px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.1), transparent 60%)`;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none relative flex w-full items-center justify-center"
      style={{
        perspective: "2600px",
        opacity: entranceOpacity,
        x: entranceX,
        y: entranceY,
        scale: entranceScale,
      }}
    >
      {/* ambient copper atmosphere behind the object */}
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(193,122,78,0.16),transparent)] blur-[90px]" />
      <div className="absolute left-1/2 top-1/2 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-[70px]" />

      {/* scroll-linked settle drift — very subtle, almost imperceptible (Scene 04) */}
      <motion.div
        className="relative"
        style={{
          width: "clamp(320px, 62vw, 900px)",
          aspectRatio: "1536 / 1024",
          rotate: settleRotate,
          y: settleY,
        }}
      >
        {/* slow continuous float — the photo's own baked-in camera angle needs no extra base rotation */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ y: [0, -14, 0], rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* mouse-reactive tilt (the "lighting" layer) */}
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }}
          >
            {/*
              The source photo is a full studio shot (its own walls/floor),
              not an isolated cutout. Rather than edit the image itself, this
              mask feathers just its top edge so that background blends into
              the page's own atmosphere instead of showing a hard rectangle —
              the mattress itself sits lower in the frame and is untouched.
            */}
            <div
              className="relative h-full w-full"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
              }}
            >
              <Image
                src="/images/vexa-one-hero.png"
                alt="VEXA ONE — the official product"
                fill
                priority
                sizes="(min-width: 1024px) 62vw, 90vw"
                className="select-none object-contain"
                draggable={false}
              />
            </div>
            {/* subtle mouse-reactive sheen over the photo */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: sheen, mixBlendMode: "overlay" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* grounding contact shadow — sells the "floating" illusion */}
      <motion.div
        className="absolute left-1/2 top-[78%] h-8 w-[50%] -translate-x-1/2 rounded-full bg-black/70 blur-2xl"
        animate={{ scaleX: [1, 0.9, 1], opacity: [0.5, 0.35, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* volumetric fog */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05),transparent_70%)] blur-3xl" />
    </motion.div>
  );
}
