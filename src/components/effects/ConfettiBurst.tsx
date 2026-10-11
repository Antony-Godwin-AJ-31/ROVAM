"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface Props {
  /** Fire confetti when this transitions from false to true. */
  trigger: boolean;
}

const WEDDING_COLORS = ["#C88991", "#EBCFD2", "#DCE8D8", "#C6A66B", "#FFFFFF"];

export function ConfettiBurst({ trigger }: Props) {
  const firedRef = useRef(false);

  const fire = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: WEDDING_COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: WEDDING_COLORS,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    // Big initial burst from center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: WEDDING_COLORS,
      ticks: 200,
    });

    frame();
  }, []);

  useEffect(() => {
    if (trigger && !firedRef.current) {
      firedRef.current = true;
      fire();
    }
  }, [trigger, fire]);

  return null;
}
