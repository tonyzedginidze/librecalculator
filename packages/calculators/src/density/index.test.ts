import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Mass 10, volume in cubic metres 2", () => {
  const result = calculate({
    operation: "density-si",
    mass: "10",
    volume: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("5");
});
test("Mass 1000, volume in cubic metres 1", () => {
  const result = calculate({
    operation: "density-si",
    mass: "1000",
    volume: "1",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1000");
});
test("Mass 0, volume in cubic metres 3", () => {
  const result = calculate({ operation: "density-si", mass: "0", volume: "3" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "density-si", mass: "abc", volume: "2" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(
    calculate({ operation: "density-si", mass: "1", volume: "0" }).ok,
  ).toBe(false);
});
