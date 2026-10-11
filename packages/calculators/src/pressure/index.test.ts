import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Normal compressive force 100, contact area in square metres 2", () => {
  const result = calculate({
    operation: "pressure-si",
    force: "100",
    area: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("50");
});
test("Normal compressive force 1000, contact area in square metres 0.5", () => {
  const result = calculate({
    operation: "pressure-si",
    force: "1000",
    area: "0.5",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2000");
});
test("Normal compressive force 0, contact area in square metres 3", () => {
  const result = calculate({ operation: "pressure-si", force: "0", area: "3" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "pressure-si", force: "abc", area: "2" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(
    calculate({ operation: "pressure-si", force: "1", area: "0" }).ok,
  ).toBe(false);
});
