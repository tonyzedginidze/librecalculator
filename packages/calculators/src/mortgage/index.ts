import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { DecimalValue, parseCanonicalDecimal } from "../numeric/decimal";
import {
  calculateRegularPaymentCents,
  MAX_USD_CENTS,
  parseUsdCents,
  settleMonthlyInterestCents,
  usdCentsToString,
} from "../numeric/money";

export type MortgageInputsByOperation = {
  amortize: {
    homePrice: string;
    downPayment: string;
    annualRate: string;
    years: string;
    propertyTax: string;
    homeInsurance: string;
    hoa: string;
  };
};

const money = (
  id: string,
  labelKey: string,
  defaultValue: string,
  unitKey = "unit.usd",
) =>
  ({
    id,
    labelKey,
    unitKey,
    sign: "nonnegative",
    defaultValue,
    input: "decimal",
  }) as const;

export const operationDescriptors = {
  amortize: {
    id: "amortize",
    labelKey: "mortgage.operation.amortize",
    fields: [
      money("homePrice", "mortgage.field.homePrice", "400000"),
      money("downPayment", "mortgage.field.downPayment", "80000"),
      {
        id: "annualRate",
        labelKey: "mortgage.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "6.5",
        input: "decimal",
      },
      {
        id: "years",
        labelKey: "mortgage.field.years",
        unitKey: "mortgage.unit.years",
        defaultValue: "30",
        input: "integer",
      },
      money(
        "propertyTax",
        "mortgage.field.propertyTax",
        "4800",
        "mortgage.unit.per-year",
      ),
      money(
        "homeInsurance",
        "mortgage.field.homeInsurance",
        "1500",
        "mortgage.unit.per-year",
      ),
      money("hoa", "mortgage.field.hoa", "0", "mortgage.unit.per-month"),
    ],
    working: [
      {
        messageKey: "mortgage.working.loan",
        arguments: {
          homePrice: "decimal",
          downPayment: "decimal",
          loan: "decimal",
        },
      },
      {
        messageKey: "mortgage.working.payment",
        arguments: {
          loan: "decimal",
          annualRate: "decimal",
          years: "text",
          months: "text",
          payment: "decimal",
        },
      },
      {
        messageKey: "mortgage.working.final-payment",
        arguments: { finalPayment: "decimal" },
      },
      {
        messageKey: "mortgage.working.totals",
        arguments: { totalPaid: "decimal", interest: "decimal" },
      },
      {
        messageKey: "mortgage.working.costs",
        arguments: {
          propertyTax: "decimal",
          monthlyTax: "decimal",
          homeInsurance: "decimal",
          monthlyInsurance: "decimal",
        },
      },
      {
        messageKey: "mortgage.working.total-monthly",
        arguments: {
          payment: "decimal",
          monthlyTax: "decimal",
          monthlyInsurance: "decimal",
          hoa: "decimal",
          totalMonthly: "decimal",
        },
      },
    ],
  },
} satisfies { [Id in keyof MortgageInputsByOperation]: OperationDescriptor };

export const operations = Object.values(operationDescriptors);

export type MortgageInput = {
  [Id in keyof MortgageInputsByOperation]: {
    operation: Id;
  } & MortgageInputsByOperation[Id];
}[keyof MortgageInputsByOperation];

export const errorCodes = [
  "invalid-home-price",
  "negative-home-price",
  "zero-home-price",
  "fractional-cent-home-price",
  "home-price-out-of-range",
  "invalid-down-payment",
  "negative-down-payment",
  "fractional-cent-down-payment",
  "down-payment-out-of-range",
  "down-payment-not-below-price",
  "invalid-rate",
  "rate-out-of-range",
  "invalid-years",
  "invalid-property-tax",
  "negative-property-tax",
  "fractional-cent-property-tax",
  "property-tax-out-of-range",
  "invalid-home-insurance",
  "negative-home-insurance",
  "fractional-cent-home-insurance",
  "home-insurance-out-of-range",
  "invalid-hoa",
  "negative-hoa",
  "fractional-cent-hoa",
  "hoa-out-of-range",
  "non-amortizing-payment",
  "unrepresentable-schedule",
  "output-overflow",
] as const;
export type MortgageErrorCode = (typeof errorCodes)[number];

export type Mortgage = {
  month: number;
  paymentCents: string;
  interestCents: string;
  principalCents: string;
  balanceCents: string;
};

/** Twelve schedule rows (fewer in a final partial year) summed in exact cents. */
export type MortgageYear = {
  year: number;
  paymentCents: string;
  interestCents: string;
  principalCents: string;
  balanceCents: string;
};

export type MortgagePoint = {
  month: number;
  paymentCents: string;
  balanceCents: string;
};

export type MortgageVisual = {
  kind: "loan-amortization";
  points: readonly MortgagePoint[];
  descriptionKey: "mortgage.visual.description";
  alternativeKey: "mortgage.visual.alternative";
};

type Text = { kind: "text"; value: string };
export type MortgageWorkingArguments = Readonly<
  Record<string, NumericValue | Text>
>;

export type MortgageResult = {
  calculatorId: "mortgage";
  operation: "amortize";
  /** Total monthly payment: regular principal and interest plus monthly costs. */
  answer: { kind: "usd-money"; currency: "USD"; cents: string };
  homePriceCents: string;
  downPaymentCents: string;
  /** Down payment as a percentage of the home price, 50 significant digits, unsettled. */
  downPaymentPercent: string;
  principalCents: string;
  years: number;
  months: number;
  regularPaymentCents: string;
  finalPaymentCents: string;
  totalPaidCents: string;
  totalInterestCents: string;
  monthlyPropertyTaxCents: string;
  monthlyInsuranceCents: string;
  monthlyHoaCents: string;
  /** True when any of property tax, insurance or HOA is above zero. */
  hasMonthlyCosts: boolean;
  totalMonthlyCents: string;
  schedule: readonly Mortgage[];
  yearly: readonly MortgageYear[];
  working: readonly WorkingStep<MortgageWorkingArguments>[];
  visual: MortgageVisual;
};

type Failure = { ok: false; error: EngineFailure<MortgageErrorCode> };

export type MortgageSchedule = {
  regularPaymentCents: bigint;
  finalPaymentCents: bigint;
  totalPaidCents: bigint;
  totalInterestCents: bigint;
  schedule: Mortgage[];
};

/**
 * The fixed-rate monthly loan contract: exact rational regular payment settled
 * half-up once, then an integer-cent schedule whose final payment clears the loan.
 */
export function amortize(
  principalCents: bigint,
  annualRate: string,
  months: number,
):
  | { ok: true; value: MortgageSchedule }
  | {
      ok: false;
      code:
        | "non-amortizing-payment"
        | "unrepresentable-schedule"
        | "output-overflow";
    } {
  const regularPaymentCents = calculateRegularPaymentCents(
    principalCents,
    annualRate,
    months,
  );
  if (regularPaymentCents === null)
    return { ok: false, code: "output-overflow" };
  if (regularPaymentCents === 0n)
    return { ok: false, code: "non-amortizing-payment" };

  let balanceCents = principalCents;
  let totalPaidCents = 0n;
  let totalInterestCents = 0n;
  let finalPaymentCents = 0n;
  const schedule: Mortgage[] = [];
  for (let month = 1; month <= months; month += 1) {
    const interestCents = settleMonthlyInterestCents(balanceCents, annualRate);
    if (interestCents === null) return { ok: false, code: "output-overflow" };
    const dueCents = balanceCents + interestCents;
    if (dueCents > MAX_USD_CENTS) return { ok: false, code: "output-overflow" };

    let paymentCents: bigint;
    if (month === months) {
      paymentCents = dueCents;
      finalPaymentCents = paymentCents;
    } else {
      if (regularPaymentCents <= interestCents)
        return { ok: false, code: "non-amortizing-payment" };
      if (regularPaymentCents >= dueCents)
        return { ok: false, code: "unrepresentable-schedule" };
      paymentCents = regularPaymentCents;
    }
    const principalPaidCents = paymentCents - interestCents;
    if (principalPaidCents <= 0n)
      return { ok: false, code: "non-amortizing-payment" };
    balanceCents = dueCents - paymentCents;
    if (month < months && balanceCents <= 0n)
      return { ok: false, code: "unrepresentable-schedule" };

    totalPaidCents += paymentCents;
    totalInterestCents += interestCents;
    if (totalPaidCents > MAX_USD_CENTS || totalInterestCents > MAX_USD_CENTS)
      return { ok: false, code: "output-overflow" };
    schedule.push({
      month,
      paymentCents: paymentCents.toString(),
      interestCents: interestCents.toString(),
      principalCents: principalPaidCents.toString(),
      balanceCents: balanceCents.toString(),
    });
  }
  if (balanceCents !== 0n)
    return { ok: false, code: "unrepresentable-schedule" };
  return {
    ok: true,
    value: {
      regularPaymentCents,
      finalPaymentCents,
      totalPaidCents,
      totalInterestCents,
      schedule,
    },
  };
}

/** Divide integer cents by a positive integer, settling half-up to whole cents. */
export function divideCentsHalfUp(cents: bigint, divisor: bigint): bigint {
  return (2n * cents + divisor) / (2n * divisor);
}

export function calculate(
  input: MortgageInput,
): CalculationResult<MortgageResult, MortgageErrorCode> {
  const homePrice = parseUsdCents(input.homePrice, { positive: true });
  if (!homePrice.ok)
    return moneyFailure(homePrice.error, "home-price", "homePrice");

  const downPayment = parseUsdCents(input.downPayment);
  if (!downPayment.ok)
    return moneyFailure(downPayment.error, "down-payment", "downPayment");
  if (downPayment.cents >= homePrice.cents)
    return failed("down-payment-not-below-price", "downPayment");

  const annualRate = parseCanonicalDecimal(input.annualRate);
  if (!annualRate.ok) return failed("invalid-rate", "annualRate");
  if (
    (annualRate.value.isNegative() && !annualRate.value.isZero()) ||
    annualRate.value.gt(100)
  )
    return failed("rate-out-of-range", "annualRate");

  const years = boundedYears(input.years);
  if (years === null) return failed("invalid-years", "years");
  const months = years * 12;

  const propertyTax = parseUsdCents(input.propertyTax);
  if (!propertyTax.ok)
    return moneyFailure(propertyTax.error, "property-tax", "propertyTax");
  const homeInsurance = parseUsdCents(input.homeInsurance);
  if (!homeInsurance.ok)
    return moneyFailure(homeInsurance.error, "home-insurance", "homeInsurance");
  const hoa = parseUsdCents(input.hoa);
  if (!hoa.ok) return moneyFailure(hoa.error, "hoa", "hoa");

  const principalCents = homePrice.cents - downPayment.cents;
  const loan = amortize(principalCents, annualRate.canonical, months);
  if (!loan.ok)
    return failed(
      loan.code,
      loan.code === "output-overflow" ? undefined : "years",
    );
  const {
    regularPaymentCents,
    finalPaymentCents,
    totalPaidCents,
    totalInterestCents,
    schedule,
  } = loan.value;

  const monthlyTaxCents = divideCentsHalfUp(propertyTax.cents, 12n);
  const monthlyInsuranceCents = divideCentsHalfUp(homeInsurance.cents, 12n);
  const totalMonthlyCents =
    regularPaymentCents + monthlyTaxCents + monthlyInsuranceCents + hoa.cents;
  if (totalMonthlyCents > MAX_USD_CENTS) return failed("output-overflow");
  const hasMonthlyCosts =
    propertyTax.cents > 0n || homeInsurance.cents > 0n || hoa.cents > 0n;

  const yearly: MortgageYear[] = [];
  for (let start = 0; start < schedule.length; start += 12) {
    const rows = schedule.slice(start, start + 12);
    const sum = (key: "paymentCents" | "interestCents" | "principalCents") =>
      rows.reduce((total, row) => total + BigInt(row[key]), 0n).toString();
    yearly.push({
      year: start / 12 + 1,
      paymentCents: sum("paymentCents"),
      interestCents: sum("interestCents"),
      principalCents: sum("principalCents"),
      balanceCents: rows[rows.length - 1]?.balanceCents ?? "0",
    });
  }

  const usd = (cents: bigint) => decimalArgument(usdCentsToString(cents));
  const working: WorkingStep<MortgageWorkingArguments>[] = [
    {
      id: "loan",
      messageKey: "mortgage.working.loan",
      args: {
        homePrice: usd(homePrice.cents),
        downPayment: usd(downPayment.cents),
        loan: usd(principalCents),
      },
    },
    {
      id: "payment",
      messageKey: "mortgage.working.payment",
      args: {
        loan: usd(principalCents),
        annualRate: decimalArgument(annualRate.canonical),
        years: { kind: "text", value: String(years) },
        months: { kind: "text", value: String(months) },
        payment: usd(regularPaymentCents),
      },
    },
  ];
  if (finalPaymentCents !== regularPaymentCents)
    working.push({
      id: "final-payment",
      messageKey: "mortgage.working.final-payment",
      args: { finalPayment: usd(finalPaymentCents) },
    });
  working.push({
    id: "totals",
    messageKey: "mortgage.working.totals",
    args: { totalPaid: usd(totalPaidCents), interest: usd(totalInterestCents) },
  });
  if (hasMonthlyCosts)
    working.push(
      {
        id: "costs",
        messageKey: "mortgage.working.costs",
        args: {
          propertyTax: usd(propertyTax.cents),
          monthlyTax: usd(monthlyTaxCents),
          homeInsurance: usd(homeInsurance.cents),
          monthlyInsurance: usd(monthlyInsuranceCents),
        },
      },
      {
        id: "total-monthly",
        messageKey: "mortgage.working.total-monthly",
        args: {
          payment: usd(regularPaymentCents),
          monthlyTax: usd(monthlyTaxCents),
          monthlyInsurance: usd(monthlyInsuranceCents),
          hoa: usd(hoa.cents),
          totalMonthly: usd(totalMonthlyCents),
        },
      },
    );

  return {
    ok: true,
    result: {
      calculatorId: "mortgage",
      operation: "amortize",
      answer: {
        kind: "usd-money",
        currency: "USD",
        cents: totalMonthlyCents.toString(),
      },
      homePriceCents: homePrice.cents.toString(),
      downPaymentCents: downPayment.cents.toString(),
      downPaymentPercent: new DecimalValue(downPayment.cents.toString())
        .mul(100)
        .div(homePrice.cents.toString())
        .toFixed(),
      principalCents: principalCents.toString(),
      years,
      months,
      regularPaymentCents: regularPaymentCents.toString(),
      finalPaymentCents: finalPaymentCents.toString(),
      totalPaidCents: totalPaidCents.toString(),
      totalInterestCents: totalInterestCents.toString(),
      monthlyPropertyTaxCents: monthlyTaxCents.toString(),
      monthlyInsuranceCents: monthlyInsuranceCents.toString(),
      monthlyHoaCents: hoa.cents.toString(),
      hasMonthlyCosts,
      totalMonthlyCents: totalMonthlyCents.toString(),
      schedule,
      yearly,
      working,
      visual: {
        kind: "loan-amortization",
        points: schedule.map((payment) => ({
          month: payment.month,
          paymentCents: payment.paymentCents,
          balanceCents: payment.balanceCents,
        })),
        descriptionKey: "mortgage.visual.description",
        alternativeKey: "mortgage.visual.alternative",
      },
    },
  };
}

function moneyFailure(
  error:
    | "invalid-number"
    | "out-of-range"
    | "negative"
    | "zero"
    | "fractional-cent",
  name:
    | "home-price"
    | "down-payment"
    | "property-tax"
    | "home-insurance"
    | "hoa",
  field: string,
): Failure {
  if (error === "negative") return failed(`negative-${name}`, field);
  if (error === "zero" && name === "home-price")
    return failed("zero-home-price", field);
  if (error === "fractional-cent")
    return failed(`fractional-cent-${name}`, field);
  if (error === "out-of-range") return failed(`${name}-out-of-range`, field);
  return failed(`invalid-${name}`, field);
}

/** Whole years 1–100, so the monthly term stays within the 1–1200 month contract. */
function boundedYears(text: string): number | null {
  if (!/^\d+$/.test(text) || text.length > 3) return null;
  const value = Number(text);
  if (value < 1 || value > 100) return null;
  return value;
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(code: MortgageErrorCode, field?: string): Failure {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
