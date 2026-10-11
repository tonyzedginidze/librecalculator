import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/mortgage/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/mortgage";
import {
  amortize,
  calculate,
  divideCentsHalfUp,
  type MortgageErrorCode,
  type MortgageInput,
} from "./index";

const base: MortgageInput = {
  operation: "amortize",
  homePrice: "400000",
  downPayment: "80000",
  annualRate: "6.5",
  years: "30",
  propertyTax: "0",
  homeInsurance: "0",
  hoa: "0",
};

/** Run the month-level schedule and fail the test on a rejected schedule. */
function schedule(principalCents: bigint, annualRate: string, months: number) {
  const loan = amortize(principalCents, annualRate, months);
  if (!loan.ok) throw new Error(`unexpected ${loan.code}`);
  return loan.value;
}

const sumOf = (
  rows: readonly Record<string, unknown>[],
  key: "paymentCents" | "interestCents" | "principalCents",
) => rows.reduce((total, row) => total + BigInt(String(row[key])), 0n);

describe("fixed-rate loan contract (month level)", () => {
  test("zero-rate cent schedule settles the final remainder", () => {
    const loan = schedule(1000n, "0", 3);
    expect(loan.schedule.map((row) => row.paymentCents)).toEqual([
      "333",
      "333",
      "334",
    ]);
    expect(loan.schedule.map((row) => row.balanceCents)).toEqual([
      "667",
      "334",
      "0",
    ]);
    expect(loan.totalInterestCents).toBe(0n);
    expect(loan.totalPaidCents).toBe(1000n);
    expect(loan.finalPaymentCents).toBe(334n);
  });

  test.each([
    [10000n, "12", 1, 10100n, 100n, 10100n],
    [100000n, "12", 12, 106619n, 6619n, 8884n],
  ] as const)("independent schedule fixture %p at %s%% for %i months", (principal, rate, months, totalPaid, interest, finalPayment) => {
    const loan = schedule(principal, rate, months);
    expect(loan.totalPaidCents).toBe(totalPaid);
    expect(loan.totalInterestCents).toBe(interest);
    expect(loan.finalPaymentCents).toBe(finalPayment);
    expect(loan.schedule.at(-1)?.balanceCents).toBe("0");
    expect(principal + interest).toBe(totalPaid);
    expect(sumOf(loan.schedule, "paymentCents")).toBe(totalPaid);
    expect(sumOf(loan.schedule, "interestCents")).toBe(interest);
  });

  test("honors the 100 percent annual-rate boundary", () => {
    const loan = schedule(10000n, "100", 1);
    expect(loan.schedule[0]?.interestCents).toBe("833");
    expect(loan.totalPaidCents).toBe(10833n);
  });

  test.each([
    [1650n, "4", "6", 1656n],
    [600n, "13", "7", 607n],
  ] as const)("settles exact half-cent monthly interest upward for %p cents at %s percent", (principal, rate, interestCents, totalPaidCents) => {
    const loan = schedule(principal, rate, 1);
    expect(loan.schedule[0]?.interestCents).toBe(interestCents);
    expect(loan.finalPaymentCents).toBe(totalPaidCents);
    expect(loan.regularPaymentCents).toBe(totalPaidCents);
  });

  test("half-up settles the exact regular-annuity tie and its two-month schedule", () => {
    const loan = schedule(90150n, "4", 2);
    expect(loan.regularPaymentCents).toBe(45301n);
    expect(loan.schedule.map((row) => row.interestCents)).toEqual([
      "301",
      "151",
    ]);
    expect(loan.finalPaymentCents).toBe(45301n);
    expect(loan.totalPaidCents).toBe(90602n);
    expect(loan.totalInterestCents).toBe(452n);
  });

  test("handles the smallest accepted positive rate without annuity cancellation", () => {
    const loan = schedule(10000n, `0.${"0".repeat(99)}1`, 12);
    expect(loan.regularPaymentCents).toBe(833n);
    expect(loan.totalInterestCents).toBe(0n);
    expect(loan.finalPaymentCents).toBe(837n);
    expect(loan.totalPaidCents).toBe(10000n);
  });

  test("handles maximum accepted decimal rate scale at the maximum term", () => {
    const loan = schedule(
      10000n,
      `0.${"0".repeat(99)}123456789012345678901234567890`,
      1200,
    );
    expect(loan.schedule).toHaveLength(1200);
    expect(loan.regularPaymentCents).toBe(8n);
    expect(loan.finalPaymentCents).toBe(408n);
    expect(loan.totalPaidCents).toBe(10000n);
  });

  test("rejects non-amortizing, unrepresentable and overflowing schedules", () => {
    expect(amortize(1n, "0", 1200)).toEqual({
      ok: false,
      code: "non-amortizing-payment",
    });
    expect(amortize(1n, "0", 2)).toEqual({
      ok: false,
      code: "unrepresentable-schedule",
    });
    expect(amortize(999999999999999999n, "100", 1200)).toEqual({
      ok: false,
      code: "output-overflow",
    });
  });
});

describe("mortgage calculator", () => {
  test("$400,000 home, $80,000 down, 6.5%, 30 years: independent P&I and totals", () => {
    // Independently derived with exact rationals: 32,000,000 × i / (1 − (1 + i)^−360),
    // i = 6.5/1200, is 202,261.7675… cents, settled half-up to $2,022.62. Iterating the
    // half-up-cent schedule gives a $2,020.06 final payment and $408,140.64 interest.
    const result = calculate(base);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const r = result.result;
    expect(r.principalCents).toBe("32000000");
    expect(r.regularPaymentCents).toBe("202262");
    expect(r.finalPaymentCents).toBe("202006");
    expect(r.totalInterestCents).toBe("40814064");
    expect(r.totalPaidCents).toBe("72814064");
    expect(r.months).toBe(360);
    expect(r.hasMonthlyCosts).toBe(false);
    expect(r.totalMonthlyCents).toBe("202262");
    expect(r.answer.cents).toBe("202262");
    expect(r.downPaymentPercent).toBe("20");
    expect(r.yearly).toHaveLength(30);
    expect(r.yearly[0]).toEqual({
      year: 1,
      paymentCents: "2427144",
      interestCents: "2069468",
      principalCents: "357676",
      balanceCents: "31642324",
    });
    expect(r.yearly.at(-1)?.balanceCents).toBe("0");
    expect(sumOf(r.yearly, "interestCents").toString()).toBe(
      r.totalInterestCents,
    );
    expect(sumOf(r.yearly, "principalCents").toString()).toBe("32000000");
    expect(r.visual.points.at(-1)?.balanceCents).toBe("0");
  });

  test("15-year term: independent P&I and interest", () => {
    // 32,000,000 × i / (1 − (1 + i)^−180) = 278,754.3568… cents → $2,787.54.
    const result = calculate({ ...base, years: "15" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.regularPaymentCents).toBe("278754");
    expect(result.result.finalPaymentCents).toBe("278855");
    expect(result.result.totalInterestCents).toBe("18175821");
    expect(result.result.yearly).toHaveLength(15);
  });

  test("adds tax/12, insurance/12 and HOA to principal and interest", () => {
    const result = calculate({
      ...base,
      propertyTax: "4800",
      homeInsurance: "1500",
      hoa: "50",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const r = result.result;
    expect(r.hasMonthlyCosts).toBe(true);
    expect(r.monthlyPropertyTaxCents).toBe("40000");
    expect(r.monthlyInsuranceCents).toBe("12500");
    expect(r.monthlyHoaCents).toBe("5000");
    expect(r.regularPaymentCents).toBe("202262");
    expect(r.totalMonthlyCents).toBe("259762");
    expect(r.answer.cents).toBe("259762");
    // Costs never change the loan schedule.
    expect(r.totalInterestCents).toBe("40814064");
    expect(r.working.map((step) => step.id)).toEqual([
      "loan",
      "payment",
      "final-payment",
      "totals",
      "costs",
      "total-monthly",
    ]);
  });

  test("settles each yearly cost divided by 12 half-up, including exact ties", () => {
    // $5,000/12 = 41,666.66… cents → 41,667; $1,234.50/12 = 10,287.5 cents → 10,288.
    expect(divideCentsHalfUp(500000n, 12n)).toBe(41667n);
    expect(divideCentsHalfUp(123450n, 12n)).toBe(10288n);
    expect(divideCentsHalfUp(123438n, 12n)).toBe(10287n);
    const result = calculate({
      ...base,
      propertyTax: "5000",
      homeInsurance: "1234.50",
      hoa: "0",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.totalMonthlyCents).toBe(
      String(202262 + 41667 + 10288),
    );
  });

  test("zero down payment borrows the full price; percent is exact", () => {
    const zero = calculate({
      ...base,
      homePrice: "12000",
      downPayment: "0",
      annualRate: "0",
      years: "1",
    });
    expect(zero.ok).toBe(true);
    if (!zero.ok) return;
    expect(zero.result.principalCents).toBe("1200000");
    expect(zero.result.regularPaymentCents).toBe("100000");
    expect(zero.result.downPaymentPercent).toBe("0");
    expect(zero.result.working.map((step) => step.id)).toEqual([
      "loan",
      "payment",
      "totals",
    ]);
    const third = calculate({
      ...base,
      homePrice: "300000",
      downPayment: "100000",
    });
    expect(third.ok && third.result.downPaymentPercent).toStartWith(
      "33.333333333333333333",
    );
  });

  test("accepts the 1 and 100 year term bounds", () => {
    const one = calculate({ ...base, years: "1" });
    expect(one.ok && one.result.schedule.length).toBe(12);
    const hundred = calculate({ ...base, years: "100" });
    expect(hundred.ok && hundred.result.schedule.length).toBe(1200);
  });

  test("rejects invalid inputs with field-specific codes", () => {
    const cases: [
      Partial<MortgageInput>,
      MortgageErrorCode,
      string | undefined,
    ][] = [
      [{ homePrice: "0" }, "zero-home-price", "homePrice"],
      [{ homePrice: "-1" }, "negative-home-price", "homePrice"],
      [{ homePrice: "1.001" }, "fractional-cent-home-price", "homePrice"],
      [{ homePrice: "1e5" }, "invalid-home-price", "homePrice"],
      [
        { homePrice: "10000000000000000" },
        "home-price-out-of-range",
        "homePrice",
      ],
      [{ downPayment: "-1" }, "negative-down-payment", "downPayment"],
      [{ downPayment: "0.001" }, "fractional-cent-down-payment", "downPayment"],
      [{ downPayment: "abc" }, "invalid-down-payment", "downPayment"],
      [
        { downPayment: "400000" },
        "down-payment-not-below-price",
        "downPayment",
      ],
      [
        { downPayment: "400000.01" },
        "down-payment-not-below-price",
        "downPayment",
      ],
      [{ annualRate: "100.1" }, "rate-out-of-range", "annualRate"],
      [{ annualRate: "-1" }, "rate-out-of-range", "annualRate"],
      [{ annualRate: "1e2" }, "invalid-rate", "annualRate"],
      [{ years: "0" }, "invalid-years", "years"],
      [{ years: "101" }, "invalid-years", "years"],
      [{ years: "2.5" }, "invalid-years", "years"],
      [{ years: "" }, "invalid-years", "years"],
      [{ propertyTax: "-1" }, "negative-property-tax", "propertyTax"],
      [{ propertyTax: "x" }, "invalid-property-tax", "propertyTax"],
      [{ propertyTax: "0.005" }, "fractional-cent-property-tax", "propertyTax"],
      [{ homeInsurance: "-5" }, "negative-home-insurance", "homeInsurance"],
      [
        { homeInsurance: "10000000000000000" },
        "home-insurance-out-of-range",
        "homeInsurance",
      ],
      [{ hoa: "-0.01" }, "negative-hoa", "hoa"],
      [{ hoa: "1.234" }, "fractional-cent-hoa", "hoa"],
      [
        { homePrice: "0.01", downPayment: "0", annualRate: "0", years: "100" },
        "non-amortizing-payment",
        "years",
      ],
      [
        {
          homePrice: "9999999999999999.99",
          downPayment: "0",
          annualRate: "100",
          years: "100",
        },
        "output-overflow",
        undefined,
      ],
      [
        {
          homePrice: "9999999999999999.99",
          downPayment: "0",
          annualRate: "0",
          years: "1",
          hoa: "9999999999999999.99",
        },
        "output-overflow",
        undefined,
      ],
    ];
    for (const [patch, code, field] of cases) {
      const result = calculate({ ...base, ...patch });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error).toEqual({ code, ...(field ? { field } : {}) });
    }
  });

  test("authored lesson examples match independent references and render fully", () => {
    const references: Record<string, { cents: string; dollars: string }> = {
      "example-typical": { cents: "202262", dollars: "2022.62" },
      "example-costs": { cents: "259762", dollars: "2597.62" },
      "example-fifteen": { cents: "278754", dollars: "2787.54" },
      "example-one-year": { cents: "8885", dollars: "88.85" },
    };
    let seen = 0;
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      seen += 1;
      const reference = references[block.id];
      expect(reference).toBeDefined();
      if (!reference) continue;
      expect(block.expected).toBe(reference.dollars);
      expect(
        messages[block.titleKey as keyof typeof messages].length,
      ).toBeLessThanOrEqual(60);
      const result = calculate({
        operation: "amortize",
        ...block.inputs,
      } as MortgageInput);
      expect(result.ok && result.result.answer.cents).toBe(reference.cents);
      if (!result.ok) continue;
      expect(result.result.working.map((s) => s.messageKey)).toContain(
        block.workingKey,
      );
      for (const step of result.result.working)
        expect(
          renderWorkingStep(step, { locale: "en-US", messages }),
        ).not.toContain("{");
    }
    expect(seen).toBe(Object.keys(references).length);
    // $1,000 at 12% for a year: $88.85 payments with an $88.84 final payment.
    const oneYear = calculate({
      ...base,
      homePrice: "1000",
      downPayment: "0",
      annualRate: "12",
      years: "1",
    });
    expect(oneYear.ok && oneYear.result.finalPaymentCents).toBe("8884");
    expect(oneYear.ok && oneYear.result.totalPaidCents).toBe("106619");
  });

  test("user-facing copy never says 'working'", () => {
    for (const [key, text] of Object.entries(messages))
      if (!key.startsWith("mortgage.working."))
        expect(text.toLowerCase()).not.toContain("working");
  });
});
