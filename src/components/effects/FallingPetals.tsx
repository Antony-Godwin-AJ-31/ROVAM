'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#C88991', '#EBCFD2', '#DCE8D8', '#C6A66B'];

interface Petal {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  speed: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  swayOffset: number;
  vx: number;
  vy: number;
}

export function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const resizeObserver = new ResizeObserver(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    resizeObserver.observe(document.body);

    const petals: Petal[] = Array.from({ length: 25 }, () => createPetal(width, height, true));

    let animationFrameId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      petals.forEach((petal) => {
        // Apply velocity (for mouse scatter effect)
        petal.x += petal.vx;
        petal.y += petal.vy;
        
        // Dampen velocity
        petal.vx *= 0.95;
        petal.vy = petal.vy > petal.speed ? petal.vy * 0.95 : petal.speed;

        // Normal movement
        petal.y += petal.speed;
        petal.x += Math.sin(time * petal.swayFrequency + petal.swayOffset) * petal.swayAmplitude;
        petal.rotation += petal.rotationSpeed;

        // Mouse scatter
        const dx = petal.x - mx;
        const dy = petal.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const force = (100 - dist) / 100;
          petal.vx += (dx / dist) * force * 2;
          petal.vy += (dy / dist) * force * 2;
        }

        // Reset if out of bounds
        if (petal.y > height + 50) {
          Object.assign(petal, createPetal(width, height, false));
        }
        if (petal.x < -50) petal.x = width + 50;
        if (petal.x > width + 50) petal.x = -50;

        // Draw petal
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = petal.opacity;
        ctx.fillStyle = petal.color;
        
        ctx.beginPath();
        // size randomly 12-24px, let's say w is length, h is width of the petal
        ctx.ellipse(0, 0, petal.w / 2, petal.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}

function createPetal(width: number, height: number, initial: boolean): Petal {
  const size = 12 + Math.random() * 12; // 12 to 24
  return {
    x: Math.random() * width,
    y: initial ? Math.random() * height : -50,
    w: size,
    h: size * (0.6 + Math.random() * 0.4), // width of petal is 60-100% of length
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    speed: 0.3 + Math.random() * 0.9, // 0.3 to 1.2
    opacity: 0.3 + Math.random() * 0.5, // 0.3 to 0.8
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    swayAmplitude: 0.5 + Math.random() * 1.5,
    swayFrequency: 0.001 + Math.random() * 0.002,
    swayOffset: Math.random() * Math.PI * 2,
    vx: 0,
    vy: 0,
  };
}
