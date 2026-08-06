"use client";

import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

type MattressVisualProps = {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
};

/**
 * A cinematic, product-photography-style rendering of the VEXA mattress —
 * built entirely from layered CSS (no imagery yet exists). Reads as a
 * corner/cross-section: quilted fabric top, satin-copper piping at the
 * seam, and a darker echo layer behind implying the gusset's thickness.
 */
export function MattressVisual({ tiltX, tiltY, lightX, lightY }: MattressVisualProps) {
  const sheen = useMotionTemplate`radial-gradient(560px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.14), transparent 60%)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative flex w-full items-center justify-center"
      style={{ perspective: "2400px" }}
    >
      {/* ambient copper atmosphere behind the object */}
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(193,122,78,0.16),transparent)] blur-[90px]" />
      <div className="absolute left-1/2 top-1/2 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-[70px]" />

      {/* slow continuous float + gentle base rotation (12-15deg) */}
      <motion.div
        className="relative"
        style={{ width: "clamp(300px, 58vw, 760px)", aspectRatio: "16 / 10" }}
        animate={{ y: [0, -16, 0], rotate: [-13, -11.5, -13] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* mouse-reactive tilt (the "lighting" layer) */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }}
        >
          {/* depth echo — the gusset thickness, peeking out to sell the object's height */}
          <div className="absolute inset-0 translate-x-6 translate-y-8 rounded-[2.75rem] bg-[linear-gradient(160deg,#3d3d42,#151517_75%)] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.75)]" />

          {/* satin copper piping shell */}
          <div className="absolute inset-0 rounded-[2.75rem] bg-[linear-gradient(135deg,#e6bd9d,#c17a4e_45%,#8a5230_100%)] shadow-[0_70px_140px_-45px_rgba(0,0,0,0.8)]">
            {/* quilted fabric top face, inset to reveal the piping ring */}
            <div className="absolute inset-[7px] overflow-hidden rounded-[2.35rem] bg-[linear-gradient(160deg,#2b2b2f_0%,#131315_55%,#0a0a0b_100%)]">
              <div className="mattress-quilt absolute inset-0 opacity-40" />
              <div className="mattress-weave absolute inset-0 opacity-[0.14]" />
              <motion.div className="absolute inset-0" style={{ backgroundImage: sheen }} />
              <div className="absolute inset-0 rounded-[2.35rem] shadow-[inset_0_0_90px_45px_rgba(0,0,0,0.5)]" />
              <div className="absolute inset-4 rounded-[1.9rem] border border-dashed border-white/[0.08]" />
            </div>
          </div>
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
    </div>
  );
}
