import { expect, test } from "bun:test";
import { en } from "../../../i18n/src/en";
import { messages as ageMessages } from "../../../i18n/src/topics/age";
import { messages as countdownMessages } from "../../../i18n/src/topics/countdown";
import { messages as timeZoneMessages } from "../../../i18n/src/topics/time-zone";
import { messages as workMessages } from "../../../i18n/src/topics/work-hours";
import { presentExample as age } from "./age/examples";
import { presentExample as countdown } from "./countdown/examples";
import { calendarMarkers, formatCivilDate } from "./date-time-topic";
import { presentExample as timeZone } from "./time-zone/examples";
import { presentExample as workHours } from "./work-hours/examples";

test("civil dates format without timezone drift, including early years", () => {
  expect(formatCivilDate("2026-10-11", "en-US")).toBe("Oct 11, 2026");
  expect(formatCivilDate("0050-01-01", "en-US")).toBe("Jan 1, 50");
  expect(formatCivilDate("not-a-date", "en-US")).toBe("not-a-date");
});

test("calendar markers stay inside the span and thin out", () => {
  const months = calendarMarkers("2026-01-01", "2026-10-11", "en-US");
  expect(months.length).toBeLessThanOrEqual(5);
  for (const m of months) expect(m.at > 0 && m.at < 1).toBe(true);
  const years = calendarMarkers("1990-06-15", "2026-10-11", "en-US");
  expect(years.every((m) => /^\d{4}$/.test(m.label))).toBe(true);
  expect(calendarMarkers("2026-10-11", "2026-10-11", "en-US")).toEqual([]);
});

test("lesson examples read like the calculator answers", () => {
  const view = (
    present: typeof age,
    messages: Record<string, string>,
    operation: string,
    inputs: Record<string, string>,
  ) => {
    const p = present({ operation, inputs }, "en-US", { ...en, ...messages });
    if (!p.ok) throw Error("presentation failed");
    return p;
  };
  const a = view(age, ageMessages, "completed-years", {
    birth: "2000-02-29",
    asof: "2024-02-29",
  });
  expect(a.answer).toBe("24 years");
  expect(a.fields[0]?.value).toBe("Feb 29, 2000");
  expect(
    view(countdown, countdownMessages, "days-until", {
      reference: "2024-03-01",
      target: "2024-02-28",
    }).answer,
  ).toBe("2 days ago");
  const w = view(workHours, workMessages, "paid-hours", {
    start: "09:00",
    end: "17:00",
    break: "30",
    overnight: "same-day",
  });
  expect(w.answer).toBe("7.5 hours");
  expect(w.fields.find((f) => f.id === "overnight")?.value).toBe("Same day");
  const z = view(timeZone, timeZoneMessages, "fixed-offset", {
    hour: "1",
    minute: "0",
    sourceOffset: "utc-plus-2",
    targetOffset: "utc",
  });
  expect(z.answer).toBe("23:00 previous day");
  expect(z.fields.find((f) => f.id === "sourceOffset")?.value).toBe(
    "UTC+02:00",
  );
});
