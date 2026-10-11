import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/tip-splitting/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/tip-splitting";
import { calculate } from "./index";

describe("tip splitting engine", () => {
  test("rounds the tip once then allocates the exact cent remainder", () => {
    const result = calculate({
      operation: "split",
      subtotal: "10.00",
      tipRate: "15",
      people: "3",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.tipCents).toBe("150");
    expect(result.result.totalCents).toBe("1150");
    expect(result.result.shares).toEqual([
      { shareCents: "383", count: 2 },
      { shareCents: "384", count: 1 },
    ]);
    expect(weightedShares(result.result.shares)).toBe("1150");
    expect(result.result.visual.shares).toBe(result.result.shares);
  });

  test("covers an even split and zero subtotal at the maximum tip rate", () => {
    const even = calculate({
      operation: "split",
      subtotal: "100.00",
      tipRate: "20",
      people: "4",
    });
    expect(even.ok && even.result.answer.cents).toBe("12000");
    expect(even.ok && even.result.shares).toEqual([
      { shareCents: "3000", count: 4 },
      { shareCents: "3001", count: 0 },
    ]);

    const zero = calculate({
      operation: "split",
      subtotal: "0",
      tipRate: "1000",
      people: "1",
    });
    expect(zero.ok && zero.result.tipCents).toBe("0");
    expect(zero.ok && weightedShares(zero.result.shares)).toBe("0");
  });

  test("settles a half-cent tip once and supports the maximum people count", () => {
    const halfCent = calculate({
      operation: "split",
      subtotal: "0.01",
      tipRate: "50",
      people: "1",
    });
    expect(halfCent.ok && halfCent.result.tipCents).toBe("1");
    expect(halfCent.ok && halfCent.result.totalCents).toBe("2");

    const many = calculate({
      operation: "split",
      subtotal: "0.01",
      tipRate: "0",
      people: "10000",
    });
    expect(many.ok).toBe(true);
    if (!many.ok) return;
    expect(many.result.shares).toEqual([
      { shareCents: "0", count: 9999 },
      { shareCents: "1", count: 1 },
    ]);
    expect(weightedShares(many.result.shares)).toBe("1");
  });

  test("rejects invalid money, rates, people counts, and total overflow", () => {
    const cases = [
      [{ ...validInput, subtotal: "-1" }, "negative-subtotal", "subtotal"],
      [
        { ...validInput, subtotal: "1.001" },
        "fractional-cent-subtotal",
        "subtotal",
      ],
      [{ ...validInput, subtotal: "1,000" }, "invalid-subtotal", "subtotal"],
      [{ ...validInput, tipRate: "1000.01" }, "rate-out-of-range", "tipRate"],
      [{ ...validInput, tipRate: "1e2" }, "invalid-rate", "tipRate"],
      [{ ...validInput, people: "0" }, "invalid-people", "people"],
      [{ ...validInput, people: "10001" }, "invalid-people", "people"],
      [
        {
          operation: "split",
          subtotal: "9999999999999999.99",
          tipRate: "1",
          people: "1",
        },
        "output-overflow",
        undefined,
      ],
    ] as const;
    for (const [input, code, field] of cases) {
      const result = calculate(input);
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error).toEqual({ code, ...(field ? { field } : {}) });
    }
  });

  test("authored lesson examples match independent allocation references and working messages", () => {
    const references: Record<
      string,
      { cents: string; dollars: string; tipCents: string; tip: string }
    > = {
      "example-remainder": {
        cents: "1150",
        dollars: "11.5",
        tipCents: "150",
        tip: "1.5",
      },
      "example-even": {
        cents: "12000",
        dollars: "120",
        tipCents: "2000",
        tip: "20",
      },
      "example-zero": {
        cents: "0",
        dollars: "0",
        tipCents: "0",
        tip: "0",
      },
    };
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      const reference = references[block.id];
      expect(reference).toBeDefined();
      if (!reference) continue;
      expect(block.expected).toBe(reference.dollars);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as Parameters<typeof calculate>[0]);
      expect(result.ok && result.result.answer.cents).toBe(reference.cents);
      if (!result.ok) continue;
      const step = result.result.working[0];
      if (!step) throw new Error("Expected a tip-splitting working step");
      expect(
        renderWorkingStep(step, { locale: "en-US", messages }),
      ).not.toContain("{");
      expect(step.args.total.value).toBe(reference.dollars);
      expect(result.result.tipCents).toBe(reference.tipCents);
      expect(step.args.tip.value).toBe(reference.tip);
    }
    expect(Object.keys(references)).toHaveLength(3);
  });
});

function weightedShares(
  shares: readonly { shareCents: string; count: number }[],
): string {
  return shares
    .reduce(
      (total, share) => total + BigInt(share.shareCents) * BigInt(share.count),
      0n,
    )
    .toString();
}

const validInput = {
  operation: "split",
  subtotal: "10.00",
  tipRate: "15",
  people: "3",
} as const;
