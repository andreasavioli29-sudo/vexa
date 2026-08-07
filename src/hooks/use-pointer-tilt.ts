"use client";

import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { PointerEvent } from "react";

export type PointerTilt = {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

/**
 * Mouse-reactive tilt/light shared by any floating product visual — the
 * mattress today, future product scenes later — kept independent of the
 * scroll timeline since it's driven by pointer position, not progress.
 */
export function usePointerTilt(): PointerTilt {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const lightX = useTransform(springX, [-0.5, 0.5], [35, 65]);
  const lightY = useTransform(springY, [-0.5, 0.5], [30, 60]);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return { tiltX, tiltY, lightX, lightY, onPointerMove, onPointerLeave };
}
