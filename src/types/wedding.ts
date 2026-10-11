/** A real photograph supplied by the couple. width/height are intrinsic pixel size (used to reserve layout space). */
export interface PhotoAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, e.g. "50% 20%" to keep faces in frame when cropped. */
  objectPosition?: string;
}

export interface Person {
  name: string;
  portrait?: PhotoAsset;
  description?: string;
  /** A small personal detail, e.g. "Loves: filter coffee". */
  detail?: string;
}

export type AgendaIcon =
  | "arrival"
  | "ceremony"
  | "ritual"
  | "photos"
  | "meal"
  | "reception"
  | "celebration"
  | "other";

export interface AgendaEvent {
  id: string;
  /** 24-hour "HH:mm" in the event time zone. Omit if not confirmed. */
  time?: string;
  title: string;
  description?: string;
  venue?: string;
  note?: string;
  icon?: AgendaIcon;
}

export interface StoryMilestone {
  id: string;
  dateLabel?: string;
  title: string;
  text: string;
  /** Short handwritten-style caption shown under the photo. */
  caption?: string;
  photo?: PhotoAsset;
}

export interface GalleryPhoto extends PhotoAsset {
  id: string;
  caption?: string;
}

export type InfoIcon = "dress" | "parking" | "stay" | "weather" | "contact" | "info";

export interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon?: InfoIcon;
}

export interface Venue {
  name?: string;
  /** Full, verified street address. */
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  /** Verified coordinates of the actual entrance/building. */
  coordinates?: { lat: number; lng: number };
  /** Overrides the auto-built directions link (e.g. a share link to the exact place). */
  directionsUrl?: string;
  /** Overrides the auto-built map embed (paste the src from Google Maps > Share > Embed a map). */
  embedUrl?: string;
  landmark?: string;
  parking?: string;
}

export interface WeddingConfig {
  couple: {
    bride: Person;
    groom: Person;
    /** Defaults to the initials, e.g. "B & G". */
    monogram?: string;
  };
  event: {
    /** "YYYY-MM-DD" in the event's local calendar. */
    date?: string;
    /** "HH:mm" local 24-hour start time. */
    time?: string;
    /** IANA time zone the date/time are expressed in. */
    timeZone: string;
  };
  venue: Venue;
  assets: {
    hero?: PhotoAsset;
    closing?: PhotoAsset;
    /** Path under /public, e.g. "/audio/wedding-instrumental.mp3". Must be licensed for use. */
    music?: string;
    /** Absolute-path image under /public used for link previews (1200x630 recommended). */
    ogImage?: string;
  };
  content: {
    envelopeHeading: string;
    heroEyebrow: string;
    inviteMessage: string[];
    closingMessage: string[];
    /** Revealed when a guest taps the little heart in the closing section. */
    secretNote?: string;
    extraInfo: InfoItem[];
  };
  features: {
    music: boolean;
    illustrations: boolean;
    surprises: boolean;
    story: boolean;
    information: boolean;
    /** Skip the envelope on return visits (stored only in the visitor's browser). */
    rememberOpened: boolean;
  };
  seo: {
    description?: string;
    /** Public wedding sites are hidden from search engines unless this is true. */
    allowIndexing: boolean;
  };
}
