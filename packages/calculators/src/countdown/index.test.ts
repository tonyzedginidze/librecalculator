import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Count toward the new year", () => {
  const result = calculate({
    operation: "days-until",
    reference: "2024-12-20",
    target: "2025-01-01",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("12");
});
test("The target is today", () => {
  const result = calculate({
    operation: "days-until",
    reference: "2024-01-01",
    target: "2024-01-01",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("A target already passed", () => {
  const result = calculate({
    operation: "days-until",
    reference: "2024-03-01",
    target: "2024-02-28",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-2");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "days-until",
      reference: "abc",
      target: "2025-01-01",
    }).ok,
  ).toBe(false);
});
test("full calendar bounds are deterministic", () => {
  const r = calculate({
    operation: "days-until",
    reference: "0001-01-01",
    target: "9999-12-31",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("3652058");
});
test("weeks and leftover days of the distance", () => {
  const r = calculate({
    operation: "days-until",
    reference: "2026-10-11",
    target: "2026-12-25",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("75");
  expect(r.result.visual.rows.map((row) => row.value)).toEqual([
    "10",
    "5",
    "75",
  ]);
  const past = calculate({
    operation: "days-until",
    reference: "2024-03-01",
    target: "2024-02-18",
  });
  if (!past.ok) throw Error("failed");
  expect(past.result.visual.rows.map((row) => row.value)).toEqual([
    "1",
    "5",
    "-12",
  ]);
});
