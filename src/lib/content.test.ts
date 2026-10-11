import test from "node:test";
import assert from "node:assert/strict";
import { buildDirectionsUrl, buildEmbedUrl, hasVenue, normalizeAgenda } from "./content";

test("agenda is sorted by time, unconfirmed last, stable for ties", () => {
  const { events, warnings } = normalizeAgenda([
    { id: "d", title: "TBC event" },
    { id: "c", time: "13:00", title: "Lunch" },
    { id: "a", time: "09:30", title: "Arrival" },
    { id: "b", time: "13:00", title: "Toast" },
  ]);
  assert.deepEqual(events.map((e) => e.id), ["a", "c", "b", "d"]);
  assert.equal(events[0].timeLabel, "9:30 AM");
  assert.equal(events[3].timeLabel, null);
  assert.equal(warnings.length, 0);
});

test("malformed agenda entries are handled with warnings, never thrown", () => {
  const { events, warnings } = normalizeAgenda([
    { id: "x", time: "6pm", title: "Bad time" },
    { id: "x", title: "Duplicate id" },
    { id: "", title: "No id" },
    { id: "y", title: "  " },
  ]);
  assert.deepEqual(events.map((e) => e.id), ["x"]);
  assert.equal(events[0].time, undefined);
  assert.equal(warnings.length, 4);
});

test("venue URLs", () => {
  assert.equal(hasVenue({}), false);
  assert.equal(buildDirectionsUrl({}), null);
  assert.equal(buildEmbedUrl({}), null);
  const v = { name: "Hall", address: "1 Main St", city: "Chennai" };
  assert.ok(buildDirectionsUrl(v)?.startsWith("https://www.google.com/maps/dir/?api=1&destination=Hall%2C%201%20Main%20St"));
  assert.ok(buildEmbedUrl(v)?.endsWith("&z=16&output=embed"));
  assert.equal(buildDirectionsUrl({ ...v, directionsUrl: "https://maps.app.goo.gl/x" }), "https://maps.app.goo.gl/x");
  assert.ok(buildDirectionsUrl({ coordinates: { lat: 13.08, lng: 80.27 } })?.includes("13.08%2C80.27"));
});
