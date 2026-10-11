import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/compound-interest/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/compound-interest";
import { calculate } from "./index";

describe("compound interest engine", () => {
  test.each([
    [
      {
        operation: "compound",
        principal: "1000.00",
        annualRate: "10",
        years: "2",
        frequency: "1",
      },
      "121000",
      "21000",
    ],
    [
      {
        operation: "compound",
        principal: "100.00",
        annualRate: "0",
        years: "2",
        frequency: "12",
      },
      "10000",
      "0",
    ],
    [
      {
        operation: "compound",
        principal: "250.00",
        annualRate: "4",
        years: "1",
        frequency: "4",
      },
      "26015",
      "1015",
    ],
  ] as const)("independent fixture %j", (input, balanceCents, interestCents) => {
    const output = calculate(input);
    expect(output.ok).toBe(true);
    if (!output.ok) return;
    expect(output.result.answer.cents).toBe(balanceCents);
    expect(output.result.interestCents).toBe(interestCents);
    expect(output.result.annualSeries.at(-1)).toEqual({
      year: Number(input.years),
      balanceCents,
    });
    expect(output.result.visual.series).toBe(output.result.annualSeries);
  });

  test("settles exact half-cent final balance half-up", () => {
    const result = calculate({
      operation: "compound",
      principal: "0.01",
      annualRate: "50",
      years: "1",
      frequency: "1",
    });
    expect(result.ok && result.result.answer.cents).toBe("2");
    expect(result.ok && result.result.interestCents).toBe("1");
  });

  test("supports the maximum term and daily frequency without changing periods", () => {
    const result = calculate({
      operation: "compound",
      principal: "0",
      annualRate: "100",
      years: "1000",
      frequency: "365",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.periods).toBe(365_000);
    expect(result.result.annualSeries).toHaveLength(1000);
    expect(result.result.answer.cents).toBe("0");
  });

  test("rejects input-domain violations and output overflow with field errors", () => {
    const cases = [
      [{ ...validInput, principal: "-1" }, "negative-principal", "principal"],
      [
        { ...validInput, principal: "1.001" },
        "fractional-cent-principal",
        "principal",
      ],
      [{ ...validInput, principal: "1e3" }, "invalid-principal", "principal"],
      [
        { ...validInput, annualRate: "100.01" },
        "rate-out-of-range",
        "annualRate",
      ],
      [{ ...validInput, annualRate: "1,000" }, "invalid-rate", "annualRate"],
      [{ ...validInput, years: "0" }, "invalid-years", "years"],
      [{ ...validInput, years: "1001" }, "invalid-years", "years"],
      [{ ...validInput, frequency: "3" }, "invalid-frequency", "frequency"],
      [
        {
          ...validInput,
          principal: "9999999999999999.99",
          annualRate: "100",
          years: "1000",
          frequency: "1",
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

  test("authored lesson examples match independent USD-cent fixtures and working messages", () => {
    const references: Record<
      string,
      { cents: string; dollars: string; interest: string }
    > = {
      "example-annual-growth": {
        cents: "121000",
        dollars: "1210",
        interest: "210",
      },
      "example-zero-rate": { cents: "10000", dollars: "100", interest: "0" },
      "example-quarterly-rounding": {
        cents: "26015",
        dollars: "260.15",
        interest: "10.15",
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
      if (!step) throw new Error("Expected a compound-interest working step");
      expect(
        renderWorkingStep(step, { locale: "en-US", messages }),
      ).not.toContain("{");
      expect(step.args.balance.value).toBe(reference.dollars);
      expect(step.args.interest.value).toBe(reference.interest);
    }
    expect(Object.keys(references)).toHaveLength(3);
  });
});

const validInput = {
  operation: "compound",
  principal: "100.00",
  annualRate: "5",
  years: "1",
  frequency: "12",
} as const;
