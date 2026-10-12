"use client";

import { useState, useEffect } from "react";
import { wedding } from "../config/wedding";
import { agenda } from "../data/agenda";
import { story } from "../data/story";
import { getConfigWarnings, hasVenue, normalizeAgenda } from "../lib/content";
import { formatEventDate, formatTime12, getEventInstant } from "../lib/date-time";
import { initial } from "../lib/utils";

import { InvitationEnvelope } from "../components/invitation/InvitationEnvelope";
import { MusicProvider } from "../components/music/MusicProvider";
import { MusicControl } from "../components/music/MusicControl";
import { SiteNavigation, type NavItem } from "../components/navigation/SiteNavigation";
import { HeroSection } from "../components/hero/HeroSection";
import { Countdown } from "../components/countdown/Countdown";
import { CoupleProfiles } from "../components/couple/CoupleProfiles";
import { OurStory } from "../components/story/OurStory";
import { WeddingAgenda } from "../components/agenda/WeddingAgenda";
import { VenueSection } from "../components/venue/VenueSection";
import { GuestInformation } from "../components/information/GuestInformation";
import { ClosingSection } from "../components/closing/ClosingSection";
import { SectionHeading } from "../components/ui/SectionHeading";
import { CoupleIllustration, CrescentMoon } from "../components/ui/Illustrations";

// Enhance with interactive effects
import { SmoothScroll } from "../components/effects/SmoothScroll";
import { FloatingDecorations } from "../components/effects/FloatingDecorations";
import { SparkleTrail } from "../components/effects/SparkleTrail";
import { ScrollProgress } from "../components/effects/ScrollProgress";
import { WaveDivider } from "../components/effects/WaveDivider";
import { AddToCalendar } from "../components/ui/AddToCalendar";
import { ScrollFadeSection } from "../components/effects/ScrollFadeSection";

export default function Page() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.dataset.opened === "1") {
      setEnvelopeOpened(true);
    }
  }, []);
  const { couple, event, venue, assets, content, features } = wedding;
  const bride = couple.bride.name;
  const groom = couple.groom.name;
  const names = `${bride} & ${groom}`;
  const monogram = couple.monogram ?? `${initial(bride)} & ${initial(groom)}`;

  const targetMs = getEventInstant(event);
  const dateLabel = formatEventDate(event.date);
  const timeLabel = formatTime12(event.time);
  const { events: agendaEvents, warnings: agendaWarnings } = normalizeAgenda(agenda);

  if (process.env.NODE_ENV !== "production") {
    for (const w of getConfigWarnings(wedding, agendaWarnings)) console.warn(`[wedding config] ${w}`);
  }

  const musicSrc = features.music && assets.music ? assets.music : null;
  const showStory = features.story && story.length > 0;

  const infoRows = features.information
    ? [
        ...(dateLabel ? [{ id: "date", icon: "date" as const, label: "Date", value: dateLabel }] : []),
        ...(timeLabel ? [{ id: "time", icon: "time" as const, label: "Begins at", value: `${timeLabel} (local time)` }] : []),
        ...(hasVenue(venue)
          ? [{ id: "place", icon: "place" as const, label: "Venue", value: [venue.name, venue.address].filter(Boolean).join(", ") }]
          : []),
        ...content.extraInfo.map((i) => ({ ...i, icon: i.icon ?? ("info" as const) })),
      ]
    : [];

  const nav: NavItem[] = [
    { href: "#countdown", label: "Countdown" },
    ...(showStory ? [{ href: "#story", label: "Our Story" }] : []),
    { href: "#couple", label: "Us" },
    { href: "#venue", label: "Where We Unite" },
    { href: "#agenda", label: "Schedule" },
    ...(infoRows.length ? [{ href: "#info", label: "Details" }] : []),
  ];

  return (
    <MusicProvider src={musicSrc}>
      <SmoothScroll />
      <FloatingDecorations />
      <SparkleTrail />
      <ScrollProgress />
      
      <InvitationEnvelope
        heading={content.envelopeHeading}
        eyebrow="You're invited"
        monogram={monogram}
        names={names}
        dateLabel={dateLabel}
        remember={features.rememberOpened}
        onOpenComplete={() => setEnvelopeOpened(true)}
      />

      <div id="site">
        <SiteNavigation brand={monogram} items={nav} />
        <main id="main" tabIndex={-1}>
          {/* 1. Hero & Couple Introduction */}
          <ScrollFadeSection initialInView={true}>
            <HeroSection
              eyebrow={content.heroEyebrow}
              bride={bride}
              groom={groom}
              dateLabel={dateLabel}
              message={content.inviteMessage}
              photo={assets.hero}
              illustrations={features.illustrations}
              isReady={envelopeOpened}
            />
          </ScrollFadeSection>
          
          <WaveDivider variant="floral" colorFrom="var(--color-ivory)" colorTo="var(--color-sage-soft)" />

          {/* 2. Live Wedding Countdown */}
          <ScrollFadeSection>
            <section id="countdown" className="section section--sage relative overflow-hidden" aria-labelledby="countdown-title">
              <div className="absolute top-8 right-8 hidden sm:block opacity-80 pointer-events-none float">
                <CrescentMoon className="h-14 w-14" />
              </div>
              <div className="absolute bottom-8 left-8 hidden sm:block opacity-60 pointer-events-none float-delayed">
                <CrescentMoon className="h-10 w-10 rotate-45" />
              </div>

              <SectionHeading id="countdown-title" eyebrow="Counting down" title="Until We Say “I Do”" intro={dateLabel ?? "Date to be announced"} />
              <Countdown targetMs={targetMs} dateLabel={dateLabel} />
              <div className="mt-8 flex justify-center">
                <AddToCalendar variant="primary" />
              </div>
              {features.illustrations && <CoupleIllustration className="mx-auto mt-10 h-36 w-auto opacity-95" />}
            </section>
          </ScrollFadeSection>

          {/* 3. Our Story */}
          {showStory && (
            <ScrollFadeSection>
              <WaveDivider variant="curve" colorFrom="var(--color-sage-soft)" colorTo="var(--color-paper)" />
              <OurStory milestones={story} />
              <WaveDivider variant="curve" colorFrom="var(--color-paper)" colorTo="var(--color-ivory)" flip />
            </ScrollFadeSection>
          )}

          {/* 4. Selected Photographs / Couple Profiles */}
          <ScrollFadeSection>
            <CoupleProfiles bride={couple.bride} groom={couple.groom} illustrations={features.illustrations} />
          </ScrollFadeSection>
          
          <WaveDivider variant="curve" colorFrom="var(--color-ivory)" colorTo="var(--color-paper)" />
          
          {/* 5. Where We Unite (Church, Reception & Venue Details) */}
          <ScrollFadeSection>
            <VenueSection venue={venue} />
          </ScrollFadeSection>
          
          <WaveDivider variant="floral" colorFrom="var(--color-ivory)" colorTo="var(--color-paper)" />

          {/* 7. Wedding-Day Timeline / Schedule */}
          <ScrollFadeSection>
            <WeddingAgenda events={agendaEvents} dateLabel={dateLabel} />
          </ScrollFadeSection>
          <WaveDivider variant="wave" colorFrom="var(--color-paper)" colorTo="var(--color-ivory)" flip />

          {/* 8. Good to Know / Guest Information */}
          {infoRows.length > 0 && (
            <ScrollFadeSection>
              <GuestInformation rows={infoRows} />
              <WaveDivider variant="curve" colorFrom="var(--color-paper)" colorTo="var(--color-ivory)" flip />
            </ScrollFadeSection>
          )}
          
          {/* 9. Closing Message & Celestial Scene */}
          <ScrollFadeSection>
            <ClosingSection
              message={content.closingMessage}
              names={names}
              dateLabel={dateLabel}
              photo={assets.closing}
              illustrations={features.illustrations}
              secretNote={features.surprises ? content.secretNote : undefined}
            />
          </ScrollFadeSection>
        </main>
        <footer className="site-footer">
          <p>{names}{dateLabel ? ` · ${dateLabel}` : ""}</p>
        </footer>
      </div>

      <MusicControl />
    </MusicProvider>
  );
}
