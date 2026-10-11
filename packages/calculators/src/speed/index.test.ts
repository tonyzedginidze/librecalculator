import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Distance 120, elapsed seconds 10", () => {
  const result = calculate({
    operation: "speed-si",
    distance: "120",
    time: "10",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("12");
});
test("Distance 0, elapsed seconds 5", () => {
  const result = calculate({ operation: "speed-si", distance: "0", time: "5" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("Distance 1500, elapsed seconds 300", () => {
  const result = calculate({
    operation: "speed-si",
    distance: "1500",
    time: "300",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("5");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "speed-si", distance: "abc", time: "10" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(
    calculate({ operation: "speed-si", distance: "1", time: "0" }).ok,
  ).toBe(false);
});
