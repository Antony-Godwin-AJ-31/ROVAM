"use client";

import { useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import type { PhotoAsset } from "../../types/wedding";
import { Photo } from "../ui/Photo";
import { CoupleIllustration, DecorativeFlower, Sprig } from "../ui/Illustrations";
import { MagicalPenWriter } from "./MagicalPenWriter";

interface Props {
  eyebrow: string;
  bride: string;
  groom: string;
  dateLabel: string | null;
  message: string[];
  photo?: PhotoAsset;
  illustrations: boolean;
  isReady?: boolean;
}

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroSection({ eyebrow, bride, groom, dateLabel, message, photo, illustrations, isReady }: Props) {
  const [namesWritten, setNamesWritten] = useState(false);

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      {illustrations && (
        <>
          <Sprig className="hero-deco hero-deco--a float" />
          <DecorativeFlower className="hero-deco hero-deco--b float-delayed" />
          <DecorativeFlower className="hero-deco hero-deco--c float" petal="var(--color-sage-soft)" />
        </>
      )}
      <div className="hero-grid">
        {/* Top: Save the Date & Magical Pen Writing for Bride and Groom */}
        <div className="hero-header text-center flex flex-col items-center">
          <p className="font-script text-2xl sm:text-4xl text-moss md:text-5xl">{eyebrow}</p>
          <div className="mt-0.5 sm:mt-1">
            <MagicalPenWriter
              bride={bride}
              groom={groom}
              isReady={isReady ?? false}
              onComplete={() => setNamesWritten(true)}
            />
          </div>
        </div>

        {/* Subsequent Hero Content: Fades in once names are written */}
        <div
          className={`w-full flex flex-col items-center gap-5 sm:gap-8 transition-all duration-1000 ease-out ${
            namesWritten ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >

        <div className="hero-media hero-enter hero-enter-enhanced relative max-w-sm sm:max-w-md w-full px-2" style={d(0.7)}>
          <div className="hero-royal-frame relative mx-auto w-full max-w-[22rem] sm:max-w-[24rem]">
            {/* Ornate Gold Crown Flourish on top */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-90 drop-shadow-[0_2px_4px_rgba(198,166,107,0.4)]">
              <svg width="72" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 2C32 2 28 9 20 10C12 11 4 7 4 7C4 7 10 14 16 16C22 18 29 16 32 19C35 16 42 18 48 16C54 14 60 7 60 7C60 7 52 11 44 10C36 9 32 2 32 2Z" fill="url(#goldCrownGrad)" stroke="#8C671C" strokeWidth="0.8" />
                <circle cx="32" cy="4" r="2.5" fill="#FFF4C4" stroke="#8C671C" strokeWidth="0.6" />
                <circle cx="16" cy="11" r="1.5" fill="#FFF4C4" />
                <circle cx="48" cy="11" r="1.5" fill="#FFF4C4" />
                <defs>
                  <linearGradient id="goldCrownGrad" x1="4" y1="2" x2="60" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDEAB2" />
                    <stop offset="0.5" stopColor="#DFB251" />
                    <stop offset="1" stopColor="#A67B1E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* The Photo Container with Bevelled Gold Matting */}
            <div className="hero-frame-inner relative overflow-hidden rounded-[2.5rem] p-2 sm:p-2.5 bg-gradient-to-b from-[#FFFDF8] via-[#FAF3E6] to-[#F5EBD7] shadow-[0_22px_55px_-12px_rgba(85,70,63,0.38),0_0_0_1.5px_rgba(198,166,107,0.6),0_0_35px_rgba(198,166,107,0.22)]">
              <div className="relative w-full aspect-[4/4.6] sm:aspect-[4/4.3] overflow-hidden rounded-[2.1rem] border-[2.5px] border-[#DFB251] shadow-inner bg-[#EAE0CD]">
                {photo ? (
                  <Photo
                    photo={photo}
                    priority
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 86vw"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="hero-arch-illustration">
                    <CoupleIllustration className="h-full w-auto" />
                  </div>
                )}
                {/* Subtle Inner Vignette for Rich Photography Contrast */}
                <div className="absolute inset-0 pointer-events-none rounded-[2.1rem] shadow-[inset_0_0_30px_rgba(45,30,20,0.18)]" />
              </div>

              {/* Bottom Subtle Golden Filigree Accent */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-85">
                <svg width="56" height="14" viewBox="0 0 48 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12C24 12 18 4 6 5C0 5.5 0 2 0 2C6 3 14 7 24 2C34 7 42 3 48 2C48 2 48 5.5 42 5C30 4 24 12 24 12Z" fill="#DFB251" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer text-center max-w-xl mx-auto space-y-4">
          {dateLabel && (
            <p className="hero-date hero-enter hero-enter-enhanced" style={d(0.85)}>
              <time>{dateLabel}</time>
            </p>
          )}
          <div className="hero-message hero-enter hero-enter-enhanced space-y-2" style={d(1.0)}>
            {message.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <a href="#countdown" className="hero-cue hero-enter hero-enter-enhanced" style={d(1.2)}>
            <span>Scroll</span>
            <ChevronDown aria-hidden="true" size={20} />
          </a>
        </div>
      </div>
    </div>
  </section>
  );
}
