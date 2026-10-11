import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Root of nine", () => {
  const result = calculate({ operation: "square-root", value: "9" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("3");
});
test("A negative integer power", () => {
  const result = calculate({
    operation: "integer-power",
    value: "2",
    exponent: "-3",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0.125");
});
test("Logarithm of one", () => {
  const result = calculate({ operation: "natural-log", value: "1" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("A right angle", () => {
  const result = calculate({ operation: "sine-degrees", value: "90" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1");
});
test("rejects malformed input", () => {
  expect(calculate({ operation: "square-root", value: "abc" }).ok).toBe(false);
});
test("exact invalid domains are rejected", () => {
  for (const input of [
    { operation: "square-root", value: "-1" },
    { operation: "natural-log", value: "0" },
    { operation: "integer-power", value: "0", exponent: "0" },
    { operation: "integer-power", value: "2", exponent: "1.5" },
    { operation: "sine-degrees", value: "1000001" },
  ])
    expect(calculate(input).ok).toBe(false);
});
test("approximate root agrees with independent reference", () => {
  const r = calculate({ operation: "square-root", value: "2" });
  if (!r.ok) throw Error("failed");
  expect(Math.abs(Number(r.result.answer.value) - Math.SQRT2)).toBeLessThan(
    1e-12,
  );
});
