import type { AgendaEvent } from "../types/wedding";

/**
 * Wedding-day schedule. Add only CONFIRMED events.
 * `time` is 24-hour "HH:mm" in the event time zone; omit it for "Time to be confirmed".
 * Order on the page is by time (unconfirmed last), then by the order listed here.
 */
export const agenda: AgendaEvent[] = [
  {
    id: "holy-mass",
    time: "16:30",
    title: "Holy Mass",
    venue: "Annai Velankanni Mini Basilica, Besant Nagar",
    description: "Join the couple and their families for the wedding Mass as Rovina and Amrish exchange their vows.",
    icon: "ceremony",
    note: "Begins promptly at 4:30 PM IST",
  },
  {
    id: "wedding-reception",
    time: "18:00",
    title: "Wedding Reception",
    venue: "P. T. Arulappa Hall (Within church premises)",
    description: "Celebrate the newlyweds with an evening of blessings, joy, family, and friends.",
    icon: "reception",
    note: "Located within the same church premises — just steps away",
  },
];
