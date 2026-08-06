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

const COPPER_H = "linear-gradient(90deg,#e6bd9d,#c17a4e 50%,#8a5230 100%)";
const COPPER_V = "linear-gradient(180deg,#e6bd9d,#c17a4e 50%,#8a5230 100%)";

function VMonogram() {
  return (
    <svg viewBox="0 0 32 26" className="h-[26%] w-auto" aria-hidden="true">
      <path
        d="M4 2 L16 22 L28 2"
        fill="none"
        stroke="#c9895c"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="25" r="0.9" fill="#c9895c" />
    </svg>
  );
}

function VexaTag() {
  return (
    <div className="rounded-[3px] bg-black/55 px-[10%] py-[6%] ring-1 ring-white/10">
      <span className="text-[clamp(0.42rem,0.85vw,0.7rem)] font-medium uppercase tracking-[0.4em] text-anthracite-100/90">
        Vexa
      </span>
    </div>
  );
}

/**
 * The official VEXA ONE — a true CSS 3D box (not a flat rotated card):
 * three real faces (top, front/long-side, right/short-end) meeting at
 * genuine perspective-correct edges, built to match the brand's approved
 * product photography exactly. Copper piping traces both top seams;
 * channel quilting runs the length of the mattress on top and wraps
 * vertically down the visible sides.
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
  const sheen = useMotionTemplate`radial-gradient(560px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.13), transparent 60%)`;

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
          ["--u" as string]: "clamp(3.1px, 0.58vw, 8.2px)",
          width: "calc(var(--u) * 100)",
          height: "calc(var(--u) * 86)",
          y: settleY,
        }}
      >
        {/* slow continuous float */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* camera framing: 3/4 perspective + ~12deg roll, matching the reference shot */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", rotate: settleRotate }}
          >
            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(-18deg) rotateY(-25deg) rotateZ(-12deg)",
              }}
            >
              {/* mouse-reactive tilt (the "lighting" layer) */}
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }}
              >
                {/* TOP face — W x D */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "calc(var(--u) * 100)",
                    height: "calc(var(--u) * 56)",
                    transform: "translate(-50%, -50%) rotateX(90deg) translateZ(calc(var(--u) * 7.5))",
                    background: "linear-gradient(135deg, #303034 0%, #17171a 55%, #0a0a0b 100%)",
                  }}
                >
                  <div className="mattress-channels-top absolute inset-0 opacity-[0.5]" />
                  <motion.div className="absolute inset-0" style={{ backgroundImage: sheen }} />
                  <div className="absolute inset-0 shadow-[inset_0_0_70px_30px_rgba(0,0,0,0.4)]" />
                  {/* piping — top/front seam (nudged forward in Z to avoid z-fighting with the front face) */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-[5px] shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                    style={{ backgroundImage: COPPER_H, transform: "translateZ(2px)" }}
                  />
                  {/* piping — top/right seam */}
                  <div
                    className="absolute inset-y-0 right-0 w-[5px] shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                    style={{ backgroundImage: COPPER_V, transform: "translateZ(2px)" }}
                  />
                </div>

                {/* FRONT face (long side) — W x T */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "calc(var(--u) * 100)",
                    height: "calc(var(--u) * 15)",
                    transform: "translate(-50%, -50%) translateZ(calc(var(--u) * 28))",
                    background: "linear-gradient(180deg, #27272b 0%, #101012 100%)",
                  }}
                >
                  <div className="mattress-channels absolute inset-0 opacity-[0.55]" />
                  <div className="absolute inset-0 shadow-[inset_0_10px_22px_-10px_rgba(0,0,0,0.6)]" />
                  <div className="absolute inset-0 flex items-center justify-between px-[9%]">
                    <VMonogram />
                    <VexaTag />
                  </div>
                </div>

                {/* RIGHT / END face — D x T */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "calc(var(--u) * 56)",
                    height: "calc(var(--u) * 15)",
                    transform: "translate(-50%, -50%) rotateY(90deg) translateZ(calc(var(--u) * 50))",
                    background: "linear-gradient(180deg, #202024 0%, #0c0c0d 100%)",
                  }}
                >
                  <div className="mattress-channels absolute inset-0 opacity-[0.5]" />
                  <div className="absolute inset-0 shadow-[inset_0_10px_22px_-10px_rgba(0,0,0,0.6)]" />
                </div>
              </motion.div>
            </div>
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
