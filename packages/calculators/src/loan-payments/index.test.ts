import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/loan-payments/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/loan-payments";
import { calculate } from "./index";

describe("loan payment engine", () => {
  test("zero-rate cent schedule settles the final remainder", () => {
    const result = calculate({
      operation: "amortize",
      principal: "10.00",
      annualRate: "0",
      months: "3",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.result.schedule.map(({ paymentCents }) => paymentCents),
    ).toEqual(["333", "333", "334"]);
    expect(
      result.result.schedule.map(({ balanceCents }) => balanceCents),
    ).toEqual(["667", "334", "0"]);
    expect(result.result.totalInterestCents).toBe("0");
    expect(result.result.answer.cents).toBe("1000");
    expect(result.result.finalPaymentCents).toBe("334");
    expect(
      result.result.schedule
        .reduce((sum, row) => sum + BigInt(row.paymentCents), 0n)
        .toString(),
    ).toBe(result.result.answer.cents);
    expect(
      BigInt(result.result.principalCents) +
        BigInt(result.result.totalInterestCents),
    ).toBe(BigInt(result.result.answer.cents));
  });

  test.each([
    [
      {
        operation: "amortize",
        principal: "100.00",
        annualRate: "12",
        months: "1",
      },
      "10100",
      "100",
      "10100",
    ],
    [
      {
        operation: "amortize",
        principal: "1000.00",
        annualRate: "12",
        months: "12",
      },
      "106619",
      "6619",
      "8884",
    ],
  ] as const)("independent schedule fixture %j", (input, totalPaid, interest, finalPayment) => {
    const result = calculate(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.answer.cents).toBe(totalPaid);
    expect(result.result.totalInterestCents).toBe(interest);
    expect(result.result.finalPaymentCents).toBe(finalPayment);
    expect(result.result.schedule.at(-1)?.balanceCents).toBe("0");
    expect(
      BigInt(result.result.principalCents) +
        BigInt(result.result.totalInterestCents),
    ).toBe(BigInt(totalPaid));
    expect(
      result.result.schedule
        .reduce((sum, row) => sum + BigInt(row.paymentCents), 0n)
        .toString(),
    ).toBe(totalPaid);
    expect(
      result.result.schedule
        .reduce((sum, row) => sum + BigInt(row.interestCents), 0n)
        .toString(),
    ).toBe(interest);
    expect(result.result.visual.points.at(-1)?.balanceCents).toBe("0");
  });

  test("honors the 100 percent annual-rate boundary and one-month schedule", () => {
    const result = calculate({
      operation: "amortize",
      principal: "100.00",
      annualRate: "100",
      months: "1",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.schedule[0]?.interestCents).toBe("833");
    expect(result.result.answer.cents).toBe("10833");
  });

  test.each([
    ["16.50", "4", "6", "1656"],
    ["6.00", "13", "7", "607"],
  ] as const)("settles exact half-cent monthly interest upward for $%s at %s percent", (principal, annualRate, interestCents, totalPaidCents) => {
    const result = calculate({
      operation: "amortize",
      principal,
      annualRate,
      months: "1",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.schedule[0]?.interestCents).toBe(interestCents);
    expect(result.result.finalPaymentCents).toBe(totalPaidCents);
    expect(result.result.answer.cents).toBe(totalPaidCents);
    expect(result.result.regularPaymentCents).toBe(totalPaidCents);
  });

  test("half-up settles the exact regular-annuity tie and its actual two-month schedule", () => {
    const result = calculate({
      operation: "amortize",
      principal: "901.50",
      annualRate: "4",
      months: "2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.regularPaymentCents).toBe("45301");
    expect(result.result.schedule.map((row) => row.interestCents)).toEqual([
      "301",
      "151",
    ]);
    expect(result.result.schedule.map((row) => row.paymentCents)).toEqual([
      "45301",
      "45301",
    ]);
    expect(result.result.finalPaymentCents).toBe("45301");
    expect(result.result.answer.cents).toBe("90602");
    expect(result.result.totalInterestCents).toBe("452");
    expect(result.result.schedule.at(-1)?.balanceCents).toBe("0");
  });

  test("handles the smallest accepted positive annual rate without annuity cancellation", () => {
    const smallestAcceptedRate = `0.${"0".repeat(99)}1`;
    const result = calculate({
      operation: "amortize",
      principal: "100.00",
      annualRate: smallestAcceptedRate,
      months: "12",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.regularPaymentCents).toBe("833");
    expect(result.result.schedule.map((row) => row.interestCents)).toEqual(
      Array.from({ length: 12 }, () => "0"),
    );
    expect(result.result.finalPaymentCents).toBe("837");
    expect(result.result.answer.cents).toBe("10000");
    expect(result.result.totalInterestCents).toBe("0");
    expect(result.result.schedule.at(-1)?.balanceCents).toBe("0");
  });

  test("accepts the maximum term when each cent payment amortizes", () => {
    const result = calculate({
      operation: "amortize",
      principal: "12.00",
      annualRate: "0",
      months: "1200",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.schedule).toHaveLength(1200);
    expect(result.result.answer.cents).toBe("1200");
    expect(result.result.schedule.at(-1)?.balanceCents).toBe("0");
  });

  test("handles maximum accepted decimal rate scale at the maximum term", () => {
    const maximumScaleRate = `0.${"0".repeat(99)}123456789012345678901234567890`;
    const result = calculate({
      operation: "amortize",
      principal: "100.00",
      annualRate: maximumScaleRate,
      months: "1200",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.schedule).toHaveLength(1200);
    expect(result.result.regularPaymentCents).toBe("8");
    expect(result.result.totalInterestCents).toBe("0");
    expect(result.result.answer.cents).toBe("10000");
    expect(result.result.finalPaymentCents).toBe("408");
    expect(result.result.schedule.at(-1)?.balanceCents).toBe("0");
  });

  test("rejects malformed domains, sub-cent money, non-amortizing schedules, and overflow", () => {
    const cases = [
      [{ ...validInput, principal: "0" }, "zero-principal", "principal"],
      [{ ...validInput, principal: "-1" }, "negative-principal", "principal"],
      [
        { ...validInput, principal: "1.001" },
        "fractional-cent-principal",
        "principal",
      ],
      [
        { ...validInput, annualRate: "100.1" },
        "rate-out-of-range",
        "annualRate",
      ],
      [{ ...validInput, annualRate: "1e2" }, "invalid-rate", "annualRate"],
      [{ ...validInput, months: "0" }, "invalid-months", "months"],
      [{ ...validInput, months: "1201" }, "invalid-months", "months"],
      [
        {
          operation: "amortize",
          principal: "0.01",
          annualRate: "0",
          months: "1200",
        },
        "non-amortizing-payment",
        "months",
      ],
      [
        {
          operation: "amortize",
          principal: "0.01",
          annualRate: "0",
          months: "2",
        },
        "unrepresentable-schedule",
        "months",
      ],
      [
        {
          operation: "amortize",
          principal: "9999999999999999.99",
          annualRate: "100",
          months: "1200",
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

  test("authored lesson examples match independent schedule references and working messages", () => {
    const references: Record<
      string,
      {
        cents: string;
        dollars: string;
        interestCents: string;
        interest: string;
      }
    > = {
      "example-zero-rate": {
        cents: "1000",
        dollars: "10",
        interestCents: "0",
        interest: "0",
      },
      "example-one-month": {
        cents: "10100",
        dollars: "101",
        interestCents: "100",
        interest: "1",
      },
      "example-amortization": {
        cents: "106619",
        dollars: "1066.19",
        interestCents: "6619",
        interest: "66.19",
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
      if (!step) throw new Error("Expected a loan-payment working step");
      expect(
        renderWorkingStep(step, { locale: "en-US", messages }),
      ).not.toContain("{");
      expect(result.result.totalInterestCents).toBe(reference.interestCents);
      expect(step.args.interest.value).toBe(reference.interest);
    }
    expect(Object.keys(references)).toHaveLength(3);
  });
});

const validInput = {
  operation: "amortize",
  principal: "100.00",
  annualRate: "5",
  months: "12",
} as const;
