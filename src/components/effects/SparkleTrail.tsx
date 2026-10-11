'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  createdAt: number;
}

export function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#C6A66B', '#FFFDF8'];
    const maxParticles = 50;
    let particleIdCounter = 0;

    const spawnParticles = (x: number, y: number) => {
      const now = performance.now();
      const numParticles = Math.floor(Math.random() * 3) + 1; // 1 to 3 sparkles
      
      for (let i = 0; i < numParticles; i++) {
        if (particles.current.length >= maxParticles) {
          particles.current.shift(); // Remove oldest to maintain max limit
        }
        
        particles.current.push({
          id: particleIdCounter++,
          x: x + (Math.random() - 0.5) * 15,
          y: y + (Math.random() - 0.5) * 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 4, // 4 to 8px
          life: 1,
          maxLife: 800, // fade out over ~800ms
          vx: (Math.random() - 0.5) * 1,
          vy: - (Math.random() * 1.5 + 0.5), // drift upward
          createdAt: now
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      spawnParticles(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        spawnParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let lastTime = performance.now();

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, outerR: number, innerR: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    };

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        const age = time - p.createdAt;
        p.life = 1 - age / p.maxLife;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        // Apply velocity (adjusted for time to be consistent across framerates)
        const timeScale = deltaTime / 16.66;
        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        
        // Add slight random horizontal drift
        p.vx += (Math.random() - 0.5) * 0.1 * timeScale;

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        const currentSize = p.size * Math.max(0, p.life); // Scale down as it fades
        if (currentSize > 0.5) {
          drawStar(ctx, p.x, p.y, currentSize, currentSize / 2.5);
        }
      }
      
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  );
}
