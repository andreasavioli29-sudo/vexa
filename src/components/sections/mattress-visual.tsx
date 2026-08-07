"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { useMarkHeroAssetLoaded } from "@/components/providers/hero-assets-provider";
import { HERO_MATTRESS_IMAGE } from "@/lib/hero-assets";
import { EASE_BREATH } from "@/lib/motion";

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
  /** Radius (%) of the reveal aperture centered on the object's own material detail. */
  revealAperture: MotionValue<number>;
  /** Focus pull, in px of blur, driving the reveal from soft close-up to fully sharp. */
  revealBlur: MotionValue<number>;
  /** Position (%) of a directional light discovering the object, edge to silhouette. */
  lightSweep: MotionValue<number>;
  /** transform-origin X (%) — where the post-reveal camera pushes expand from, reframing which part of the object they read as "moving toward." */
  detailOriginX: MotionValue<number>;
  /** transform-origin Y (%), paired with detailOriginX. */
  detailOriginY: MotionValue<number>;
};

/**
 * The official VEXA ONE product photograph — animated, not redrawn. It is
 * anchored at the exact screen position of the bed in Scene 01 (same
 * left/top the IntroScene vignette closes around), fades in the instant the
 * frame/pillows/duvet disappear into the blackout, then lifts, rotates, and
 * drifts to centered as one continuous scroll-driven move — never a second,
 * separate "product hero" cut.
 *
 * Focus and aperture (below) govern *when* the object becomes visible;
 * light governs *how* it reads once it is. A directional beam travels
 * across the material in the same beats as the reveal — never illuminating
 * the whole surface at once — while a fixed, low-angle key light stays
 * underneath it throughout, so the quilting and edge trim keep reading as
 * volume rather than a flat photograph, exactly the way a real studio
 * light would sculpt it.
 *
 * The reveal isn't the end of this component's story either. Once at rest,
 * `scale` keeps going — pushing in past presentation size onto a specific
 * point, holding, reframing to another, holding again, then pulling back
 * out — with `detailOriginX`/`detailOriginY` deciding which part of the
 * object each push expands from. `posLeft`/`posTop`/`rotate` never move
 * again once the reveal settles: every later beat is the camera choosing
 * where to look, not the object performing for the camera.
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
  revealAperture,
  revealBlur,
  lightSweep,
  detailOriginX,
  detailOriginY,
}: MattressVisualProps) {
  const markLoaded = useMarkHeroAssetLoaded();
  const reduceMotion = useReducedMotion();
  const sheen = useMotionTemplate`radial-gradient(620px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.1), transparent 60%)`;
  const detailOrigin = useMotionTemplate`${detailOriginX}% ${detailOriginY}%`;
  // Centered on the object's own material detail (the stitching + copper
  // edge trim sit dead-center of this photo) — the aperture that opens
  // during the reveal, not a rectangle appearing.
  const revealApertureOuter = useTransform(revealAperture, (r) => r + 18);
  const revealMask = useMotionTemplate`radial-gradient(circle at 50% 50%, white 0%, white ${revealAperture}%, transparent ${revealApertureOuter}%)`;
  const revealFilter = useMotionTemplate`blur(${revealBlur}px)`;
  // A soft band of light traveling along the object's own diagonal (the
  // photo's near edge runs lower-left to upper-right) — discovering edge,
  // then stitching, then top fabric, then clearing the frame by the
  // climax, rather than a wash appearing over the whole surface at once.
  const sweepPosition = useMotionTemplate`${lightSweep}% 50%`;

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
          transformOrigin: detailOrigin,
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
        {/*
          Ambient copper atmosphere behind the object — studio dressing
          only. Scroll controls whether it's visible at all (outer); one
          extremely slow opacity breathe on just the primary glow makes the
          light feel alive rather than a static prop, without ever reading
          as "an animation" — frozen for reduced motion. The smaller white
          highlight stays static: one breathing light reads as considered,
          two independently-phased ones would start to read as an effect.
        */}
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          <motion.div
            className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(193,122,78,0.16),transparent)] blur-[90px]"
            animate={reduceMotion ? undefined : { opacity: [1, 0.8, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: EASE_BREATH }}
          />
        </motion.div>
        <motion.div
          style={{ opacity: studioOpacity }}
          className="absolute left-1/2 top-1/2 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] blur-[70px]"
        />

        {/*
          Weightless, not spinning: a slow vertical breath plus a barely
          perceptible tilt — never a product-viewer rotation. A second,
          much smaller scale-breathe runs on its own, longer, out-of-phase
          duration so the two never lock into an obviously repeating loop.
          Reduced motion holds the object at rest instead.
        */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -10, 0], rotate: [-0.4, 0.4, -0.4], scale: [1, 1.006, 1] }
          }
          transition={{
            y: { duration: 10, repeat: Infinity, ease: EASE_BREATH },
            rotate: { duration: 10, repeat: Infinity, ease: EASE_BREATH },
            scale: { duration: 17, repeat: Infinity, ease: EASE_BREATH },
          }}
        >
          {/* mouse-reactive tilt (the "lighting" layer) */}
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY }}
          >
            {/*
              The reveal itself: a soft-edged aperture centered on the
              object's own material detail (the stitching + copper trim,
              not empty background — verified against the source photo)
              widens from a tight close-up to the full frame, in step with
              a focus pull from heavy blur to fully sharp. This is what
              uncovers the mattress — never opacity, never a rectangle
              appearing — so it reads as the camera resolving an object
              that was already there, not an image swapping in.
            */}
            <motion.div
              className="relative h-full w-full"
              style={{ maskImage: revealMask, WebkitMaskImage: revealMask, filter: revealFilter }}
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
                  src={HERO_MATTRESS_IMAGE}
                  alt="VEXA ONE — the official product"
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="select-none object-contain"
                  draggable={false}
                  onLoad={() => markLoaded(HERO_MATTRESS_IMAGE)}
                  onError={() => markLoaded(HERO_MATTRESS_IMAGE)}
                />
              </div>
              {/*
                A fixed, low-angle key light — always present once any of
                the object is visible, never animated. Without it the
                quilting and edge trim read as flat under even studio
                lighting; this one soft diagonal gradient is enough to sell
                real volume, the way a single softbox would on set.
              */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(125deg, rgba(255,255,255,0.16) 0%, transparent 45%, rgba(0,0,0,0.22) 100%)",
                  mixBlendMode: "soft-light",
                }}
              />
              {/*
                The directional discovery light: travels once across the
                material as the reveal plays out, then clears the frame by
                the climax — it is what exposes the object part by part, not
                a rectangle appearing or a wash over the whole surface.
              */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 32%, rgba(255,241,224,0.55) 48%, transparent 64%)",
                  backgroundSize: "260% 260%",
                  backgroundPosition: sweepPosition,
                  mixBlendMode: "soft-light",
                }}
              />
              {/* subtle mouse-reactive sheen over the photo */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundImage: sheen, mixBlendMode: "overlay" }}
              />
            </motion.div>
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
