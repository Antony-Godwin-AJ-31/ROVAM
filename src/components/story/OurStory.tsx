import type { StoryMilestone } from "../../types/wedding";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { Photo } from "../ui/Photo";
import { HeartIcon } from "../ui/Illustrations";
import { SectionHeading } from "../ui/SectionHeading";

export function OurStory({ milestones }: { milestones: StoryMilestone[] }) {
  if (milestones.length === 0) return null;
  return (
    <section id="story" className="section section--paper" aria-labelledby="story-title">
      <SectionHeading id="story-title" eyebrow="How it began" title="Our Story" />
      <ol className="story">
        <li className="story-line-wrap" aria-hidden="true">
          <AnimatedReveal variant="draw" className="story-line-reveal"><span className="story-line" /></AnimatedReveal>
        </li>
        {milestones.map((m, i) => (
          <li key={m.id} className={`story-item ${i % 2 ? "story-item--flip" : ""}`}>
            <AnimatedReveal variant={i % 2 ? "slide-right" : "slide-left"} className="story-card glow-card">
              <HeartIcon className="story-heart" />
              {m.dateLabel && <p className="story-date">{m.dateLabel}</p>}
              <h3 className="story-title">{m.title}</h3>
              <p className="story-text">{m.text}</p>
            </AnimatedReveal>
            {m.photo && (
              <AnimatedReveal variant={i % 2 ? "slide-left" : "slide-right"} delay={120} className="story-photo-wrap">
                <figure className="polaroid" data-tilt={i % 2 ? "right" : "left"}>
                  <Photo photo={m.photo} sizes="(min-width: 768px) 28vw, 80vw" className="polaroid-img" />
                  {m.caption && <figcaption className="polaroid-caption">{m.caption}</figcaption>}
                </figure>
              </AnimatedReveal>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
