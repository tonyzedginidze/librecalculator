import { expect, test } from "bun:test";
import { calculate } from "./index";

test("A shift with a half-hour break", () => {
  const result = calculate({
    operation: "paid-hours",
    start: "09:00",
    end: "17:00",
    break: "30",
    overnight: "same-day",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("7.5");
});
test("An explicitly overnight shift", () => {
  const result = calculate({
    operation: "paid-hours",
    start: "22:00",
    end: "06:00",
    break: "0",
    overnight: "next-day",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("8");
});
test("A short shift", () => {
  const result = calculate({
    operation: "paid-hours",
    start: "10:00",
    end: "12:15",
    break: "15",
    overnight: "same-day",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "paid-hours",
      start: "abc",
      end: "17:00",
      break: "30",
      overnight: "same-day",
    }).ok,
  ).toBe(false);
});
test("explicit overnight and break domain", () => {
  for (const i of [
    { start: "22:00", end: "06:00", break: "0", overnight: "same-day" },
    { start: "09:00", end: "10:00", break: "61", overnight: "same-day" },
    { start: "24:00", end: "10:00", break: "0", overnight: "same-day" },
  ])
    expect(calculate({ operation: "paid-hours", ...i }).ok).toBe(false);
});
test("paid minutes and the shift-end choice", () => {
  const r = calculate({
    operation: "paid-hours",
    start: "09:00",
    end: "17:30",
    break: "30",
    overnight: "same-day",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("8");
  expect(r.result.visual.rows.map((row) => row.value)).toEqual([
    "510",
    "30",
    "480",
    "8",
  ]);
  expect(
    calculate({
      operation: "paid-hours",
      start: "09:00",
      end: "17:00",
      break: "0",
      overnight: "1",
    }).ok,
  ).toBe(false);
});
