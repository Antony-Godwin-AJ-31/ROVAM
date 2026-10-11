"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FloralCorner, HeartIcon, Sprig } from "../ui/Illustrations";
import { useMusic } from "../music/MusicProvider";
import { OPENED_KEY } from "../../lib/utils";

interface Props {
  heading: string;
  eyebrow: string;
  monogram: string;
  names: string;
  dateLabel: string | null;
  remember: boolean;
  onOpenComplete?: () => void;
}

/**
 * Full-screen invitation. The real page is rendered underneath at all times (so crawlers, no-JS visitors and
 * failures never see an empty site); this overlay just sits on top until opened or skipped.
 * Total open sequence ~1.4s: flap 0.5s -> card rises 0.5s -> fade 0.4s.
 */
// Golden Quill Pen illustration with gold gradient nib
function GoldenQuill() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M44 4C36 5 21 13 15 27C13 31 11 35 10 39L7 43L11 41C15 40 19 38 23 36C37 30 44 15 45 7C45 5 44 4 44 4Z"
        fill="url(#quillGoldGrad)"
      />
      <path
        d="M10 39L7 43L11 41L13 37L10 39Z"
        fill="#FFF2B2"
        stroke="#876019"
        strokeWidth="0.8"
      />
      <path
        d="M21 23C25 17 33 11 43 5"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="quillGoldGrad" x1="46" y1="4" x2="7" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDEAB2" />
          <stop offset="0.4" stopColor="#DFB251" />
          <stop offset="0.8" stopColor="#B88A2D" />
          <stop offset="1" stopColor="#7E5616" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type Phase = "closed" | "opening" | "zooming" | "done";

export function InvitationEnvelope({ heading, eyebrow, dateLabel, remember, onOpenComplete }: Props) {
  const music = useMusic();
  const [phase, setPhase] = useState<Phase>("closed");
  const timers = useRef<number[]>([]);
  const openBtn = useRef<HTMLButtonElement>(null);

  const finish = useCallback(
    (moveFocus: boolean) => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      document.documentElement.dataset.opened = "1";
      if (remember) {
        try {
          localStorage.setItem(OPENED_KEY, "1");
        } catch {
          /* storage unavailable: harmless */
        }
      }
      setPhase("done");
      onOpenComplete?.();
      if (moveFocus) document.getElementById("main")?.focus({ preventScroll: true });
    },
    [remember, onOpenComplete],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const active = phase !== "done";

  useEffect(() => {
    const site = document.getElementById("site");
    if (!site) return;
    site.toggleAttribute("inert", active);
    return () => site.removeAttribute("inert");
  }, [active]);

  useEffect(() => {
    if (phase === "closed") openBtn.current?.focus({ preventScroll: true });
  }, [phase]);

  const open = (withMusic: boolean) => {
    if (phase !== "closed") return;
    if (withMusic) music.play();
    setPhase("opening");
    // 1. Envelope opens on top (flap lifts, card rises, particles burst)
    // 2. Envelope zooms deeply into itself directly onto the website
    timers.current.push(
      window.setTimeout(() => setPhase("zooming"), 1100),
      window.setTimeout(() => finish(true), 1950),
    );
  };

  if (phase === "done") return null;

  const isOpen = phase !== "closed";
  const isZooming = phase === "zooming";
  const busy = phase === "zooming";

  return (
    <div className="gate" data-phase={phase} role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <FloralCorner className="gate-corner gate-corner--tl" />
      <FloralCorner className="gate-corner gate-corner--tr" />
      <FloralCorner className="gate-corner gate-corner--bl" />
      <FloralCorner className="gate-corner gate-corner--br" />

      <div className="gate-inner">
        <p className="font-script text-3xl text-moss md:text-4xl">{eyebrow}</p>
        <h2 id="gate-title" className="gate-title">{heading}</h2>
        <div className="flex items-center justify-center gap-3 -mt-5 mb-4 opacity-75 pointer-events-none" aria-hidden="true">
          <Sprig className="h-4 w-7 -rotate-12" />
          <HeartIcon className="h-4 w-4" />
          <Sprig className="h-4 w-7 scale-x-[-1] -rotate-12" />
        </div>

        <div className={`env ${isOpen ? "is-open" : ""} ${isZooming ? "is-zooming" : ""}`} data-zooming={isZooming}>
          <div className="env-body" />
          
          {/* Inner Stationery Card */}
          <div className="env-card" aria-hidden="true">
            <span className="env-card-script">
              <span className="ink-reveal ink-reveal--script">Save the Date</span>
            </span>

            <div className="env-card-names-wrap">
              <span className="env-card-names">
                <span className="ink-reveal ink-reveal--bride">Rovina</span>
              </span>
              <span className="env-card-amp">
                <span className="ink-reveal ink-reveal--amp">&amp;</span>
              </span>
              <span className="env-card-names">
                <span className="ink-reveal ink-reveal--groom">Amrish</span>
              </span>
            </div>

            {dateLabel && (
              <span className="env-card-date">
                <span className="ink-reveal ink-reveal--date">{dateLabel}</span>
              </span>
            )}
          </div>

          {/* Magical Self-Writing Quill Pen */}
          {isOpen && (
            <div className="magic-pen-wrap" aria-hidden="true">
              <GoldenQuill />
              <span className="pen-nib-sparkle" />
            </div>
          )}

          <svg className="env-front" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 0 L150 112 L0 200 Z" fill="#D3E1D1" />
            <path d="M300 0 L150 112 L300 200 Z" fill="#C9D8C7" />
            <path d="M0 200 L150 96 L300 200 Z" fill="#DEEBDE" />
          </svg>
          <div className="env-flap" aria-hidden="true" />
          <button type="button" className="env-seal" onClick={() => open(true)} disabled={isOpen} aria-label="Open the invitation">
            <HeartIcon className="h-6 w-6" fill="#FFF3EE" />
          </button>
          
          {isOpen && (
            <div className="burst" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <HeartIcon key={`h-${i}`} className="burst-heart" style={{ "--a": `${i * 45}deg` } as CSSProperties} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={`p-${i}`} className="burst-petal" style={{ "--a": `${i * 45 + 22.5}deg` } as CSSProperties} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={`s-${i}`} className="burst-star" style={{ "--a": `${i * 60 + 15}deg` } as CSSProperties} />
              ))}
            </div>
          )}
        </div>

        <div className="gate-actions">
          <button
            ref={openBtn}
            type="button"
            className="btn btn-primary px-8 py-3 text-base"
            onClick={() => open(true)}
            disabled={busy}
          >
            {phase === "opening" ? "Enter Celebration ✨" : "Open Invitation"}
          </button>
        </div>
        <button type="button" className="gate-skip" onClick={() => finish(true)}>
          Skip intro
        </button>
      </div>
    </div>
  );
}
