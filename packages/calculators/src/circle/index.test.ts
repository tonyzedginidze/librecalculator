import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "circle-area",
    inputs: { radius: "1" },
    expected: "3.1415926535897932384626433832795028841971693993751",
  },
  {
    operation: "circle-circumference",
    inputs: { radius: "1" },
    expected: "6.2831853071795864769252867665590057683943387987502",
  },
  { operation: "circle-diameter", inputs: { radius: "1" }, expected: "2" },
];
describe("circle", () => {
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
  for (const raw of ["0", "-1", "1e3", "", "1,000"])
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
