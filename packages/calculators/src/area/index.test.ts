import { describe, expect, test } from "bun:test";
import { calculate } from "./index";

function value(input: Parameters<typeof calculate>[0]): string {
  const result = calculate(input);
  if (!result.ok) throw new Error(result.error.code);
  return result.result.answer.value;
}

describe("area engine", () => {
  test("independent shape references and unit-circle pi constant", () => {
    expect(value({ operation: "rectangle", width: "3", height: "4" })).toBe(
      "12",
    );
    expect(value({ operation: "triangle", base: "3", height: "4" })).toBe("6");
    expect(value({ operation: "circle", radius: "1" })).toBe(
      "3.1415926535897932384626433832795028841971693993751",
    );
  });

  test("positive tiny and high-boundary inputs; zero, negative, malformed, and overflow", () => {
    expect(
      value({ operation: "rectangle", width: "0.0000000001", height: "1" }),
    ).toBe("0.0000000001");
    const high = "999999999999999999999999999999";
    expect(value({ operation: "rectangle", width: high, height: "1" })).toBe(
      high,
    );
    expect(calculate({ operation: "circle", radius: "0" })).toEqual({
      ok: false,
      error: { code: "nonpositive-dimension", field: "radius" },
    });
    expect(
      calculate({ operation: "triangle", base: "-1", height: "2" }),
    ).toEqual({
      ok: false,
      error: { code: "nonpositive-dimension", field: "base" },
    });
    expect(
      calculate({ operation: "rectangle", width: "NaN", height: "2" }),
    ).toEqual({ ok: false, error: { code: "invalid-field", field: "width" } });
    const tiny = `0.${"0".repeat(99)}1`;
    expect(
      calculate({ operation: "rectangle", width: tiny, height: tiny }),
    ).toEqual({ ok: false, error: { code: "output-overflow" } });
  });
});
