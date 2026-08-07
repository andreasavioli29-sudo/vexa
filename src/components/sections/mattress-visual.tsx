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
  /** Radius, in px, of the discovery window — a small, moving flashlight during the fragment sequence, thrown wide open for the full reveal. */
  revealAperture: MotionValue<number>;
  /** Focus pull, in px of blur — soft for the earliest, most abstract fragments, sharpening as each gets more legible. */
  revealBlur: MotionValue<number>;
  /** transform-origin X (%) — which point on the object's own surface is currently being investigated; also the discovery window's own center. */
  detailOriginX: MotionValue<number>;
  /** transform-origin Y (%), paired with detailOriginX. */
  detailOriginY: MotionValue<number>;
};

/**
 * The official VEXA ONE product photograph — animated, not redrawn. It
 * never simply fades or focuses into view as a single object: a small
 * discovery window, no bigger than a fragment, moves from point to point
 * across the object's own surface — shape, then edge, then stitching,
 * then material, then proportions — each held for a real beat, each more
 * magnified and more abstract the earlier it comes, before the window
 * finally blows open onto the whole, composed product. `detailOriginX`/
 * `detailOriginY` are doing two jobs at once, deliberately: they're both
 * the discovery window's own center (`revealMask` below) and the point
 * `scale` expands from (this element's own `transformOrigin`) — the same
 * fixed point on the object, magnified, is what the camera is looking at
 * and what the window is centered on. That's what makes a fragment read
 * as "this specific detail, isolated" rather than "the same crop, resized."
 *
 * A fixed, low-angle key light stays under all of it throughout, so
 * whatever's inside the window — trim, stitching, fabric — reads as real
 * material and volume rather than a flat photograph, exactly the way a
 * single softbox would sculpt it on a real set.
 *
 * The reveal isn't the end of this component's story either. Once settled
 * at rest, `scale` keeps going — pushing in once more toward the object's
 * nameplate, holding, then pulling back to the full product — with the
 * same `detailOriginX`/`detailOriginY` mechanism doing the reframing.
 * `posLeft`/`posTop`/`rotate` never move again once the reveal settles:
 * every later beat is the camera choosing where to look, not the object
 * performing for the camera.
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
  detailOriginX,
  detailOriginY,
}: MattressVisualProps) {
  const markLoaded = useMarkHeroAssetLoaded();
  const reduceMotion = useReducedMotion();
  const sheen = useMotionTemplate`radial-gradient(620px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.1), transparent 60%)`;
  const detailOrigin = useMotionTemplate`${detailOriginX}% ${detailOriginY}%`;
  // A proportional (not fixed) falloff, same technique as the villa iris —
  // real px throughout, since bare "%" stops on an off-center circle
  // resolve against the *farthest corner*, not the window's own intended
  // size, and every fragment here is deliberately off-center.
  const revealApertureOuter = useTransform(revealAperture, (r) => r * 1.6);
  const revealMask = useMotionTemplate`radial-gradient(circle at ${detailOriginX}% ${detailOriginY}%, white 0px, white ${revealAperture}px, transparent ${revealApertureOuter}px)`;
  const revealFilter = useMotionTemplate`blur(${revealBlur}px)`;

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
              The discovery window itself: small, soft-edged, centered on
              whichever fragment is currently in play, paired with a focus
              pull that's soft for the most abstract fragments and sharp
              once material is meant to be legible. This is what uncovers
              the mattress — never opacity, never a rectangle appearing —
              so each fragment reads as the camera finding a specific,
              already-there detail, not an image swapping in.
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
