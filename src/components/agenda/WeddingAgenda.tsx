import type { NormalizedAgendaEvent } from "../../lib/content";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { BotanicalFrame, DecorativeFlower } from "../ui/Illustrations";
import { AgendaItem } from "./AgendaItem";

export function WeddingAgenda({ events, dateLabel }: { events: NormalizedAgendaEvent[]; dateLabel: string | null }) {
  return (
    <section id="agenda" className="section section--paper relative overflow-hidden" aria-labelledby="agenda-title">
      <SectionHeading
        id="agenda-title"
        eyebrow="The wedding day"
        title="Wedding-Day Schedule"
        intro={dateLabel ? `${dateLabel} • All celebrations held on the holy grounds of Annai Velankanni Mini Basilica` : undefined}
      />

      <div className="flex justify-center -mt-6 mb-10">
        <BotanicalFrame className="h-6 w-56 opacity-75" />
      </div>

      {events.length === 0 ? (
        <p className="empty-note">The full schedule will be shared here soon.</p>
      ) : (
        <>
          <div className="agenda">
            <AnimatedReveal variant="draw" className="agenda-line-reveal">
              <span className="agenda-line" aria-hidden="true" />
            </AnimatedReveal>

            <ol className="agenda-list">
              {events.map((e, i) => (
                <AgendaItem key={e.id} event={e} index={i} />
              ))}
            </ol>
          </div>

          {/* Premises stroll callout sits cleanly below the agenda timeline */}
          <div className="mt-10 text-center max-w-md mx-auto p-4 rounded-xl bg-white/80 border border-[var(--color-gold)]/40 shadow-xs relative z-10">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-moss)]">
              <DecorativeFlower className="h-4 w-4" />
              <span>Campus Note</span>
              <DecorativeFlower className="h-4 w-4" petal="var(--color-sage-soft)" />
            </div>
            <p className="text-xs text-[var(--color-brown)] mt-1.5 leading-relaxed">
              P. T. Arulappa Hall is located directly within the Annai Velankanni Mini Basilica premises. No additional commute is needed after the Holy Mass.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
