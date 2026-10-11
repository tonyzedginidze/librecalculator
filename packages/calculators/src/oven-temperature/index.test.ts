import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "celsius-to-fahrenheit",
    inputs: { temperature: "180" },
    expected: "356",
  },
  {
    operation: "fahrenheit-to-celsius",
    inputs: { temperature: "356" },
    expected: "180",
  },
  {
    operation: "fan-adjustment",
    inputs: { temperature: "180", reduction: "20" },
    expected: "160",
  },
];
describe("oven-temperature", () => {
  for (const fixture of fixtures)
    test(fixture.operation, () => {
      const outcome = calculate({
        operation: fixture.operation,
        ...fixture.inputs,
      } as Input);
      expect(outcome.ok).toBe(true);
      if (outcome.ok) {
        expect(
          new DecimalValue(outcome.result.answer.value)
            .minus(fixture.expected)
            .abs()
            .lte(
              new DecimalValue(fixture.expected)
                .abs()
                .mul("0.000000000001")
                .plus("0.000000000001"),
            ),
        ).toBe(true);
        expect(outcome.result.visual.answer).toBe(outcome.result.answer.value);
      }
    });
  for (const raw of ["-1000", "1e3", "", "1,000"])
    test(`reject ${raw}`, () => {
      const fixture = fixtures[0];
      if (!fixture) throw new Error("Missing fixture");
      expect(
        calculate({
          operation: fixture.operation,
          ...fixture.inputs,
          [Object.keys(fixture.inputs)[0] ?? "missing"]: raw,
        } as Input).ok,
      ).toBe(false);
    });
});

test("absolute zero accepted; below absolute zero and invalid fan results rejected", () => {
  const outcome = calculate({
    operation: "celsius-to-fahrenheit",
    temperature: "-273.15",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok) expect(outcome.result.answer.value).toBe("-459.67");
  expect(
    calculate({ operation: "fahrenheit-to-celsius", temperature: "-459.68" })
      .ok,
  ).toBe(false);
  expect(
    calculate({
      operation: "fan-adjustment",
      temperature: "-270",
      reduction: "20",
    }).ok,
  ).toBe(false);
});

test("visual pairs both scales or both oven settings", () => {
  const c = calculate({
    operation: "fahrenheit-to-celsius",
    temperature: "350",
  });
  expect(c.ok).toBe(true);
  if (c.ok) {
    expect(c.result.visual.fahrenheit).toBe("350");
    expect(c.result.visual.celsius).toBe(c.result.answer.value);
  }
  const fan = calculate({
    operation: "fan-adjustment",
    temperature: "180",
    reduction: "20",
  });
  expect(fan.ok).toBe(true);
  if (fan.ok)
    expect(fan.result.visual).toMatchObject({
      conventional: "180",
      fan: "160",
      reduction: "20",
    });
});
