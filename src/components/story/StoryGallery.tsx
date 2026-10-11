"use client";

import { useState } from "react";
import type { GalleryPhoto } from "../../types/wedding";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";
import { PhotoLightbox } from "./PhotoLightbox";

export function StoryGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <SectionHeading id="gallery-title" eyebrow="Little moments" title="Gallery" intro="Tap any photo to see it larger." />
      <ul className="gallery">
        {photos.map((p, i) => (
          <li key={p.id} className="gallery-item" data-tilt={i % 3}>
            <AnimatedReveal variant="scale" delay={(i % 3) * 90}>
              <button type="button" className="gallery-btn" onClick={() => setActive(i)} aria-label={`Enlarge photo: ${p.alt}`}>
                <Photo photo={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="gallery-img" />
                {p.caption && <span className="gallery-caption">{p.caption}</span>}
              </button>
            </AnimatedReveal>
          </li>
        ))}
      </ul>
      <PhotoLightbox photos={photos} index={active} onChange={setActive} />
    </section>
  );
}
