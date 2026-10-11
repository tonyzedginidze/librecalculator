import { expect, test } from "bun:test";
import { calculate, clockText, offsetId, offsetMinutes } from "./index";

const convert = (
  hour: string,
  minute: string,
  sourceOffset: string,
  targetOffset: string,
) =>
  calculate({
    operation: "fixed-offset",
    hour,
    minute,
    sourceOffset,
    targetOffset,
  });

test("Next day at 01:30", () => {
  const result = convert("23", "30", "utc", "utc-plus-2");
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("90");
});
test("Previous day at 23:00", () => {
  const result = convert("1", "0", "utc-plus-2", "utc");
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1380");
});
test("A half-hour offset at 17:30", () => {
  const result = convert("12", "0", "utc", "utc-plus-5-30");
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1050");
});
test("rejects malformed input", () => {
  expect(convert("abc", "30", "utc", "utc-plus-2").ok).toBe(false);
  expect(convert("1", "30", "0", "utc-plus-2").ok).toBe(false);
  expect(convert("1", "30", "utc-plus-1-75", "utc").ok).toBe(false);
});
test("bounds and integer fields fail exactly", () => {
  for (const [hour, minute, from] of [
    ["24", "0", "utc"],
    ["1", "60", "utc"],
    ["1", "0", "utc-plus-15"],
    ["1.5", "0", "utc"],
  ] as const)
    expect(convert(hour, minute, from, "utc").ok).toBe(false);
});
test("default New York evening to Tokyo morning, with day shift and clock", () => {
  const r = convert("17", "0", "utc-minus-5", "utc-plus-9");
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("420");
  const args = r.result.working[0]?.args;
  expect(args?.dayShift).toEqual({ kind: "decimal", value: "1" });
  expect(args?.total).toEqual({ kind: "decimal", value: "1860" });
  expect(args?.clock).toEqual({ kind: "text", value: "07:00" });
});
test("offset IDs round-trip and clocks pad", () => {
  for (const m of [-570, -300, 0, 330, 345, 840])
    expect(offsetMinutes(offsetId(m))).toBe(m);
  expect(clockText(90)).toBe("01:30");
  expect(clockText(1439)).toBe("23:59");
});
