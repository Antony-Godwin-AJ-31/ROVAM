import test from "node:test";
import assert from "node:assert/strict";
import {
  formatEventDate,
  formatTime12,
  getEventInstant,
  getTimeRemaining,
  isValidDateString,
  zonedTimeToInstant,
} from "./date-time";

test("Asia/Kolkata (UTC+5:30) converts to the right instant", () => {
  const t = zonedTimeToInstant("2027-02-14", "18:30", "Asia/Kolkata");
  assert.equal(new Date(t as number).toISOString(), "2027-02-14T13:00:00.000Z");
});

test("result does not depend on the machine time zone (same instant for same zone)", () => {
  const a = zonedTimeToInstant("2027-02-14", "00:00", "Asia/Kolkata");
  assert.equal(new Date(a as number).toISOString(), "2027-02-13T18:30:00.000Z");
});

test("DST: America/New_York summer (UTC-4) and winter (UTC-5)", () => {
  const summer = zonedTimeToInstant("2026-07-04", "12:00", "America/New_York");
  const winter = zonedTimeToInstant("2026-12-25", "12:00", "America/New_York");
  assert.equal(new Date(summer as number).toISOString(), "2026-07-04T16:00:00.000Z");
  assert.equal(new Date(winter as number).toISOString(), "2026-12-25T17:00:00.000Z");
});

test("invalid inputs return null", () => {
  assert.equal(zonedTimeToInstant("2027-02-30", "10:00", "Asia/Kolkata"), null);
  assert.equal(zonedTimeToInstant("2027-13-01", "10:00", "Asia/Kolkata"), null);
  assert.equal(zonedTimeToInstant("2027-02-14", "25:00", "Asia/Kolkata"), null);
  assert.equal(zonedTimeToInstant("14-02-2027", "10:00", "Asia/Kolkata"), null);
  assert.equal(zonedTimeToInstant("2027-02-14", "10:00", "Not/AZone"), null);
  assert.equal(getEventInstant({ timeZone: "Asia/Kolkata" }), null);
  assert.equal(getEventInstant({ date: "2027-02-14", timeZone: "Asia/Kolkata" }), null);
});

test("isValidDateString", () => {
  assert.equal(isValidDateString("2028-02-29"), true);
  assert.equal(isValidDateString("2027-02-29"), false);
  assert.equal(isValidDateString(undefined), false);
});

test("time remaining for a known future instant", () => {
  const target = Date.UTC(2027, 0, 10, 12, 0, 0);
  const now = target - (3 * 86400 + 4 * 3600 + 5 * 60 + 6) * 1000;
  assert.deepEqual(getTimeRemaining(target, now), {
    total: (3 * 86400 + 4 * 3600 + 5 * 60 + 6) * 1000,
    days: 3, hours: 4, minutes: 5, seconds: 6, started: false,
  });
});

test("less than one day / less than one minute remaining", () => {
  const target = 1_000_000_000_000;
  const lessDay = getTimeRemaining(target, target - (23 * 3600 + 59 * 60 + 59) * 1000);
  assert.deepEqual([lessDay.days, lessDay.hours, lessDay.minutes, lessDay.seconds], [0, 23, 59, 59]);
  const lessMin = getTimeRemaining(target, target - 42_000);
  assert.deepEqual([lessMin.days, lessMin.hours, lessMin.minutes, lessMin.seconds], [0, 0, 0, 42]);
  assert.equal(lessMin.started, false);
});

test("exactly at the target instant: started, all zero", () => {
  const r = getTimeRemaining(5000, 5000);
  assert.deepEqual(r, { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
});

test("already-passed target never yields negative values", () => {
  const r = getTimeRemaining(1000, 999_999_999);
  assert.equal(r.started, true);
  for (const v of [r.total, r.days, r.hours, r.minutes, r.seconds]) assert.ok(v >= 0);
});

test("formatting helpers", () => {
  assert.equal(formatEventDate("2027-02-14"), "Sunday 14 February 2027");
  assert.equal(formatEventDate("nope"), null);
  assert.equal(formatTime12("00:05"), "12:05 AM");
  assert.equal(formatTime12("12:00"), "12:00 PM");
  assert.equal(formatTime12("18:30"), "6:30 PM");
  assert.equal(formatTime12("7:30"), null);
});
