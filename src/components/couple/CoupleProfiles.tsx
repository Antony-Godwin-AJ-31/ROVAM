import type { Person } from "../../types/wedding";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { Photo } from "../ui/Photo";
import { DecorativeFlower, HeartIcon, Sprig } from "../ui/Illustrations";
import { SectionHeading } from "../ui/SectionHeading";
import { initial } from "../../lib/utils";

function Profile({ person, role, tone }: { person: Person; role: string; tone: "sage" | "blush" }) {
  return (
    <figure className="profile">
      <div className={`profile-frame profile-frame--${tone}`}>
        {person.portrait ? (
          <Photo photo={person.portrait} sizes="(min-width: 768px) 30vw, 80vw" className="h-full w-full object-cover" />
        ) : (
          <span className="profile-monogram" aria-hidden="true">{initial(person.name)}</span>
        )}
        <DecorativeFlower className="profile-flower" petal={tone === "sage" ? "var(--color-sage-soft)" : "var(--color-blush)"} />
      </div>
      <figcaption className="profile-caption">
        <span className="font-script text-2xl text-moss">{role}</span>
        <span className="font-serif text-3xl text-ink">{person.name}</span>
        {person.description && <span className="profile-text">{person.description}</span>}
        {person.detail && <span className="profile-detail">{person.detail}</span>}
      </figcaption>
    </figure>
  );
}

export function CoupleProfiles({ bride, groom, illustrations }: { bride: Person; groom: Person; illustrations: boolean }) {
  return (
    <section id="couple" className="section" aria-labelledby="couple-title">
      <SectionHeading id="couple-title" eyebrow="The two of us" title="Meet the Couple" />
      <div className="profiles">
        <AnimatedReveal><Profile person={bride} role="The bride" tone="blush" /></AnimatedReveal>
        <div className="profiles-connector" aria-hidden="true">
          {illustrations ? <Sprig className="h-24 w-12 md:h-40 md:w-20" /> : null}
          <HeartIcon className="h-8 w-8" />
          {illustrations ? <Sprig className="h-24 w-12 rotate-180 md:h-40 md:w-20" /> : null}
        </div>
        <AnimatedReveal delay={150}><Profile person={groom} role="The groom" tone="sage" /></AnimatedReveal>
      </div>
    </section>
  );
}
