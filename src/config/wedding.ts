import type { WeddingConfig } from "../types/wedding";

/**
 * ============================================================
 *  EDIT THIS FILE to personalise the site. No component edits needed.
 *  Anything left out shows a tidy "coming soon" state or hides itself;
 *  nothing is invented on your behalf.
 * ============================================================
 */
export const wedding: WeddingConfig = {
  couple: {
    bride: {
      name: "Rovina",
      portrait: { src: "/images/couple/bride.jpg", alt: "Portrait of Rovina, the bride", width: 9504, height: 6336, objectPosition: "50% 20%" },
    },
    groom: {
      name: "Amrish",
      portrait: { src: "/images/couple/groom.jpg", alt: "Portrait of Amrish, the groom", width: 9504, height: 6336, objectPosition: "50% 20%" },
    },
    monogram: "R & A",
  },

  event: {
    date: "2026-11-11",
    time: "16:00",
    timeZone: "Asia/Kolkata",
  },

  venue: {
    name: "Annai Velankanni Mini Basilica",
    address: "Besant Nagar",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    landmark: "Reception at P. T. Arulappa Hall (within the church premises)",
    embedUrl: "https://maps.google.com/maps?q=Annai+Velankanni+Shrine+Besant+Nagar+Chennai&z=16&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Annai+Velankanni+Shrine+Besant+Nagar+Chennai",
  },

  assets: {
    hero: { src: "/images/couple/hero.jpg", alt: "Rovina and Amrish - Save the Date", width: 9504, height: 6336, objectPosition: "50% 25%" },
    closing: { src: "/images/couple/closing.jpg", alt: "The couple", width: 1600, height: 1067 },
    music: "/audio/wedding-music.mp3",
  },

  content: {
    envelopeHeading: "A Little Invitation to Our Forever",
    heroEyebrow: "Save the Date",
    inviteMessage: [
      "For the two of us, home isn't a place.",
      "It is a person.",
      "And we are finally home."
    ],
    closingMessage: [
      "One beautiful day.",
      "Two people.",
      "A lifetime ahead.",
      "We can't wait to celebrate with you.",
    ],
    secretNote: "Thank you for being part of our story.",
    extraInfo: [],
  },

  features: {
    music: true,
    illustrations: true,
    surprises: true,
    story: true,
    information: true,
    rememberOpened: false,
  },

  seo: {
    allowIndexing: false,
  },
};
