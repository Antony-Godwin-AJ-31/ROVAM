import type { AgendaEvent, Venue, WeddingConfig } from "../types/wedding";
import { formatTime12, getEventInstant, isValidDateString } from "./date-time";

export interface NormalizedAgendaEvent extends AgendaEvent {
  timeLabel: string | null;
}

/** Drops malformed entries, de-duplicates ids and returns a deterministic order. */
export function normalizeAgenda(events: AgendaEvent[]): { events: NormalizedAgendaEvent[]; warnings: string[] } {
  const warnings: string[] = [];
  const seen = new Set<string>();
  const out: { ev: NormalizedAgendaEvent; index: number }[] = [];

  events.forEach((e, index) => {
    if (!e.id || !e.title?.trim()) {
      warnings.push(`Agenda entry #${index + 1} needs an id and a title; skipped.`);
      return;
    }
    if (seen.has(e.id)) {
      warnings.push(`Agenda id "${e.id}" is duplicated; later entry skipped.`);
      return;
    }
    seen.add(e.id);
    let timeLabel: string | null = null;
    let time = e.time;
    if (time !== undefined) {
      timeLabel = formatTime12(time);
      if (!timeLabel) {
        warnings.push(`Agenda "${e.id}" has an invalid time "${time}" (use HH:mm); shown as "Time to be confirmed".`);
        time = undefined;
      }
    }
    out.push({ ev: { ...e, time, timeLabel }, index });
  });

  out.sort((a, b) => {
    if (a.ev.time && b.ev.time) return a.ev.time.localeCompare(b.ev.time) || a.index - b.index;
    if (a.ev.time) return -1;
    if (b.ev.time) return 1;
    return a.index - b.index;
  });

  return { events: out.map((o) => o.ev), warnings };
}

export function hasVenue(v: Venue): boolean {
  return Boolean(v.name?.trim() || v.address?.trim());
}

function venueQuery(v: Venue): string | null {
  if (v.coordinates) return `${v.coordinates.lat},${v.coordinates.lng}`;
  const parts = [v.name, v.address, v.city, v.region, v.country].filter((p): p is string => Boolean(p?.trim()));
  return parts.length ? parts.join(", ") : null;
}

/** Keyless Google Maps directions link (works on mobile, opens the Maps app when installed). */
export function buildDirectionsUrl(v: Venue): string | null {
  if (v.directionsUrl) return v.directionsUrl;
  const q = venueQuery(v);
  return q ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}` : null;
}

export function buildEmbedUrl(v: Venue): string | null {
  if (v.embedUrl) return v.embedUrl;
  const q = venueQuery(v);
  return q ? `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed` : null;
}

/** Human-readable launch checklist, logged in development only. */
export function getConfigWarnings(config: WeddingConfig, agendaWarnings: string[] = []): string[] {
  const w = [...agendaWarnings];
  const { event, venue, assets } = config;
  if (!event.date) w.push("event.date is not set: countdown shows 'date to be announced'.");
  else if (!isValidDateString(event.date)) w.push(`event.date "${event.date}" is invalid (use YYYY-MM-DD).`);
  if (!event.time) w.push("event.time is not set: countdown cannot start.");
  if (event.date && event.time && getEventInstant(event) === null) {
    w.push("event date/time/timeZone could not be converted to a valid instant.");
  }
  if (!hasVenue(venue)) w.push("venue is not set: venue section shows 'to be announced'.");
  if (venue.name && !venue.address) w.push("venue.address missing: directions will use the venue name only; verify the pin.");
  if (!assets.hero) w.push("assets.hero is not set: illustrated hero is shown.");
  if (!config.couple.bride.portrait || !config.couple.groom.portrait) w.push("Bride/groom portraits missing: monogram frames shown.");
  if (config.features.music && !assets.music) w.push("assets.music not set: music control is hidden.");
  if (!assets.ogImage) w.push("assets.ogImage not set: no social preview image.");
  return w;
}
