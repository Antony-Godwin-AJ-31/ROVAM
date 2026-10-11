"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  initialInView?: boolean;
}

/**
 * Bidirectional scroll fade wrapper.
 * Smoothly fades in sections when entering the viewport
 * and fades them out when leaving the viewport (scrolling down or scrolling up).
 */
export function ScrollFadeSection({ children, id, className = "", initialInView = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(initialInView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Active visible zone: within 12% from top and 12% from bottom
      const isVisible = rect.bottom > vh * 0.12 && rect.top < vh * 0.88;
      setInView(isVisible);
    };

    // Check visibility on mount
    checkVisibility();

    // Listen to scroll events with requestAnimationFrame for smooth bidirectional transitions
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`scroll-fade-section ${className}`}
      data-in-view={inView ? "true" : "false"}
    >
      {children}
    </div>
  );
}
