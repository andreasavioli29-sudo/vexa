"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";

import { useMarkHeroAssetLoaded } from "@/components/providers/hero-assets-provider";
import { HERO_VILLA_IMAGE } from "@/lib/hero-assets";
import { EASE_REVEAL } from "@/lib/motion";

type IntroSceneProps = {
  photoScale: MotionValue<number>;
  vignetteHole: MotionValue<number>;
  villaDim: MotionValue<number>;
  villaSaturate: MotionValue<number>;
  villaVignette: MotionValue<number>;
  villaContrast: MotionValue<number>;
};

/**
 * Scene 01 — the client's approved photograph, full-bleed and untouched.
 * The room never gets covered by a shape: an iris mask on the photo itself
 * narrows its own visible area (revealing the studio backdrop already
 * sitting behind it, in real z-order — occlusion, not an overlay), while
 * the photo's own brightness/saturation fall, like the room's light
 * actually fading. No blur, no cross-dissolve, no opacity layer standing in
 * for either — the camera continuously dollies in (scale) while its own
 * exposure changes, and the same point it's closing in on is exactly where
 * the floating mattress (Scene 02) picks up.
 *
 * A second, independent light layer — the vignette — builds hierarchy
 * inside that same photo well before `villaDim` actually darkens the room:
 * a soft falloff anchored on the bed, letting its edges recede while the
 * bed itself stays comparatively lit, so the eye is drawn there naturally
 * rather than by brightness dropping everywhere at once.
 */
export function IntroScene({
  photoScale,
  vignetteHole,
  villaDim,
  villaSaturate,
  villaVignette,
  villaContrast,
}: IntroSceneProps) {
  const markLoaded = useMarkHeroAssetLoaded();
  // A proportional (not fixed) falloff — 40% wider than the hole itself —
  // so the edge stays a soft, consistent fraction of the aperture at every
  // size, from wide-open to nearly shut.
  const maskOuter = useTransform(vignetteHole, (h) => h * 1.4);
  const irisMask = useMotionTemplate`radial-gradient(circle at 72% 66%, white 0px, white ${vignetteHole}px, transparent ${maskOuter}px)`;
  const exposure = useMotionTemplate`brightness(${villaDim}) saturate(${villaSaturate}) contrast(${villaContrast})`;
  // A wide, feathered falloff — deliberately much softer-edged than the
  // iris above, which is a hard aperture closing later in the sequence.
  // This one is just light receding toward the frame's edges, anchored on
  // the same point the camera is already closing in on.
  const vignetteGradient = useMotionTemplate`radial-gradient(ellipse 78% 70% at 72% 66%, transparent 30%, rgba(0,0,0,${villaVignette}) 100%)`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/*
        The iris lives on this outer wrapper, independent of the photo's own
        dolly-in scale below — exactly as a real aperture closing would be
        independent of the lens simultaneously zooming. Whatever this mask
        cuts away reveals the studio backdrop already painted behind it.
      */}
      <motion.div
        aria-hidden="false"
        className="absolute inset-0"
        style={{ maskImage: irisMask, WebkitMaskImage: irisMask }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE_REVEAL }}
          style={{ scale: photoScale, transformOrigin: "72% 66%", filter: exposure }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_VILLA_IMAGE}
            alt="VEXA — contemporary villa bedroom with floor-to-ceiling glass overlooking a mountain sunrise"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onLoad={() => markLoaded(HERO_VILLA_IMAGE)}
            onError={() => markLoaded(HERO_VILLA_IMAGE)}
          />
          {/*
            Inside the same scaled wrapper as the photo, so the falloff
            dollies in with it rather than sitting on top as a fixed shape —
            a real lens's vignette tightens as it zooms, it doesn't stay put.
          */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundImage: vignetteGradient }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
