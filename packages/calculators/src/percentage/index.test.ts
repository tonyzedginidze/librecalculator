import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/percentage/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/percentage";
import { calculate } from "./index";

describe("percentage engine", () => {
  test.each([
    [{ operation: "of-value", value: "80", percentage: "15" }, "12"],
    [{ operation: "of-value", value: "-240", percentage: "125" }, "-300"],
    [{ operation: "of-value", value: "0.8", percentage: "2.5" }, "0.02"],
    [{ operation: "of-value", value: "2", percentage: "-50" }, "-1"],
    [{ operation: "ratio", part: "18", whole: "24" }, "75"],
    [
      { operation: "ratio", part: "1", whole: "3" },
      "33.333333333333333333333333333333333333333333333333",
    ],
    [{ operation: "ratio", part: "-5", whole: "-20" }, "25"],
  ] as const)("independent fixture %j => %s", (input, expected) => {
    const output = calculate(input as Parameters<typeof calculate>[0]);
    expect(output.ok).toBe(true);
    if (output.ok) expect(output.result.answer.value).toBe(expected);
  });

  test("rejects zero whole, malformed/exponent/grouped and excessive precision", () => {
    expect(calculate({ operation: "ratio", part: "1", whole: "0" })).toEqual({
      ok: false,
      error: { code: "zero-denominator", field: "whole" },
    });
    for (const bad of [
      "1,000",
      "1e3",
      "1,2",
      "--2",
      `1.${"1".repeat(30)}`,
      "0".repeat(257),
    ]) {
      expect(
        calculate({
          operation: "of-value",
          value: bad,
          percentage: "1",
        }).ok,
      ).toBe(false);
    }
  });

  test("working and visual data are sourced from the exact answer", () => {
    const output = calculate({
      operation: "of-value",
      value: "-20",
      percentage: "150",
    });
    expect(output.ok).toBe(true);
    if (output.ok) {
      expect(output.result.working[0]?.args.answer.value).toBe(
        output.result.answer.value,
      );
      expect(output.result.visual.value).toBe(output.result.answer.value);
      expect(output.result.visual.sign).toBe("negative");
      expect(output.result.visual.fraction).toBe("1");
      expect(output.result.visual.outside).toBe(true);
    }
  });

  test("renders an actual percentage working step with locale decimal separators", () => {
    const output = calculate({
      operation: "of-value",
      value: "0.8",
      percentage: "1.5",
    });
    expect(output.ok).toBe(true);
    if (output.ok) {
      const step = output.result.working[0];
      if (!step) throw new Error("Expected percentage working step");
      expect(
        renderWorkingStep(step, {
          locale: "de-DE",
          messages,
        }),
      ).toBe("1,5% of 0,8 = 0,012");
    }
  });

  test("ratio visual uses a 100 percent reference and represents signed/outside values", () => {
    const within = calculate({ operation: "ratio", part: "18", whole: "24" });
    const outside = calculate({ operation: "ratio", part: "-36", whole: "24" });
    expect(within.ok && within.result.visual).toMatchObject({
      value: "75",
      reference: "100",
      fraction: "0.75",
      outside: false,
    });
    expect(outside.ok && outside.result.visual).toMatchObject({
      value: "-150",
      reference: "100",
      fraction: "1",
      outside: true,
      sign: "negative",
    });
  });

  test("authored lesson examples match independent reference answers", () => {
    const references: Record<string, string> = {
      "example-discount": "12",
      "example-negative": "-300",
      "example-ratio": "75",
      "example-small": "0.02",
    };
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      const reference = references[block.id] ?? "missing reference fixture";
      expect(reference).toBe(block.expected);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as Parameters<typeof calculate>[0]);
      expect(result.ok && result.result.answer.value).toBe(reference);
    }
    expect(Object.keys(references)).toHaveLength(4);
  });
});
