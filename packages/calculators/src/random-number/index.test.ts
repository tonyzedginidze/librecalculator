import { expect, test } from "bun:test";
import { calculate } from "./index";

test("First seeded six-sided pick", () => {
  const result = calculate({
    operation: "seeded-integer",
    minimum: "1",
    maximum: "6",
    seed: "1",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2");
});
test("A range containing one number", () => {
  const result = calculate({
    operation: "seeded-integer",
    minimum: "10",
    maximum: "10",
    seed: "5",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("10");
});
test("Second seed on a ten-number range", () => {
  const result = calculate({
    operation: "seeded-integer",
    minimum: "0",
    maximum: "9",
    seed: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("4");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "seeded-integer",
      minimum: "abc",
      maximum: "6",
      seed: "1",
    }).ok,
  ).toBe(false);
});
test("integer domain and inclusive limits", () => {
  for (const input of [
    { operation: "seeded-integer", minimum: "5", maximum: "1", seed: "1" },
    { operation: "seeded-integer", minimum: "1", maximum: "6", seed: "0" },
    { operation: "seeded-integer", minimum: "1", maximum: "6", seed: "1.5" },
  ])
    expect(calculate(input).ok).toBe(false);
  const r = calculate({
    operation: "seeded-integer",
    minimum: "-1000000000",
    maximum: "1000000000",
    seed: "2147483646",
  });
  if (!r.ok) throw Error("failed");
  expect(Number(r.result.answer.value)).toBeGreaterThanOrEqual(-1000000000);
  expect(Number(r.result.answer.value)).toBeLessThanOrEqual(1000000000);
});
