import { describe, expect, test } from "bun:test";
import { calculate } from "./index";

function answer(input: Parameters<typeof calculate>[0]): string {
  const result = calculate(input);
  if (!result.ok) throw new Error(result.error.code);
  return result.result.answer.value;
}

describe("Pythagorean engine", () => {
  test("independent exact 3-4-5 and missing-leg references", () => {
    expect(answer({ operation: "missing-hypotenuse", a: "3", b: "4" })).toBe(
      "5",
    );
    expect(
      answer({ operation: "missing-leg", hypotenuse: "5", leg: "3" }),
    ).toBe("4");
    expect(answer({ operation: "missing-hypotenuse", a: "5", b: "12" })).toBe(
      "13",
    );
  });

  test("strict triangle inequality and positive valid dimensions", () => {
    expect(
      calculate({ operation: "missing-leg", hypotenuse: "3", leg: "4" }),
    ).toEqual({
      ok: false,
      error: { code: "impossible-triangle", field: "hypotenuse" },
    });
    expect(
      calculate({ operation: "missing-leg", hypotenuse: "4", leg: "4" }),
    ).toEqual({
      ok: false,
      error: { code: "impossible-triangle", field: "hypotenuse" },
    });
    expect(
      calculate({ operation: "missing-hypotenuse", a: "0", b: "4" }),
    ).toEqual({ ok: false, error: { code: "nonpositive-side", field: "a" } });
    expect(
      calculate({ operation: "missing-hypotenuse", a: "-1", b: "4" }),
    ).toEqual({ ok: false, error: { code: "nonpositive-side", field: "a" } });
    expect(
      calculate({ operation: "missing-leg", hypotenuse: "5", leg: "-3" }),
    ).toEqual({ ok: false, error: { code: "nonpositive-side", field: "leg" } });
  });

  test("tiny positive sides and large supported result", () => {
    expect(
      answer({
        operation: "missing-hypotenuse",
        a: "0.0000000003",
        b: "0.0000000004",
      }),
    ).toBe("0.0000000005");
    expect(
      answer({
        operation: "missing-hypotenuse",
        a: "999999999999999999999999999999",
        b: "999999999999999999999999999999",
      }).startsWith("141421356237309504880168872420"),
    ).toBe(true);
  });
});
