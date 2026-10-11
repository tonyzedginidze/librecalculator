import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Mass 10, signed acceleration in m/s\u00b2 2", () => {
  const result = calculate({
    operation: "force-si",
    mass: "10",
    acceleration: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("20");
});
test("Mass 3, signed acceleration in m/s\u00b2 -4", () => {
  const result = calculate({
    operation: "force-si",
    mass: "3",
    acceleration: "-4",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-12");
});
test("Mass 5, signed acceleration in m/s\u00b2 0", () => {
  const result = calculate({
    operation: "force-si",
    mass: "5",
    acceleration: "0",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "force-si", mass: "abc", acceleration: "2" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(
    calculate({ operation: "force-si", mass: "0", acceleration: "1" }).ok,
  ).toBe(false);
});
