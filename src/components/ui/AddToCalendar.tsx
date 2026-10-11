"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

interface AddToCalendarProps {
  className?: string;
  variant?: "primary" | "secondary" | "subtle";
}

export function AddToCalendar({ className = "", variant = "secondary" }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Esc
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Event details
  const title = "Wedding of Rovina & Amrish";
  const description =
    "Join Rovina & Amrish as they celebrate their Holy Matrimony with Holy Mass at 4:30 PM in Annai Velankanni Mini Basilica, Besant Nagar, Chennai. Reception to follow at 6:00 PM in P. T. Arulappa Hall (within church premises).";
  const location = "Annai Velankanni Mini Basilica, Besant Nagar, Chennai, Tamil Nadu, India";

  // Google Calendar URL (2026-11-11 16:30 IST is 11:00 UTC)
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=20261111T110000Z/20261111T160000Z&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Download .ics for Apple Calendar, Outlook, and mobile calendar apps
  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Rovina and Amrish Wedding//Save the Date//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:wedding-rovina-amrish-20261111@savethedate",
      "DTSTAMP:20261111T000000Z",
      "DTSTART:20261111T110000Z",
      "DTEND:20261111T160000Z",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Wedding of Rovina & Amrish tomorrow!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding-rovina-and-amrish.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      setOpen(false);
    }, 1200);
  };

  const btnClasses =
    variant === "primary"
      ? "btn btn-primary"
      : "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide border border-[var(--color-gold)] bg-white/90 text-[var(--color-brown)] hover:bg-[var(--color-paper)] transition-all shadow-xs";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={btnClasses}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Add wedding to your calendar"
      >
        <Calendar size={16} className="text-[var(--color-rose)]" aria-hidden="true" />
        <span>Add to Calendar</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[var(--color-gold)]/40 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-[var(--color-gold)]/20 mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-moss)]">
              11 Nov 2026 • 4:30 PM
            </p>
          </div>

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[var(--color-ink)] rounded-xl hover:bg-[var(--color-paper)] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[10px]">
              G
            </span>
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={downloadIcs}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[var(--color-ink)] rounded-xl hover:bg-[var(--color-paper)] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
              {downloaded ? <Check size={12} /> : ""}
            </span>
            <span>{downloaded ? "Downloaded!" : "Apple Calendar (.ics)"}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={downloadIcs}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[var(--color-ink)] rounded-xl hover:bg-[var(--color-paper)] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px]">
              O
            </span>
            <span>Outlook / iCal</span>
          </button>
        </div>
      )}
    </div>
  );
}
