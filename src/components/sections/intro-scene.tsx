"use client";

import Image from "next/image";
import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

type IntroSceneProps = {
  opacity: MotionValue<number>;
  photoScale: MotionValue<number>;
  blur: MotionValue<number>;
};

/**
 * Scene 01 — the client's approved photograph, full-bleed and untouched.
 * Its typography and navigation are already composed into the image itself,
 * so this component adds no competing text layer (that would double up
 * against the baked-in composition) — only a single slow reveal on load,
 * then a scroll-driven Ken Burns push toward the bed as the room dissolves
 * to black, handing off to the floating product mattress in Scene 02.
 */
export function IntroScene({ opacity, photoScale, blur }: IntroSceneProps) {
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: photoScale, filter, transformOrigin: "72% 66%" }}
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
    </motion.div>
  );
}
