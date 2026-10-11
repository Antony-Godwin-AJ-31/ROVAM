"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "fade" | "scale" | "draw" | "slide-left" | "slide-right" | "zoom" | "rotate";
type State = "visible" | "hidden" | "shown";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered reveal. Content is fully visible by default (SSR, no-JS, reduced motion, failed observer).
 * Only elements that start below the fold are hidden after mount, then revealed once, when they enter view.
 */
export function AnimatedReveal({ children, variant = "up", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return; // already in view

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("shown");
          } else {
            // Fade out previous elements when scrolling down or up
            setState("hidden");
          }
        }
      },
      { threshold: 0.1, rootMargin: "-40px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      data-variant={variant}
      data-state={state}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
