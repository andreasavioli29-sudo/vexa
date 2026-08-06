"use client";

import Image from "next/image";
import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

type MattressVisualProps = {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
  /** Fades in exactly as the bed frame/pillows/duvet vanish into the blackout. */
  opacity: MotionValue<number>;
  /** Screen-space anchor, in percent of the scene — the bed's own position, then centered. */
  posLeft: MotionValue<string>;
  posTop: MotionValue<string>;
  /** 0 while still resting on the bed, ramps to ~12deg once it lifts and turns. */
  rotate: MotionValue<number>;
  /** Matches the bed's apparent size in the dollied-in photo, then grows to full presentation size. */
  scale: MotionValue<number>;
  /** Ambient studio dressing (glow, contact shadow, fog) — only once it's actually floating. */
  studioOpacity: MotionValue<number>;
};

/**
 * The official VEXA ONE product photograph — animated, not redrawn. It is
 * anchored at the exact screen position of the bed in Scene 01 (same
 * left/top the IntroScene vignette closes around), fades in the instant the
 * frame/pillows/duvet disappear into the blackout, then lifts, rotates, and
 * drifts to centered as one continuous scroll-driven move — never a second,
 * separate "product hero" cut.
 */
export function MattressVisual({
  tiltX,
  tiltY,
  lightX,
  lightY,
  opacity,
  posLeft,
  posTop,
  rotate,
  scale,
  studioOpacity,
}: MattressVisualProps) {
  const sheen = useMotionTemplate`radial-gradient(620px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.1), transparent 60%)`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute"
        style={{
          left: posLeft,
          top: posTop,
          x: "-50%",
          y: "-50%",
          rotate,
          scale,
          opacity,
          perspective: "2600px",
          // Keeps the photo's true 1536:1024 aspect ratio (never cropped),
          // sized so the floating final state comfortably clears the
          // headline/buttons above it rather than fighting them for space.
          // The `scale` motion value shrinks this whole box down to
          // bed-size while it's still anchored on the mattress in the photo.
          width: "min(55vw, 620px, calc(36svh * 1.5))",
          aspectRatio: "1536 / 1024",
        }}
      >
        {/* ambient copper atmosphere behind the object — studio dressing only */}
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(193,122,78,0.16),transparent)] blur-[90px]"
        />
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute left-1/2 top-1/2 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-[70px]"
        />

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
              whatever sits behind it — the villa photo early on, the black
              studio atmosphere later — without showing a hard rectangle.
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
                sizes="(min-width: 1024px) 55vw, 90vw"
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

        {/* grounding contact shadow — sells the "floating" illusion, studio dressing only */}
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute left-1/2 top-[78%] h-8 w-[50%] -translate-x-1/2 rounded-full bg-black/70 blur-2xl"
        />

        {/* volumetric fog — studio dressing only */}
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05),transparent_70%)] blur-3xl"
        />
      </motion.div>
    </div>
  );
}
