"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  bride: string;
  groom: string;
  isReady: boolean;
  onComplete?: () => void;
}

export function MagicalPenWriter({ bride, groom, isReady, onComplete }: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [penPos, setPenPos] = useState({ x: 0, y: 0, angle: -24 });
  const [isDone, setIsDone] = useState(false);
  const [penVisible, setPenVisible] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkCount = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const hasStarted = useRef(false);

  const finishAnimation = useCallback(() => {
    setProgress(1);
    setIsDone(true);
    setPenVisible(false);
    setSparkles([]);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!isReady || hasStarted.current) return;
    hasStarted.current = true;

    // Wait 300ms after envelope zoom completes before pen starts writing
    const startDelayTimer = setTimeout(() => {
      setPenVisible(true);

      const duration = 2600; // 2.6 seconds writing time
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        setProgress(t);

        if (textRef.current) {
          const width = textRef.current.offsetWidth || 340;
          const height = textRef.current.offsetHeight || 52;
          const startX = textRef.current.offsetLeft || 0;
          const startY = (textRef.current.offsetTop || 0) + height * 0.62;
          const currentX = startX + t * width;

          // Gentle cursive rhythm matching letter ascenders & descenders
          const bob = Math.sin(t * Math.PI * 18) * 6 + Math.cos(t * Math.PI * 32) * 2.5;
          const currentY = startY + bob;
          const angle = -24 + Math.sin(t * Math.PI * 16) * 5;

          setPenPos({ x: currentX, y: currentY, angle });

          // Spawn magical stardust particles behind the nib
          if (t < 0.95 && Math.random() < 0.4) {
            const newId = sparkCount.current++;
            setSparkles((prev) => [
              ...prev.slice(-8),
              { id: newId, x: currentX - 4 + (Math.random() - 0.5) * 8, y: currentY - 2 + (Math.random() - 0.5) * 8 },
            ]);
            setTimeout(() => {
              setSparkles((prev) => prev.filter((s) => s.id !== newId));
            }, 450);
          }
        }

        if (t < 1) {
          animFrameId.current = requestAnimationFrame(animate);
        } else {
          // Pen flourish: swoops up gracefully and vanishes
          setPenPos((p) => ({ ...p, y: p.y - 28, angle: -10 }));
          setSparkles([]);
          setTimeout(() => {
            setPenVisible(false);
            setSparkles([]);
            setIsDone(true);
            onComplete?.();
          }, 300);
        }
      };

      animFrameId.current = requestAnimationFrame(animate);
    }, 350);

    return () => {
      clearTimeout(startDelayTimer);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isReady, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none py-2 my-1"
      style={{ minHeight: "5rem" }}
      onClick={finishAnimation}
    >
      <div className="relative inline-flex items-baseline justify-center">
        {/* The Calligraphic Names - Revealed from Left to Right */}
        <h1
          id="hero-title"
          className="hero-names relative m-0 p-0 text-center select-none"
          aria-label={`${bride} and ${groom}`}
        >
          <span
            ref={textRef}
            className="inline-flex items-baseline justify-center gap-1.5 sm:gap-3 text-[clamp(1.75rem,7vw,3.75rem)] font-script tracking-wide whitespace-nowrap"
            style={{
              color: "#2C221E",
              clipPath: isDone ? "none" : `inset(0 ${Math.max(0, (1 - progress) * 100).toFixed(1)}% 0 0)`,
              WebkitClipPath: isDone ? "none" : `inset(0 ${Math.max(0, (1 - progress) * 100).toFixed(1)}% 0 0)`,
              willChange: "clip-path",
            }}
          >
            <span style={{ color: "#2C221E" }}>{bride}</span>
            <span className="text-2xl sm:text-4xl px-1 sm:px-2 font-script" style={{ color: "var(--color-rose)" }} aria-hidden="true">
              &amp;
            </span>
            <span style={{ color: "#2C221E" }}>{groom}</span>
          </span>
        </h1>

        {/* The Floating Golden Pen Writing Each Stroke */}
        {penVisible && (
          <div
            className="absolute top-0 left-0 pointer-events-none z-30 transition-opacity duration-300"
            style={{
              transform: `translate3d(${penPos.x}px, ${penPos.y}px, 0) rotate(${penPos.angle}deg)`,
              transformOrigin: "7px 43px", // Pivot exactly at the pen nib tip
            }}
            aria-hidden="true"
          >
            <div className="relative w-12 h-12 -translate-x-[7px] -translate-y-[43px]">
              {/* Golden Feather Quill Pen */}
              <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[0_4px_10px_rgba(198,166,107,0.65)]" fill="none">
                <path
                  d="M44 4C36 5 21 13 15 27C13 31 11 35 10 39L7 43L11 41C15 40 19 38 23 36C37 30 44 15 45 7C45 5 44 4 44 4Z"
                  fill="url(#goldQuillLiveGrad)"
                />
                <path
                  d="M10 39L7 43L11 41L13 37L10 39Z"
                  fill="#FFF4C4"
                  stroke="#8C671C"
                  strokeWidth="0.8"
                />
                <path
                  d="M21 23C25 17 33 11 43 5"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="goldQuillLiveGrad" x1="46" y1="4" x2="7" y2="43" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDEAB2" />
                    <stop offset="0.45" stopColor="#DFB251" />
                    <stop offset="0.8" stopColor="#B88A2D" />
                    <stop offset="1" stopColor="#7E5616" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glowing Golden Nib Starburst */}
              <span
                className="absolute left-[3px] top-[39px] w-3 h-3 rounded-full bg-[#FFF9DC] animate-ping opacity-85"
                style={{ boxShadow: "0 0 12px 4px rgba(223, 178, 81, 0.95)" }}
              />
            </div>
          </div>
        )}

        {/* Trailing Stardust Sparkles */}
        {!isDone &&
          penVisible &&
          sparkles.map((sp) => (
            <span
              key={sp.id}
              className="absolute pointer-events-none z-20 animate-fade-out"
              style={{
                left: `${sp.x}px`,
                top: `${sp.y}px`,
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
              aria-hidden="true"
            >
              <Sparkles size={11} className="text-[var(--color-gold)] opacity-85" />
            </span>
          ))}
      </div>
    </div>
  );
}
