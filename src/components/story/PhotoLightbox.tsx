"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type { GalleryPhoto } from "../../types/wedding";
import { Photo } from "../ui/Photo";

interface Props {
  photos: GalleryPhoto[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/**
 * Built on the native <dialog>: the browser provides the focus trap, Esc-to-close, inert background and
 * returns focus to the thumbnail that opened it. We add arrows/swipe, backdrop click and scroll lock.
 */
export function PhotoLightbox({ photos, index, onChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) dlg.showModal();
    if (!isOpen && dlg.open) dlg.close();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const photo = index !== null ? photos[index] : null;
  const multiple = photos.length > 1;

  const onPointerDown = (e: ReactPointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50 && multiple) go(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Photo viewer"
      onClose={() => onChange(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onChange(null); // backdrop click
      }}
    >
      {photo && (
        <div className="lightbox-inner" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <button type="button" className="lightbox-btn lightbox-close" onClick={() => onChange(null)} aria-label="Close photo viewer" autoFocus>
            <X aria-hidden="true" size={24} />
          </button>
          <Photo photo={photo} sizes="100vw" priority className="lightbox-img" />
          {photo.caption && <p className="lightbox-caption">{photo.caption}</p>}
          {multiple && (
            <>
              <button type="button" className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous photo">
                <ChevronLeft aria-hidden="true" size={26} />
              </button>
              <button type="button" className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next photo">
                <ChevronRight aria-hidden="true" size={26} />
              </button>
              <p className="lightbox-count" aria-live="polite">{(index ?? 0) + 1} / {photos.length}</p>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
