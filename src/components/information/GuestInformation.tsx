import { CalendarHeart, Car, Clock, CloudSun, Hotel, Info, MapPin, Phone, Shirt, type LucideIcon } from "lucide-react";
import type { InfoIcon, InfoItem } from "../../types/wedding";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<InfoIcon | "date" | "time" | "place", LucideIcon> = {
  dress: Shirt,
  parking: Car,
  stay: Hotel,
  weather: CloudSun,
  contact: Phone,
  info: Info,
  date: CalendarHeart,
  time: Clock,
  place: MapPin,
};

interface Row extends Omit<InfoItem, "icon"> {
  icon: keyof typeof ICONS;
}

export function GuestInformation({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section id="info" className="section section--paper" aria-labelledby="info-title">
      <SectionHeading id="info-title" eyebrow="Good to know" title="Guest Information" />
      <ul className="info-grid">
        {rows.map((r, i) => {
          const Icon = ICONS[r.icon];
          return (
            <li key={r.id}>
              <AnimatedReveal delay={(i % 3) * 80} className="info-card glow-card gradient-border">
                <span className="info-icon" aria-hidden="true"><Icon size={22} /></span>
                <h3 className="info-label">{r.label}</h3>
                <p className="info-value">{r.value}</p>
              </AnimatedReveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
