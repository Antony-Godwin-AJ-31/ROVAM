import { Ornament } from "./Illustrations";

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      {eyebrow && <p className="font-script text-3xl text-moss md:text-4xl">{eyebrow}</p>}
      <h2 id={id} className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
        {title}
      </h2>
      <Ornament className="mx-auto mt-4 h-5 w-40" />
      {intro && <p className="mx-auto mt-4 max-w-prose text-base leading-relaxed text-brown">{intro}</p>}
    </header>
  );
}
