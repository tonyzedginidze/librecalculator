import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Five hundred kilometres on forty litres", () => {
  const result = calculate({
    operation: "litres-per-100km",
    distance: "500",
    fuel: "40",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("8");
});
test("Distance travelled per litre", () => {
  const result = calculate({
    operation: "kilometres-per-litre",
    distance: "600",
    fuel: "40",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("15");
});
test("A lower consumption trip", () => {
  const result = calculate({
    operation: "litres-per-100km",
    distance: "200",
    fuel: "10",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("5");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "litres-per-100km", distance: "abc", fuel: "40" })
      .ok,
  ).toBe(false);
});
test("distance and fuel must both be positive", () => {
  for (const distance of ["0", "-1"])
    expect(
      calculate({ operation: "litres-per-100km", distance, fuel: "1" }).ok,
    ).toBe(false);
  expect(
    calculate({ operation: "kilometres-per-litre", distance: "100", fuel: "0" })
      .ok,
  ).toBe(false);
});
test("visual carries both conventions from one trip", () => {
  const r = calculate({
    operation: "litres-per-100km",
    distance: "600",
    fuel: "42",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("7");
  expect(r.result.visual.litresPer100km).toBe("7");
  expect(r.result.visual.kilometresPerLitre.startsWith("14.285714")).toBe(true);
});
