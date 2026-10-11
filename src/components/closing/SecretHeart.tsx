"use client";

import { useId, useState } from "react";
import { HeartIcon } from "../ui/Illustrations";

/** A small optional surprise. The note is never required information. */
export function SecretHeart({ note }: { note: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="secret">
      <button
        type="button"
        className="secret-btn"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Hide the little note" : "Reveal a little note"}
        onClick={() => setOpen((o) => !o)}
        data-open={open}
      >
        <HeartIcon className="h-9 w-9" />
      </button>
      <p id={id} className="secret-note" hidden={!open} role="status">
        {note}
      </p>
    </div>
  );
}
