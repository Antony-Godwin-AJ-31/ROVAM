"use client";

import { useState, useEffect, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2, X, Sparkles } from "lucide-react";
import { GALLERY_ITEMS, type GalleryItem } from "../../data/galleryManifest";
import { SectionHeading } from "../ui/SectionHeading";
import { BotanicalFrame } from "../ui/Illustrations";

const SLIDE_DURATION_MS = 5000;
const TOTAL_ITEMS = GALLERY_ITEMS.length;

export function CompleteGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const lightboxRef = useRef<HTMLDialogElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Next photo (moves flow forward: new one comes from left into center, previous moves right)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TOTAL_ITEMS);
    setProgress(0);
  }, []);

  // Previous photo
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TOTAL_ITEMS) % TOTAL_ITEMS);
    setProgress(0);
  }, []);

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (!isPlaying || lightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION_MS) * 100, 100);
      setProgress(pct);
    }, 50);

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying, lightboxOpen, nextSlide]);

  // Touch and pointer swipe handlers
  const handlePointerDown = (e: ReactPointerEvent) => {
    swipeStartRef.current = e.clientX;
  };

  const handlePointerUp = (e: ReactPointerEvent) => {
    if (swipeStartRef.current === null) return;
    const diff = e.clientX - swipeStartRef.current;
    swipeStartRef.current = null;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Dragged right -> go to previous photo
        prevSlide();
      } else {
        // Dragged left -> go to next photo
        nextSlide();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
        return;
      }

      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === " ") {
        // Spacebar toggles playback if gallery in viewport
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
          e.preventDefault();
          setIsPlaying((p) => !p);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextSlide, prevSlide]);

  // Lightbox modal setup
  useEffect(() => {
    const dlg = lightboxRef.current;
    if (!dlg) return;
    if (lightboxOpen) {
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    } else {
      if (dlg.open) dlg.close();
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Calculate visible items for the horizontal stage
  // Visual offset V = -(j - currentIndex):
  // V = 0: Center photo (active)
  // V = +1: Previous photo (moved to RIGHT, faded)
  // V = +2: Older photo (farther to RIGHT, more faded)
  // V = -1: Next incoming photo (on the LEFT, faded)
  // V = -2: Upcoming photo (farther on the LEFT, more faded)
  const visibleIndices: { item: GalleryItem; offset: number; rawIndex: number }[] = [];
  for (let offset = -3; offset <= 3; offset++) {
    const rawIndex = (currentIndex - offset + TOTAL_ITEMS * 10) % TOTAL_ITEMS;
    visibleIndices.push({
      item: GALLERY_ITEMS[rawIndex],
      offset,
      rawIndex,
    });
  }

  const currentItem = GALLERY_ITEMS[currentIndex];

  return (
    <section id="gallery" ref={containerRef} className="section relative overflow-hidden py-20" aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        eyebrow="Cherished moments"
        title="Our Flowing Moments"
        intro="A continuous journey through our smiles, laughter, and favorite memories together."
      />

      <div className="flex justify-center -mt-6 mb-8">
        <BotanicalFrame className="h-6 w-60 opacity-75" />
      </div>

      {/* Main Flowing Stage Container */}
      <div
        className="relative w-full max-w-7xl mx-auto px-4 select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Stage Viewport */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full flex items-center justify-center overflow-hidden">
          {visibleIndices.map(({ item, offset, rawIndex }) => {
            // Precise positioning styles based on offset
            // offset > 0 => on RIGHT (previous photos, moving right and fading)
            // offset < 0 => on LEFT (upcoming photos, moving in from left)
            // offset == 0 => CENTER (active)
            const isCenter = offset === 0;

            // Responsive positioning
            // Desktop: 0 => 0px, +1 => 310px, +2 => 560px, +3 => 780px
            // Mobile: 0 => 0%, +1 => 68%, +2 => 125%, +3 => 175%
            let translateX = "0px";
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;
            let blur = "0px";

            if (isCenter) {
              translateX = "0px";
              scale = 1;
              opacity = 1;
              zIndex = 10;
              blur = "0px";
            } else if (offset === 1) {
              // Immediately previous photo: moved RIGHT, a little faded
              translateX = "min(320px, 68vw)";
              scale = 0.85;
              opacity = 0.6;
              zIndex = 7;
              blur = "0.5px";
            } else if (offset === 2) {
              // One previous to that: farther RIGHT, more faded
              translateX = "min(580px, 126vw)";
              scale = 0.72;
              opacity = 0.28;
              zIndex = 5;
              blur = "1.5px";
            } else if (offset >= 3) {
              translateX = "min(820px, 180vw)";
              scale = 0.6;
              opacity = 0;
              zIndex = 2;
              blur = "3px";
            } else if (offset === -1) {
              // Next upcoming photo: on the LEFT, a little faded
              translateX = "max(-320px, -68vw)";
              scale = 0.85;
              opacity = 0.6;
              zIndex = 7;
              blur = "0.5px";
            } else if (offset === -2) {
              // Photo next to that: farther on LEFT, more faded
              translateX = "max(-580px, -126vw)";
              scale = 0.72;
              opacity = 0.28;
              zIndex = 5;
              blur = "1.5px";
            } else if (offset <= -3) {
              translateX = "max(-820px, -180vw)";
              scale = 0.6;
              opacity = 0;
              zIndex = 2;
              blur = "3px";
            }

            return (
              <div
                key={`${item.id}-${offset}`}
                onClick={() => {
                  if (isCenter) {
                    setLightboxOpen(true);
                  } else {
                    setCurrentIndex(rawIndex);
                    setProgress(0);
                  }
                }}
                className={`absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                  isCenter ? "cursor-zoom-in" : "hover:opacity-80"
                }`}
                style={{
                  transform: `translate3d(${translateX}, 0, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${blur})`,
                  width: "min(320px, 76vw)",
                }}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={isCenter ? `View enlarged: ${item.alt}` : `Switch to photo ${rawIndex + 1}`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-white p-2.5 sm:p-3 transition-shadow duration-300 ${
                    isCenter
                      ? "shadow-2xl ring-2 ring-[var(--color-gold)] ring-offset-4 ring-offset-[var(--color-ivory)]"
                      : "shadow-md border border-[var(--color-gold)]/40"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--color-paper)]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={isCenter}
                      sizes="(min-width: 768px) 340px, 80vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {isCenter && (
                      <div className="absolute top-3 right-3 flex items-center justify-center p-2 rounded-full bg-black/40 text-white backdrop-blur-sm shadow-sm opacity-0 hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} />
                      </div>
                    )}
                  </div>

                  {/* Photo numbering & caption flourish */}
                  <div className="mt-2.5 text-center">
                    <p className="font-serif text-xs uppercase tracking-widest text-[var(--color-brown)] font-medium">
                      Moment {rawIndex + 1} of {TOTAL_ITEMS}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Navigation Controls (Left & Right Arrows) */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 text-[var(--color-ink)] shadow-lg border border-[var(--color-gold)]/40 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 text-[var(--color-ink)] shadow-lg border border-[var(--color-gold)]/40 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Playback Controls & 5-Second Progress Bar */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 max-w-md mx-auto px-4">
        {/* Progress Bar (5s timer) */}
        <div className="w-full h-1.5 bg-[var(--color-paper)] rounded-full overflow-hidden border border-[var(--color-gold)]/20 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-rose)] to-[var(--color-sage)] transition-all duration-75 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status bar with Play/Pause button */}
        <div className="flex items-center justify-between w-full text-xs text-[var(--color-brown)] font-medium">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[var(--color-gold)]/35 hover:bg-white shadow-xs transition-all text-[var(--color-moss)] font-semibold"
            aria-label={isPlaying ? "Pause flowing slideshow" : "Play flowing slideshow"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? "Flowing (5s)" : "Paused"}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-xs text-[var(--color-brown)] tracking-wider uppercase font-semibold">
            <Sparkles size={13} className="text-[var(--color-rose)]" />
            <span>{currentIndex + 1} / {TOTAL_ITEMS} Memories</span>
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 border border-[var(--color-gold)]/35 hover:bg-white shadow-xs transition-all text-[var(--color-brown)]"
            aria-label="Open full screen lightbox"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Enlarge</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Accessible Lightbox Dialog */}
      <dialog
        ref={lightboxRef}
        className="lightbox"
        onClick={(e) => {
          if (e.target === lightboxRef.current) setLightboxOpen(false);
        }}
      >
        {currentItem && (
          <div className="lightbox-inner">
            <button
              type="button"
              className="lightbox-btn lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close enlarged view"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              className="lightbox-btn lightbox-prev"
              onClick={prevSlide}
              aria-label="Previous photograph"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              className="lightbox-btn lightbox-next"
              onClick={nextSlide}
              aria-label="Next photograph"
            >
              <ChevronRight size={28} />
            </button>

            <div className="relative max-h-[82vh] max-w-[90vw] flex items-center justify-center">
              <Image
                src={currentItem.src}
                alt={currentItem.alt}
                width={currentItem.width}
                height={currentItem.height}
                priority
                className="max-h-[80vh] w-auto max-w-[88vw] object-contain rounded-lg shadow-2xl border-2 border-white/20"
              />
            </div>

            <p className="lightbox-count">
              {currentIndex + 1} / {TOTAL_ITEMS}
            </p>
          </div>
        )}
      </dialog>
    </section>
  );
}
