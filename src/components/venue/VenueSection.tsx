import { Church, Sparkles, Navigation, MapPin } from "lucide-react";
import type { Venue } from "../../types/wedding";
import { buildDirectionsUrl, buildEmbedUrl, hasVenue } from "../../lib/content";
import { AnimatedReveal } from "../ui/AnimatedReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ChurchIllustration, BotanicalFrame } from "../ui/Illustrations";
import { AddToCalendar } from "../ui/AddToCalendar";
import { VenueMap } from "./VenueMap";

export function VenueSection({ venue }: { venue: Venue }) {
  const known = hasVenue(venue);
  const directions = buildDirectionsUrl(venue);
  const embed = buildEmbedUrl(venue);
  const locality = [venue.city, venue.region, venue.country].filter(Boolean).join(", ");

  return (
    <section id="venue" className="section relative" aria-labelledby="venue-title">
      <SectionHeading
        id="venue-title"
        eyebrow="Ceremony & Celebration"
        title="Where We Unite"
        intro="Both the Holy Mass and the evening celebration will take place within the blessed grounds of Annai Velankanni Mini Basilica, Besant Nagar."
      />

      <div className="flex justify-center -mt-6 mb-10">
        <BotanicalFrame className="h-8 w-64 opacity-80" />
      </div>

      {!known ? (
        <p className="empty-note">The venue details will be shared here soon.</p>
      ) : (
        <div className="venue gap-8">
          <AnimatedReveal className="venue-details space-y-6">
            {/* Church architectural motif */}
            <div className="mx-auto w-full max-w-sm rounded-2xl p-4 bg-white/70 shadow-sm border border-[var(--color-gold)]/40 text-center">
              <ChurchIllustration className="mx-auto h-36 w-auto" />
              <p className="font-script text-2xl text-[var(--color-moss)] mt-2">Annai Velankanni Mini Basilica</p>
              <p className="text-xs uppercase tracking-widest text-[var(--color-brown)] font-semibold">Besant Nagar, Chennai</p>
            </div>

            {/* Venue locations card */}
            <div className="space-y-4">
              <div className="rounded-xl p-4 bg-white/80 border border-[var(--color-sage-soft)] shadow-sm">
                <div className="flex items-center gap-2 text-[var(--color-moss)] font-semibold text-sm">
                  <Church size={18} />
                  <span>Wedding Mass • 4:00 PM</span>
                </div>
                <h3 className="font-serif text-2xl text-[var(--color-ink)] mt-1 font-medium">{venue.name}</h3>
                <address className="venue-address text-sm mt-1 not-italic text-[var(--color-brown)]">
                  <span>{venue.address}</span>
                  <span>{locality}</span>
                </address>
              </div>

              <div className="rounded-xl p-4 bg-white/80 border border-[var(--color-blush)] shadow-sm">
                <div className="flex items-center gap-2 text-[var(--color-rose)] font-semibold text-sm">
                  <Sparkles size={18} />
                  <span>Wedding Reception • 6:30 PM</span>
                </div>
                <h3 className="font-serif text-2xl text-[var(--color-ink)] mt-1 font-medium">P. T. Arulappa Hall</h3>
                <p className="text-sm text-[var(--color-brown)] mt-1">
                  Located comfortably within the church campus. Guests can simply take a gentle stroll across the premises after Mass.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {directions && (
                <a
                  className="btn btn-primary w-full sm:w-auto"
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation aria-hidden="true" size={18} /> Get Directions to Basilica
                  <span className="sr-only"> (opens Google Maps in a new tab)</span>
                </a>
              )}
              <AddToCalendar variant="secondary" />
            </div>
          </AnimatedReveal>

          {embed && (
            <AnimatedReveal delay={120} className="venue-map-wrap">
              <div className="relative">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-xs font-medium text-[var(--color-brown)] shadow-md border border-[var(--color-gold)]/40 pointer-events-none">
                  <MapPin size={13} className="text-[var(--color-rose)]" />
                  <span>Besant Nagar, Chennai</span>
                </div>
                <VenueMap src={embed} title={`Map showing ${venue.name ?? "the wedding venue"}`} />
              </div>
            </AnimatedReveal>
          )}
        </div>
      )}
    </section>
  );
}
