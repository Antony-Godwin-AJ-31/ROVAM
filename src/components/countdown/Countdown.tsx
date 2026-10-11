"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "../../lib/date-time";

interface Props {
  /** Epoch ms of the event start (a real instant, derived on the server from date + time + IANA zone). */
  targetMs: number | null;
  dateLabel: string | null;
}

const DAY = 86_400_000;

export function Countdown({ targetMs, dateLabel }: Props) {
  // null until mounted: server and first client render are identical (no hydration mismatch, no wrong numbers).
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (targetMs === null) return;
    let id: number | undefined;

    const stop = () => {
      if (id !== undefined) {
        window.clearInterval(id);
        id = undefined;
      }
    };
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= targetMs) stop(); // event has begun: nothing left to count
    };
    const start = () => {
      if (id === undefined && Date.now() < targetMs) id = window.setInterval(tick, 1000);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tick(); // resync immediately after the tab was in the background
        start();
      } else {
        stop();
      }
    };

    tick();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetMs]);

  if (targetMs === null) {
    return (
      <p className="countdown-note">
        The exact date and start time are still being finalised. The countdown will appear here as soon as they are confirmed.
      </p>
    );
  }

  if (now !== null && now >= targetMs) {
    const sameDay = now - targetMs < DAY;
    return (
      <p className="countdown-note" role="status">
        {sameDay
          ? "Today is the day! The celebration has begun. ♥"
          : `We celebrated on ${dateLabel ?? "our wedding day"}. Thank you for being part of it.`}
      </p>
    );
  }

  const r = now === null ? null : getTimeRemaining(targetMs, now);
  const units = [
    { key: "days", label: "Days", value: r?.days, pad: false },
    { key: "hours", label: "Hours", value: r?.hours, pad: true },
    { key: "minutes", label: "Minutes", value: r?.minutes, pad: true },
    { key: "seconds", label: "Seconds", value: r?.seconds, pad: true },
  ] as const;

  const spoken = r ? `${r.days} days, ${r.hours} hours and ${r.minutes} minutes remaining` : "Calculating time remaining";

  return (
    <div role="timer" aria-label="Time remaining until the wedding" className="countdown">
      <p className="sr-only">{spoken}</p>
      <ul className="countdown-grid" aria-hidden="true">
        {units.map((u) => (
          <li key={u.key} className="countdown-unit countdown-unit-glow">
            <span className="countdown-value">
              {u.value === undefined ? (
                "––"
              ) : (
                <span key={u.value} className="tick flip-enter">
                  {u.pad ? String(u.value).padStart(2, "0") : u.value}
                </span>
              )}
            </span>
            <span className="countdown-label">{u.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
