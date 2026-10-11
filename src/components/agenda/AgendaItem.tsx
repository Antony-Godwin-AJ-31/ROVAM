import { Camera, Clock, DoorOpen, GlassWater, MapPin, Music, Sparkles, Utensils, Church, type LucideIcon } from "lucide-react";
import type { AgendaIcon } from "../../types/wedding";
import type { NormalizedAgendaEvent } from "../../lib/content";
import { AnimatedReveal } from "../ui/AnimatedReveal";

const ICONS: Record<AgendaIcon, LucideIcon> = {
  arrival: DoorOpen,
  ceremony: Church, // Church icon for Holy Mass
  ritual: Sparkles,
  photos: Camera,
  meal: Utensils,
  reception: GlassWater,
  celebration: Music,
  other: Clock,
};

export function AgendaItem({ event, index }: { event: NormalizedAgendaEvent; index: number }) {
  const Icon = ICONS[event.icon ?? "other"];
  const isCeremony = event.icon === "ceremony";

  return (
    <li className="agenda-item" data-side={index % 2 ? "right" : "left"}>
      <span
        className={`agenda-marker transition-transform duration-300 hover:scale-110 ${
          isCeremony ? "border-[var(--color-rose)] text-[var(--color-rose)]" : "border-[var(--color-gold)] text-[var(--color-gold)]"
        }`}
        aria-hidden="true"
      >
        <Icon size={20} />
      </span>

      <AnimatedReveal delay={index * 120} className="agenda-card glow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-gold)]/20 pb-2 mb-2">
          <p className="agenda-time font-bold tracking-widest text-[var(--color-moss)]">
            {event.timeLabel ? (
              <time dateTime={event.time} className="px-2.5 py-0.5 rounded-full bg-[var(--color-sage-soft)]/50 border border-[var(--color-sage)]/30 text-xs">
                {event.timeLabel}
              </time>
            ) : (
              <span>Time to be confirmed</span>
            )}
          </p>
          <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--color-brown)]/70">
            {isCeremony ? "Sacrament of Matrimony" : "Evening Celebration"}
          </span>
        </div>

        <h3 className="agenda-title text-2xl font-serif text-[var(--color-ink)] font-medium">
          {event.title}
        </h3>

        {event.description && <p className="agenda-desc text-sm mt-1 leading-relaxed text-[var(--color-brown)]">{event.description}</p>}

        {event.venue && (
          <p className="agenda-venue font-medium text-xs text-[var(--color-moss)] mt-3">
            <MapPin aria-hidden="true" size={14} className="text-[var(--color-rose)] flex-shrink-0" />
            <span>{event.venue}</span>
          </p>
        )}

        {event.note && (
          <p className="agenda-note text-xs mt-2 italic text-[var(--color-brown)]/85 bg-[var(--color-ivory)] px-3 py-1.5 rounded-md border border-[var(--color-gold)]/25">
            {event.note}
          </p>
        )}
      </AnimatedReveal>
    </li>
  );
}
