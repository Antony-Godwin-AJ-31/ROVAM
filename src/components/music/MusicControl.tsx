"use client";

import { Play, Pause, VolumeX } from "lucide-react";
import { useMusic } from "./MusicProvider";

export function MusicControl() {
  const { available, status, toggle } = useMusic();
  if (!available) return null;

  const playing = status === "playing";
  const failed = status === "error";
  const label = failed ? "Music unavailable" : playing ? "Pause music" : "Play music";

  return (
    <button
      type="button"
      className="music-control"
      onClick={toggle}
      disabled={failed}
      aria-label={label}
      aria-pressed={failed ? undefined : playing}
      title={label}
      data-playing={playing}
    >
      {failed ? (
        <VolumeX aria-hidden="true" size={20} />
      ) : playing ? (
        <>
          <Pause aria-hidden="true" size={18} />
          <span className="music-bars" aria-hidden="true">
            <i /><i /><i />
          </span>
        </>
      ) : (
        <Play aria-hidden="true" size={18} className="translate-x-0.5" />
      )}
    </button>
  );
}
