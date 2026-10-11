import type { StoryMilestone } from "../types/wedding";

/**
 * Relationship story milestones using the couple's supplied photographs.
 * These milestones celebrate their journey without inventing false dates or facts.
 */
export const story: StoryMilestone[] = [
  {
    id: "chapter-1",
    dateLabel: "The Journey Begins",
    title: "When Two Paths Met",
    text: "From our earliest conversations to discovering all that we share in common, every step brought us closer to the home we found in one another.",
    caption: "where forever began",
    photo: {
      src: "/photos/bride-and-groom/WhatsApp%20Image%202026-10-11%20at%2000.01.53.jpeg",
      alt: "Rovina and Amrish together",
      width: 559,
      height: 1024,
    },
  },
  {
    id: "chapter-2",
    dateLabel: "Growing in Love",
    title: "Laughter & Friendship",
    text: "Building a foundation of kindness, laughter, and unwavering companionship, with gratitude for all the blessings along the way.",
    caption: "hand in hand",
    photo: {
      src: "/photos/bride-and-groom/WhatsApp%20Image%202026-10-11%20at%2000.01.54.jpeg",
      alt: "Rovina and Amrish sharing a warm smile",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "chapter-3",
    dateLabel: "Our Forever",
    title: "Beginning Our Next Chapter",
    text: "Looking forward with joyous hearts to 11 November 2026, when we unite before God, family, and loved ones in holy matrimony.",
    caption: "our next chapter",
    photo: {
      src: "/photos/bride-and-groom/Next%20chapter.JPG",
      alt: "Rovina and Amrish together in celebration",
      width: 960,
      height: 1280,
    },
  },
];
