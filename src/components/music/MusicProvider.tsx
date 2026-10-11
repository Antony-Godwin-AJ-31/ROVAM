"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type MusicStatus = "idle" | "playing" | "paused" | "error";

interface MusicContextValue {
  available: boolean;
  status: MusicStatus;
  play: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  available: false,
  status: "idle",
  play: () => {},
  toggle: () => {},
});

export function useMusic() {
  return useContext(MusicContext);
}

/**
 * Owns one lazily-created <audio>. Nothing is downloaded or played until a user gesture calls play().
 * A missing/unsupported file puts the control into a quiet "unavailable" state; the site is unaffected.
 */
export function MusicProvider({ src, children }: { src: string | null; children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<MusicStatus>("idle");

  const ensure = useCallback((): HTMLAudioElement | null => {
    if (!src) return null;
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "none";
      a.loop = true;
      a.volume = 0.5;
      a.addEventListener("error", () => setStatus("error"));
      a.src = src;
      audioRef.current = a;
    }
    return audioRef.current;
  }, [src]);

  const play = useCallback(() => {
    const a = ensure();
    if (!a) return;
    a.play()
      .then(() => setStatus("playing"))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus("error");
      });
  }, [ensure]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (a && !a.paused) {
      a.pause();
      setStatus("paused");
    } else {
      play();
    }
  }, [play]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({ available: Boolean(src), status, play, toggle }), [src, status, play, toggle]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
