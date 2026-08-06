"use client";

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
 * The official VEXA ONE — a thick, true two-face slab (top + front/gusset),
 * built entirely from layered CSS to match the brand's product design
 * board: vertical channel quilting continuous across both faces, satin
 * copper piping at their shared seam, and an embroidered copper wordmark
 * on the front face.
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
  const sheen = useMotionTemplate`radial-gradient(560px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.12), transparent 60%)`;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none relative flex w-full items-center justify-center"
      style={{
        perspective: "2400px",
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
        style={{ width: "clamp(270px, 62vw, 860px)", aspectRatio: "100 / 62", rotate: settleRotate, y: settleY }}
      >
        {/* slow continuous float + gentle base rotation (~12deg) */}
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -16, 0], rotate: [-12.5, -11.5, -12.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* mouse-reactive tilt (the "lighting" layer) */}
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }}
          >
            {/* depth echo — a third side peeking out to sell the object's thickness */}
            <div className="absolute inset-0 translate-x-5 translate-y-6 rounded-t-[1.7rem] rounded-b-[1.3rem] bg-[linear-gradient(160deg,#38383d,#131315_75%)] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75)]" />

            {/* the slab itself: top face + front/gusset face, sharing one piped seam */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-t-[1.75rem] rounded-b-[1.35rem] shadow-[0_70px_140px_-45px_rgba(0,0,0,0.85)]">
              {/* top face */}
              <div className="relative h-[72%] w-full overflow-hidden bg-[linear-gradient(160deg,#2f2f33_0%,#17171a_55%,#0a0a0b_100%)]">
                <div className="mattress-channels absolute inset-0 opacity-[0.55]" />
                <div className="mattress-knit absolute inset-0 opacity-[0.12]" />
                <motion.div className="absolute inset-0" style={{ backgroundImage: sheen }} />
                <div className="absolute inset-0 shadow-[inset_0_0_90px_40px_rgba(0,0,0,0.45)]" />
                <div className="absolute inset-3 rounded-t-[1.4rem] border border-white/[0.06]" />
              </div>

              {/* satin copper piping — exactly at the seam between the two faces */}
              <div className="relative z-10 h-[4px] w-full bg-[linear-gradient(90deg,#e6bd9d,#c17a4e_50%,#8a5230_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]" />

              {/* front / gusset face — same channel quilting continues over the edge */}
              <div className="relative h-[28%] w-full overflow-hidden bg-[linear-gradient(100deg,#232326_0%,#111113_55%,#0a0a0b_100%)]">
                <div className="mattress-channels absolute inset-0 opacity-[0.5]" />
                <div className="absolute inset-0 shadow-[inset_0_10px_24px_-10px_rgba(0,0,0,0.6)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-sans text-[clamp(0.55rem,1vw,0.85rem)] font-medium uppercase tracking-[0.4em] text-copper-300/80">
                    Vexa
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* grounding contact shadow — sells the "floating" illusion */}
      <motion.div
        className="absolute left-1/2 top-[80%] h-8 w-[54%] -translate-x-1/2 rounded-full bg-black/70 blur-2xl"
        animate={{ scaleX: [1, 0.9, 1], opacity: [0.5, 0.35, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* volumetric fog */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05),transparent_70%)] blur-3xl" />
    </motion.div>
  );
}
