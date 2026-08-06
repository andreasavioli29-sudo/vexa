"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

import { IntroScene } from "@/components/sections/intro-scene";
import { MattressVisual } from "@/components/sections/mattress-visual";
import { Hero } from "@/components/sections/hero";

/**
 * One uninterrupted camera shot, not a sequence of sections:
 *
 *   0%  — a luxury bedroom, static.
 *  20%  — the camera slowly moves toward the bed.
 *  40%  — the bed fills most of the screen.
 *  60%  — the room fades to black; the frame, pillows and duvet vanish;
 *         only the mattress remains, exactly where the bed was.
 *  75%  — the mattress gently lifts.
 *  85%  — it rotates to its ~12deg resting angle.
 * 100%  — floating, centered, in a black premium studio.
 *
 * The mattress is never a separate "product hero" element that fades in
 * elsewhere — it's anchored at the bed's own screen position (the same
 * left/top the IntroScene vignette closes around) from the moment it
 * appears, and only then animates to centered. Everything is driven by one
 * scroll progress value across a single pinned viewport.
 */
export function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    // Numeric (not "start start"/"end end") so this doesn't exactly match
    // Framer's built-in offset presets — an exact match makes it swap to a
    // native CSS ViewTimeline, which is degenerate (frozen) for a target
    // much taller than the viewport, like this pinned scroll-scrub wrapper.
    offset: [
      [0, 0],
      [1, 0.999],
    ],
  });

  // Mouse-reactive tilt/light, shared by the mattress once it's floating.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const lightX = useTransform(springX, [-0.5, 0.5], [35, 65]);
  const lightY = useTransform(springY, [-0.5, 0.5], [30, 60]);

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // 0% -> 40%: the camera dollies in continuously until the bed fills the screen
  const photoScale = useTransform(progress, [0, 0.4], [1, 1.6]);

  // 40% -> 60%: the room darkens as a closing iris around the bed's screen position
  const vignetteHole = useTransform(progress, [0.4, 0.6], [80, 3]);

  // The iris's final cleanup — hides the frame/pillows/duvet for good
  const blackoutOpacity = useTransform(progress, [0.48, 0.6], [0, 1]);
  const atmosphereOpacity = useTransform(progress, [0.5, 0.62], [0, 1]);

  // The mattress fades in exactly as the bed's bedding disappears into the
  // blackout — same screen position (72%, 66%, the IntroScene vignette's own
  // anchor), same small apparent size, no rotation: it reads as "the bed
  // became this" rather than a new object arriving.
  const mattressOpacity = useTransform(progress, [0.52, 0.62], [0, 1]);

  // 60% -> 75%: it holds still, resting in place — "only the mattress remains"
  // 75% -> 100%: it lifts (a small upward shift), then drifts to centered —
  // low enough in the frame that the headline and buttons above always sit
  // clear of it (those buttons are transparent-fill by design, so anything
  // behind them shows through).
  const mattressLeft = useTransform(progress, [0.6, 0.85, 1], ["72%", "72%", "50%"]);
  const mattressTop = useTransform(progress, [0.6, 0.75, 1], ["66%", "59%", "80%"]);

  // 60% -> 85%: stays bed-sized while it lifts and turns; 85% -> 100%: grows
  // to its full presentation size as it settles centered
  const mattressScale = useTransform(progress, [0.6, 0.85, 1], [0.4, 0.4, 1]);

  // 75% -> 85%: rotates to its ~12deg resting angle, then holds
  const mattressRotate = useTransform(progress, [0.75, 0.85], [0, 12]);

  // Studio dressing (ambient glow, contact shadow, fog) only once it's
  // actually airborne — not while it's still sitting where the bed was
  const studioOpacity = useTransform(progress, [0.75, 0.95], [0, 1]);

  // The headline/CTAs arrive last, once the mattress has fully settled
  const textOpacity = useTransform(progress, [0.9, 1], [0, 1]);
  const textPointerEvents = useTransform(textOpacity, (v): string => (v > 0.6 ? "auto" : "none"));

  return (
    <div ref={wrapperRef} className="relative h-[220vh] w-full sm:h-[260vh]">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sticky top-0 h-svh w-full overflow-hidden"
      >
        <IntroScene photoScale={photoScale} vignetteHole={vignetteHole} />

        {/* Final cleanup once the iris has closed — hides the bed frame/bedding for good */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: blackoutOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {/*
          The black studio atmosphere — sits behind the mattress in paint
          order (this div comes before MattressVisual below), never in front
          of it. It used to live inside Hero, but Hero paints after the
          mattress too, so its fully-opaque black layer was silently hiding
          the mattress the instant it reached full opacity.
        */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: atmosphereOpacity }}
          className="bg-grain pointer-events-none absolute inset-0 bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_-8%,var(--color-anthracite-800),transparent)] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_84%_6%,var(--color-anthracite-900),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[radial-gradient(ellipse_85%_70%_at_50%_100%,rgba(138,82,48,0.16),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--color-black-900)_92%)] opacity-70" />
          <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
        </motion.div>

        <MattressVisual
          tiltX={tiltX}
          tiltY={tiltY}
          lightX={lightX}
          lightY={lightY}
          opacity={mattressOpacity}
          posLeft={mattressLeft}
          posTop={mattressTop}
          rotate={mattressRotate}
          scale={mattressScale}
          studioOpacity={studioOpacity}
        />

        <Hero textOpacity={textOpacity} textPointerEvents={textPointerEvents} />
      </div>
    </div>
  );
}
