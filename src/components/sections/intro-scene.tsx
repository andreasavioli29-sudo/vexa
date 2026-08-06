"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

type IntroSceneProps = {
  photoScale: MotionValue<number>;
  vignetteHole: MotionValue<number>;
};

/**
 * Scene 01 — the client's approved photograph, full-bleed and untouched.
 * No blur, no cross-dissolve: the camera continuously dollies in (scale)
 * while a vignette closes in around the bed's screen position, so the room
 * reads as darkening around a fixed point rather than a scene cut. That
 * same point is where the floating mattress (Scene 02) takes over.
 */
export function IntroScene({ photoScale, vignetteHole }: IntroSceneProps) {
  const vignetteOuter = useTransform(vignetteHole, (h) => h + 20);
  const vignette = useMotionTemplate`radial-gradient(circle at 72% 66%, transparent 0%, transparent ${vignetteHole}%, rgba(3,3,3,0.99) ${vignetteOuter}%)`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: photoScale, transformOrigin: "72% 66%" }}
        className="absolute inset-0"
      >
        <Image
          src="/hero-villa.jpg"
          alt="VEXA — contemporary villa bedroom with floor-to-ceiling glass overlooking a mountain sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* The room darkens as a closing iris around the bed — never a blur, never a cut */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: vignette }}
      />
    </div>
  );
}
