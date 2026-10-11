import { ArrowUp } from "lucide-react";
import type { PhotoAsset } from "../../types/wedding";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { Photo } from "../ui/Photo";
import { CoupleIllustration, DecorativeFlower, HeartIcon, Ornament, CrescentMoon } from "../ui/Illustrations";
import { SecretHeart } from "./SecretHeart";

interface Props {
  message: string[];
  names: string;
  dateLabel: string | null;
  photo?: PhotoAsset;
  illustrations: boolean;
  secretNote?: string;
}

export function ClosingSection({ message, names, dateLabel, photo, illustrations, secretNote }: Props) {
  return (
    <section id="closing" className="closing relative overflow-hidden" aria-labelledby="closing-title">
      {/* Subtle celestial moon & evening starlight */}
      <div className="absolute top-10 right-10 hidden sm:block opacity-60 pointer-events-none float">
        <CrescentMoon className="h-12 w-12 text-[var(--color-gold)]" />
      </div>

      {illustrations && (
        <div className="closing-hearts" aria-hidden="true">
          {[8, 24, 42, 61, 78, 92].map((left, i) => (
            <HeartIcon key={left} className="closing-heart" style={{ left: `${left}%`, animationDelay: `${i * 1.3}s` }} />
          ))}
        </div>
      )}
      <AnimatedReveal className="closing-inner">
        {photo ? (
          <div className="closing-photo">
            <Photo photo={photo} sizes="(min-width: 768px) 560px, 90vw" className="h-auto w-full" />
          </div>
        ) : illustrations ? (
          <CoupleIllustration className="mx-auto h-44 w-auto md:h-56" />
        ) : null}
        <h2 id="closing-title" className="sr-only">Closing message</h2>
        <div className="closing-message">
          {message.map((line, i) => (
            <p key={line} className={i === message.length - 1 ? "closing-last" : undefined}>{line}</p>
          ))}
        </div>
        <Ornament className="mx-auto h-5 w-40" />
        <p className="closing-names">{names}</p>
        {dateLabel && <p className="closing-date">{dateLabel}</p>}
        {illustrations && (
          <div className="closing-flowers" aria-hidden="true">
            <DecorativeFlower className="h-8 w-8" />
            <DecorativeFlower className="h-5 w-5" petal="var(--color-sage-soft)" />
            <DecorativeFlower className="h-8 w-8" />
          </div>
        )}
        {secretNote && <SecretHeart note={secretNote} />}
        <a href="#top" className="btn btn-ghost mt-8">
          <ArrowUp aria-hidden="true" size={18} /> Back to the top
        </a>
      </AnimatedReveal>
    </section>
  );
}
