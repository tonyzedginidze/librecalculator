import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/discount/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/discount";
import { calculate } from "./index";

describe("discount engine", () => {
  test.each([
    [{ operation: "sale-price", original: "80", discount: "15" }, "68"],
    [{ operation: "sale-price", original: "19.99", discount: "30" }, "13.993"],
    [{ operation: "sale-price", original: "50", discount: "-10" }, "55"],
    [{ operation: "sale-price", original: "40", discount: "100" }, "0"],
    [{ operation: "sale-price", original: "40", discount: "125" }, "-10"],
    [{ operation: "discount-percent", original: "200", sale: "150" }, "25"],
    [{ operation: "discount-percent", original: "80", sale: "68" }, "15"],
    [{ operation: "discount-percent", original: "50", sale: "55" }, "-10"],
    [{ operation: "discount-percent", original: "-50", sale: "-40" }, "20"],
  ] as const)("independent fixture %j => %s", (input, expected) => {
    const output = calculate(input as Parameters<typeof calculate>[0]);
    expect(output.ok).toBe(true);
    if (output.ok) expect(output.result.answer.value).toBe(expected);
  });

  test("rejects zero original, malformed, exponent, grouped and excessive precision", () => {
    expect(
      calculate({ operation: "discount-percent", original: "0", sale: "5" }),
    ).toEqual({
      ok: false,
      error: { code: "zero-denominator", field: "original" },
    });
    expect(
      calculate({ operation: "sale-price", original: "x", discount: "5" }),
    ).toEqual({
      ok: false,
      error: { code: "invalid-field", field: "original" },
    });
    for (const bad of ["1,000", "1e3", "1,2", "--2", `1.${"1".repeat(30)}`]) {
      expect(
        calculate({ operation: "sale-price", original: "10", discount: bad })
          .ok,
      ).toBe(false);
    }
  });

  test("saved amount, sale price and working come from one calculation", () => {
    const output = calculate({
      operation: "sale-price",
      original: "80",
      discount: "15",
    });
    expect(output.ok).toBe(true);
    if (output.ok) {
      expect(output.result.saved.value).toBe("12");
      expect(output.result.sale.value).toBe("68");
      expect(output.result.working[0]?.args.saved?.value).toBe("12");
      expect(output.result.working[1]?.args.sale?.value).toBe("68");
      expect(output.result.visual).toMatchObject({
        kind: "discount-split",
        original: "80",
        sale: "68",
        saved: "12",
      });
    }
  });

  test("visual carries a negative saving for a price rise", () => {
    const output = calculate({
      operation: "sale-price",
      original: "50",
      discount: "-10",
    });
    expect(output.ok && output.result.visual).toMatchObject({
      original: "50",
      sale: "55",
      saved: "-5",
    });
  });

  test("renders working with locale decimal separators", () => {
    const output = calculate({
      operation: "sale-price",
      original: "0.8",
      discount: "1.5",
    });
    expect(output.ok).toBe(true);
    if (output.ok) {
      const step = output.result.working[0];
      if (!step) throw new Error("Expected working step");
      expect(renderWorkingStep(step, { locale: "de-DE", messages })).toBe(
        "$0,8 × 1,5% = $0,012 saved",
      );
    }
  });

  test("authored lesson examples match independent reference answers", () => {
    const references: Record<string, string> = {
      "example-fifteen": "68",
      "example-cents": "13.993",
      "example-markup": "55",
      "example-percent": "25",
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
