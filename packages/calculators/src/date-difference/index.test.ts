import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Cross a leap day", () => {
  const result = calculate({
    operation: "elapsed-days",
    start: "2024-02-28",
    end: "2024-03-01",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2");
});
test("Reverse the direction", () => {
  const result = calculate({
    operation: "elapsed-days",
    start: "2024-03-01",
    end: "2024-02-28",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-2");
});
test("Count all three named dates", () => {
  const result = calculate({
    operation: "inclusive-days",
    start: "2024-02-28",
    end: "2024-03-01",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("3");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "elapsed-days", start: "abc", end: "2024-03-01" })
      .ok,
  ).toBe(false);
});
test("century leap rule and inclusive reversal", () => {
  const r = calculate({
    operation: "elapsed-days",
    start: "1900-02-28",
    end: "1900-03-01",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("1");
  expect(
    calculate({
      operation: "inclusive-days",
      start: "2024-01-02",
      end: "2024-01-01",
    }).ok,
  ).toBe(false);
});
