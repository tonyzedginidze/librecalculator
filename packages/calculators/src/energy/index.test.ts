import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Mass 2, speed in metres per second 3", () => {
  const result = calculate({ operation: "energy-si", mass: "2", speed: "3" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("9");
});
test("Mass 10, speed in metres per second 0", () => {
  const result = calculate({ operation: "energy-si", mass: "10", speed: "0" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("Mass 4, speed in metres per second 5", () => {
  const result = calculate({ operation: "energy-si", mass: "4", speed: "5" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("50");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "energy-si", mass: "abc", speed: "3" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(calculate({ operation: "energy-si", mass: "0", speed: "1" }).ok).toBe(
    false,
  );
});

test("visual compares the same mass at twice the speed", () => {
  const result = calculate({
    operation: "energy-si",
    mass: "1500",
    speed: "20",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("300000");
  const rows = Object.fromEntries(
    result.result.visual.rows.map((r) => [r.labelKey, r.value]),
  );
  expect(rows["energy.visual.doubled-speed"]).toBe("40");
  expect(rows["energy.visual.doubled-energy"]).toBe("1200000");
});
