export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Offset (ms) of `timeZone` from UTC at the given instant. Throws RangeError for an unknown zone. */
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, number> = {};
  for (const part of dtf.formatToParts(new Date(utcMs))) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  const hour = p.hour === 24 ? 0 : p.hour;
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, hour, p.minute, p.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Converts a wall-clock date/time in a named IANA zone to a real instant (epoch ms).
 * Independent of the visitor's own time zone. Returns null for any invalid input.
 */
export function zonedTimeToInstant(date: string, time: string, timeZone: string): number | null {
  const d = DATE_RE.exec(date);
  const t = TIME_RE.exec(time);
  if (!d || !t) return null;
  const [y, mo, da] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const [h, mi] = [Number(t[1]), Number(t[2])];

  const wall = Date.UTC(y, mo - 1, da, h, mi);
  const check = new Date(wall);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== da) {
    return null; // e.g. 2027-02-30
  }
  try {
    const first = wall - tzOffsetMs(wall, timeZone);
    return wall - tzOffsetMs(first, timeZone); // second pass handles DST boundaries
  } catch {
    return null;
  }
}

export function isValidDateString(value: string | undefined): value is string {
  if (!value) return false;
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const [y, mo, da] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, da));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === da;
}

export function getEventInstant(event: { date?: string; time?: string; timeZone: string }): number | null {
  if (!event.date || !event.time) return null;
  return zonedTimeToInstant(event.date, event.time, event.timeZone);
}

/** Never returns negative values. `started` is true once now >= target. */
export function getTimeRemaining(targetMs: number, nowMs: number): TimeRemaining {
  const total = Math.max(0, targetMs - nowMs);
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    started: nowMs >= targetMs,
  };
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "Sunday 14 February 2027" – the calendar date as written, unaffected by the visitor's time zone.
 * Built by hand (not Intl) so server and browser always render identical text.
 */
export function formatEventDate(date: string | undefined): string | null {
  if (!isValidDateString(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday} ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "18:30" -> "6:30 PM". Returns null for malformed input. */
export function formatTime12(time: string | undefined): string | null {
  if (!time) return null;
  const m = TIME_RE.exec(time);
  if (!m) return null;
  const h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${suffix}`;
}
