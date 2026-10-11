"use client";

import { useEffect, useRef, useState } from "react";

// Wedding color palette for rose petals
const PETAL_COLORS = [
  "#EBCFD2", // blush pink
  "#C88991", // dusty rose
  "#FFF9F1", // soft ivory
  "#E8927C", // muted coral
  "#C6A66B", // soft champagne gold
  "#F2D6DB", // petal pink
];

interface Petal {
  x: number;
  y: number;
  size: number;
  aspect: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  speedY: number;
  driftSpeed: number;
  driftFreq: number;
  driftOffset: number;
  rotation: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  swirl: number;
  swirlRadius: number;
  layer: "bg" | "fg";
}

interface CelestialStar {
  x: number;
  y: number;
  size: number;
  type: "five-point" | "four-point" | "stardust";
  twinkleSpeed: number;
  phase: number;
  opacity: number;
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftOffset: number;
  opacity: number;
  color: string;
}

interface Butterfly {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  wingPhase: number;
  wingSpeed: number;
  direction: 1 | -1;
  opacity: number;
}

export function FloatingDecorations() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [motionEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    if (!bgCtx || !fgCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      bgCanvas.width = width;
      bgCanvas.height = height;
      fgCanvas.width = width;
      fgCanvas.height = height;
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Pools configuration
    const maxPetals = isMobile ? 12 : 24;
    const maxStars = isMobile ? 8 : 16;
    const maxHearts = isMobile ? 2 : 5;
    const maxButterflies = isMobile ? 1 : 2;

    const createPetal = (startY?: number): Petal => {
      const isForeground = Math.random() < 0.22;
      const size = isForeground ? 16 + Math.random() * 10 : 12 + Math.random() * 8;
      // If foreground, keep slightly towards the margins (away from the middle 50% where text lives)
      let x = Math.random() * width;
      if (isForeground) {
        x = Math.random() < 0.5 ? Math.random() * (width * 0.28) : width * 0.72 + Math.random() * (width * 0.28);
      }

      return {
        x,
        y: startY !== undefined ? startY : -40 - Math.random() * 100,
        size,
        aspect: 0.65 + Math.random() * 0.35,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: 0,
        baseOpacity: isForeground ? 0.45 + Math.random() * 0.35 : 0.25 + Math.random() * 0.4,
        speedY: isForeground ? 0.7 + Math.random() * 0.7 : 0.4 + Math.random() * 0.6,
        driftSpeed: (Math.random() - 0.5) * 0.8,
        driftFreq: 0.001 + Math.random() * 0.0015,
        driftOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.01 + Math.random() * 0.02,
        swirl: Math.random() * Math.PI * 2,
        swirlRadius: 10 + Math.random() * 20,
        layer: isForeground ? "fg" : "bg",
      };
    };

    // Stagger initial Y positions so petals enter smoothly
    const petals: Petal[] = Array.from({ length: maxPetals }, () => createPetal(Math.random() * height));

    const stars: CelestialStar[] = Array.from({ length: maxStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.85),
      size: 3 + Math.random() * 4,
      type: Math.random() < 0.4 ? "five-point" : Math.random() < 0.7 ? "four-point" : "stardust",
      twinkleSpeed: 0.0015 + Math.random() * 0.0025,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.3,
    }));

    const hearts: FloatingHeart[] = Array.from({ length: maxHearts }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: 10 + Math.random() * 10,
      speedY: 0.3 + Math.random() * 0.4,
      driftOffset: Math.random() * Math.PI * 2,
      opacity: 0,
      color: Math.random() < 0.6 ? "#C88991" : "#EBCFD2",
    }));

    const butterflies: Butterfly[] = Array.from({ length: maxButterflies }, () => ({
      x: Math.random() < 0.5 ? -40 : width + 40,
      y: height * 0.15 + Math.random() * (height * 0.7),
      size: 16 + Math.random() * 8,
      vx: 0.4 + Math.random() * 0.4,
      vy: (Math.random() - 0.5) * 0.2,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.08 + Math.random() * 0.04,
      direction: Math.random() < 0.5 ? 1 : -1,
      opacity: 0.75,
    }));

    // Realistic rose petal path
    const drawRosePetal = (ctx: CanvasRenderingContext2D, size: number, aspect: number, flipScale: number) => {
      const w = size * aspect;
      const h = size;

      ctx.scale(1, Math.max(0.12, Math.abs(flipScale)));
      ctx.beginPath();
      // Curved organic petal with gentle apex indent
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(w * 0.65, -h * 0.45, w * 0.75, h * 0.2, 0, h * 0.52);
      ctx.bezierCurveTo(-w * 0.75, h * 0.2, -w * 0.65, -h * 0.45, 0, -h * 0.5);
      ctx.closePath();
      ctx.fill();

      // Subtle inner petal ridge for 3D realism
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.3);
      ctx.quadraticCurveTo(w * 0.1, 0, 0, h * 0.35);
      ctx.stroke();
    };

    // Draw five-pointed celestial star
    const drawFivePointStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? r : r * 0.42;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Draw four-pointed sparkle
    const drawFourPointSparkle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r : r * 0.22;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Draw delicate floating heart
    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      const s = size / 24;
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(12, 21);
      ctx.bezierCurveTo(4.5, 16.4, 2.4, 11.8, 2.4, 7.8);
      ctx.bezierCurveTo(2.4, 4.5, 4.5, 2.4, 7.8, 2.4);
      ctx.bezierCurveTo(10.2, 2.4, 11.4, 4, 12, 5.2);
      ctx.bezierCurveTo(12.6, 4, 13.8, 2.4, 16.2, 2.4);
      ctx.bezierCurveTo(19.5, 2.4, 21.6, 4.5, 21.6, 7.8);
      ctx.bezierCurveTo(21.6, 11.8, 19.5, 16.4, 12, 21);
      ctx.closePath();
      ctx.fill();
    };

    // Draw butterfly with flapping wings
    const drawButterfly = (ctx: CanvasRenderingContext2D, b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.direction, 1);
      ctx.globalAlpha = b.opacity;

      const wingFlap = Math.cos(b.wingPhase); // -1 to 1

      // Left wings
      ctx.save();
      ctx.scale(wingFlap, 1);
      ctx.fillStyle = "#EBCFD2";
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.5, -b.size * 0.3, b.size * 0.5, b.size * 0.35, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C88991";
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.35, b.size * 0.25, b.size * 0.35, b.size * 0.25, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right wings
      ctx.save();
      ctx.scale(wingFlap, 1);
      ctx.fillStyle = "#EBCFD2";
      ctx.beginPath();
      ctx.ellipse(b.size * 0.5, -b.size * 0.3, b.size * 0.5, b.size * 0.35, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C88991";
      ctx.beginPath();
      ctx.ellipse(b.size * 0.35, b.size * 0.25, b.size * 0.35, b.size * 0.25, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body & antennae
      ctx.fillStyle = "#55463F";
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.8, b.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let animationId: number;
    const isRunning = motionEnabled;

    const render = (time: number) => {
      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      // When a modal or lightbox is open, suspend decorative particles to keep photos pristine
      const isModalOpen = Boolean(document.querySelector('dialog[open]'));
      if (isModalOpen) {
        if (isRunning) animationId = requestAnimationFrame(render);
        return;
      }

      // ─── 1. CELESTIAL STARS LAYER (Background) ───
      stars.forEach((star) => {
        const twinkle = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.phase));
        bgCtx.save();
        bgCtx.globalAlpha = twinkle;
        bgCtx.fillStyle = "#C6A66B"; // champagne gold

        if (star.type === "five-point") {
          drawFivePointStar(bgCtx, star.x, star.y, star.size);
        } else if (star.type === "four-point") {
          drawFourPointSparkle(bgCtx, star.x, star.y, star.size * 1.2);
        } else {
          // Stardust dot with soft aura
          bgCtx.beginPath();
          bgCtx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
          bgCtx.fill();
        }
        bgCtx.restore();
      });

      // ─── 2. FLOATING HEARTS (Occasional upward drift) ───
      hearts.forEach((heart) => {
        if (isRunning) {
          heart.y -= heart.speedY;
          heart.x += Math.sin(time * 0.001 + heart.driftOffset) * 0.35;
        }

        // Fade in when entering from bottom, fade out near top
        if (heart.y < height && heart.y > 100) {
          heart.opacity = Math.min(0.65, heart.opacity + 0.015);
        } else {
          heart.opacity = Math.max(0, heart.opacity - 0.02);
        }

        if (heart.y < -30) {
          heart.y = height + 40 + Math.random() * 100;
          heart.x = Math.random() * width;
          heart.opacity = 0;
        }

        if (heart.opacity > 0) {
          bgCtx.save();
          bgCtx.translate(heart.x, heart.y);
          bgCtx.globalAlpha = heart.opacity;
          bgCtx.fillStyle = heart.color;
          drawHeart(bgCtx, heart.size);
          bgCtx.restore();
        }
      });

      // ─── 3. BUTTERFLIES (Sideways glide) ───
      butterflies.forEach((b) => {
        if (isRunning) {
          b.x += b.vx * b.direction;
          b.y += Math.sin(time * 0.002) * 0.8 + b.vy;
          b.wingPhase += b.wingSpeed;
        }

        if ((b.direction === 1 && b.x > width + 60) || (b.direction === -1 && b.x < -60)) {
          b.direction = Math.random() < 0.5 ? 1 : -1;
          b.x = b.direction === 1 ? -40 : width + 40;
          b.y = height * 0.2 + Math.random() * (height * 0.6);
        }

        drawButterfly(bgCtx, b);
      });

      // ─── 4. FALLING ROSE PETALS (Main engine) ───
      petals.forEach((p) => {
        if (isRunning) {
          p.y += p.speedY;
          p.x += Math.sin(time * p.driftFreq + p.driftOffset) * 1.1 + p.driftSpeed;
          p.rotation += p.rotSpeed;
          p.flip += p.flipSpeed;
        }

        // Smooth fade-in at top and fade-out near bottom
        if (p.y < 80) {
          p.opacity = Math.min(p.baseOpacity, (p.y + 40) / 120 * p.baseOpacity);
        } else if (p.y > height - 80) {
          p.opacity = Math.max(0, ((height - p.y) / 80) * p.baseOpacity);
        } else {
          p.opacity = p.baseOpacity;
        }

        // Respawn gracefully above viewport
        if (p.y > height + 40) {
          Object.assign(p, createPetal(-40));
        }

        const ctx = p.layer === "fg" ? fgCtx : bgCtx;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        const flipScale = Math.cos(p.flip);
        drawRosePetal(ctx, p.size, p.aspect, flipScale);
        ctx.restore();
      });

      if (isRunning) {
        animationId = requestAnimationFrame(render);
      }
    };

    // Start loop or render static frame
    if (motionEnabled) {
      animationId = requestAnimationFrame(render);
    } else {
      render(0); // Render single static frame
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(animationId);
      } else if (motionEnabled) {
        animationId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionEnabled, isClient]);

  if (!isClient) return null;

  return (
    <>
      {/* Layer 1 & 2: Background Stars, Hearts, Butterflies, and Ambient Petals */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* Layer 4: Sparse Foreground Petals (kept to outer margins, pointer-events: none) */}
      <canvas
        ref={fgCanvasRef}
        className="fixed inset-0 pointer-events-none z-[20]"
        aria-hidden="true"
      />
    </>
  );
}
