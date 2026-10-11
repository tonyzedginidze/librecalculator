import { describe, expect, test } from "bun:test";
import { calculate } from "./index";

function answer(input: Parameters<typeof calculate>[0]): number {
  const result = calculate(input);
  if (!result.ok) throw new Error(result.error.code);
  return Number(result.result.answer.value);
}

function close(actual: number, expected: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(
    1e-12 + 1e-12 * Math.abs(expected),
  );
}

describe("volume engine", () => {
  test("independent prism, cylinder, and sphere references", () => {
    expect(
      answer({ operation: "prism", width: "2", height: "3", depth: "4" }),
    ).toBe(24);
    close(
      answer({ operation: "cylinder", radius: "2", height: "3" }),
      12 * Math.PI,
    );
    close(answer({ operation: "sphere", radius: "3" }), 36 * Math.PI);
  });

  test("positive tiny and high-boundary inputs; zero, negative, malformed, and overflow", () => {
    expect(
      answer({
        operation: "prism",
        width: "0.0000000001",
        height: "1",
        depth: "1",
      }),
    ).toBe(1e-10);
    const high = "999999999999999999999999999999";
    expect(
      calculate({ operation: "prism", width: high, height: "1", depth: "1" }),
    ).toMatchObject({ ok: true, result: { answer: { value: high } } });
    expect(
      calculate({ operation: "cylinder", radius: "0", height: "1" }),
    ).toEqual({
      ok: false,
      error: { code: "nonpositive-dimension", field: "radius" },
    });
    expect(
      calculate({ operation: "prism", width: "1", height: "-2", depth: "3" }),
    ).toEqual({
      ok: false,
      error: { code: "nonpositive-dimension", field: "height" },
    });
    expect(calculate({ operation: "sphere", radius: "1e2" })).toEqual({
      ok: false,
      error: { code: "invalid-field", field: "radius" },
    });
    const tiny = `0.${"0".repeat(99)}1`;
    expect(
      calculate({ operation: "prism", width: tiny, height: tiny, depth: tiny }),
    ).toEqual({ ok: false, error: { code: "output-overflow" } });
  });
});
