# Save the Date — wedding invitation website

A static-first Next.js (App Router) + TypeScript + Tailwind v4 site: animated envelope opening, hero,
live countdown, couple profiles, story, gallery with lightbox, wedding-day timeline, venue map + directions,
guest info, optional music. **No backend, no database, no RSVP, no tracking.**

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```
Node 20+.

## Personalise it (edit data, not components)

| What | File |
|---|---|
| Names, date, time, time zone, venue, photos, music, copy, feature flags | `src/config/wedding.ts` |
| Wedding-day schedule | `src/data/agenda.ts` |
| Gallery photos | `src/data/gallery.ts` |
| Relationship milestones | `src/data/story.ts` |

Everything is optional. Anything missing shows a tidy "coming soon" state or hides itself — nothing is invented.
In development the terminal prints a `[wedding config]` checklist of what is still missing.

**Date & time zone.** Set `event.date` (`YYYY-MM-DD`), `event.time` (`HH:mm`, 24h) and `event.timeZone`
(IANA, default `Asia/Kolkata`). The site converts that wall-clock time to the real instant in that zone, so the
countdown is identical for every visitor wherever they are. Both date and time are required for the countdown.

**Photos.** Put files in `public/images/` (WebP/AVIF, ~1600px on the long edge) and reference them with their true
`width`/`height` (prevents layout shift) and meaningful `alt` text. Use `objectPosition` (e.g. `"50% 20%"`) to keep
faces in frame when cropped. Hero: portrait ~4:5 works best.

**Venue.** Fill `venue.address` (+ name/city). "Get Directions" and the map are generated from it. For a precise pin,
open the exact place in Google Maps → Share → *Embed a map* and paste the `src` into `venue.embedUrl`; paste a share
link into `venue.directionsUrl`. **Check the pin lands on the actual entrance before launch.** No API key needed.

**Music.** Add a file you have the rights to use at `public/audio/wedding-instrumental.mp3`, then set
`assets.music: "/audio/wedding-instrumental.mp3"`. Without it the music UI is hidden. Nothing downloads or plays
until a guest chooses to. No audio file is bundled (none could be licensed here).

**Intro.** `features.rememberOpened` skips the envelope on return visits (flag stored only in the visitor's own
browser, key `std-opened`). To replay while testing: clear site data, or set the flag to `false`.

## Deploy to Vercel

1. `npm install` (creates `package-lock.json` — commit it), then `npm run build` locally.
2. `git init && git add . && git commit -m "Save the date"` and push to a new GitHub repo.
3. vercel.com → **Add New… → Project** → import the repo. Framework is auto-detected (Next.js). Deploy.
4. Open the preview URL and run the launch checklist below.
5. Optional: *Settings → Domains* to attach a custom domain. Optionally set `NEXT_PUBLIC_SITE_URL` to it.

No environment variables are required.

## Testing summary

Run here (sandbox without npm registry access):
- ✅ `npm test`: 13 unit tests (time-zone conversion incl. IST and DST zones, invalid dates/zones, countdown
  maths, <1 day, <1 min, exact start, already passed, no negatives, agenda ordering/validation, map URLs).
  Passed under four different machine time zones (UTC, Los Angeles, Auckland, Kolkata).
- ✅ Strict `tsc` on the logic/config/data layer. ✅ Syntax parse of all 34 source files. ✅ No unused imports/locals.
- ✅ Server-render smoke test of the countdown (placeholder, no wrong numbers pre-hydration).

**Not run (needs installed dependencies / a browser):** `next build`, `next lint`, full project type-check,
browser tests, Lighthouse, real-device checks, and every visual/interaction behaviour (envelope sequence,
lightbox, music, responsive layouts). The code is written to those requirements but is **unverified in a browser**.
Do the checklist below on your first run.

## First-run & launch checklist

- [ ] `npm install && npm run lint && npm run typecheck && npm test && npm run build` all pass
- [ ] Envelope opens by click, tap, Enter/Space; "Skip intro" works; reload skips intro
- [ ] Countdown shows the right numbers for your date/time/zone; tab away and back resyncs
- [ ] 320 px → 1440 px: no horizontal scroll, nothing overlapping, faces not cropped
- [ ] Gallery: open, ←/→, swipe, Esc, focus returns to the photo
- [ ] Directions opens the right place; map pin is on the entrance
- [ ] Music plays/pauses; renaming the file shows the quiet "unavailable" state
- [ ] OS "reduce motion" on: content identical, no movement
- [ ] Keyboard-only pass; run Lighthouse on the preview URL

## Still needed from the couple

Names (currently "Bride"/"Groom"), confirmed date + start time, venue name/address/map pin, real photos
(hero, portraits, gallery, story), confirmed schedule, optional dress code / parking / stay info,
licensed music file, preview image for link sharing (`assets.ogImage`), and permission before publishing any
phone numbers or private addresses. Search-engine indexing is **off** by default (`seo.allowIndexing`).

## Notes on choices

- No animation library: reveals, envelope and countdown use CSS transitions + IntersectionObserver, so content is
  always visible if scripts fail, and the bundle stays small. Reduced-motion is honoured in CSS and JS.
- Time-zone maths uses native `Intl` (no `date-fns-tz` dependency) and is covered by tests.
- Dates are formatted by hand, not `Intl`, because ICU punctuation differs between Node and browsers and would
  cause hydration mismatches.
- Map uses Google's keyless embed/directions URLs. Loading the embed makes requests to Google.
