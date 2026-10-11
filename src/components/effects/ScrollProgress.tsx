"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(progress);
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (width < 0.5) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${width}%`,
        zIndex: 50,
        background: "linear-gradient(90deg, #C88991, #C6A66B, #788B72)",
        boxShadow: "0 0 10px rgba(200, 137, 145, 0.5)",
        transition: "width 80ms linear",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
