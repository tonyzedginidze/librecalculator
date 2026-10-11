import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { parseCanonicalDecimal } from "../numeric/decimal";
import {
  calculateRegularPaymentCents,
  MAX_USD_CENTS,
  parseUsdCents,
  settleMonthlyInterestCents,
  usdCentsToString,
} from "../numeric/money";

export type MortgageInputsByOperation = {
  amortize: { principal: string; annualRate: string; months: string };
};

export const operationDescriptors = {
  amortize: {
    id: "amortize",
    labelKey: "mortgage.operation.amortize",
    fields: [
      {
        id: "principal",
        labelKey: "mortgage.field.principal",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "300000",
        input: "decimal",
      },
      {
        id: "annualRate",
        labelKey: "mortgage.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "6.5",
        input: "decimal",
      },
      {
        id: "months",
        labelKey: "mortgage.field.months",
        unitKey: "mortgage.unit.months",
        defaultValue: "360",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "mortgage.working.summary",
        arguments: {
          principal: "decimal",
          annualRate: "decimal",
          months: "text",
          payment: "decimal",
          finalPayment: "decimal",
          interest: "decimal",
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
  "invalid-principal",
  "negative-principal",
  "zero-principal",
  "fractional-cent-principal",
  "principal-out-of-range",
  "invalid-rate",
  "rate-out-of-range",
  "invalid-months",
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

export type MortgageWorkingArguments = {
  principal: NumericValue;
  annualRate: NumericValue;
  months: { kind: "text"; value: string };
  payment: NumericValue;
  finalPayment: NumericValue;
  interest: NumericValue;
};

export type MortgageResult = {
  calculatorId: "mortgage";
  operation: "amortize";
  answer: { kind: "usd-money"; currency: "USD"; cents: string };
  principalCents: string;
  regularPaymentCents: string;
  finalPaymentCents: string;
  totalInterestCents: string;
  schedule: readonly Mortgage[];
  years: readonly MortgageYear[];
  working: readonly WorkingStep<MortgageWorkingArguments>[];
  visual: MortgageVisual;
};

export function calculate(
  input: MortgageInput,
): CalculationResult<MortgageResult, MortgageErrorCode> {
  const principal = parseUsdCents(input.principal, { positive: true });
  if (!principal.ok) {
    if (principal.error === "negative")
      return failed("negative-principal", "principal");
    if (principal.error === "zero")
      return failed("zero-principal", "principal");
    if (principal.error === "fractional-cent")
      return failed("fractional-cent-principal", "principal");
    if (principal.error === "out-of-range")
      return failed("principal-out-of-range", "principal");
    return failed("invalid-principal", "principal");
  }

  const annualRate = parseCanonicalDecimal(input.annualRate);
  if (!annualRate.ok) return failed("invalid-rate", "annualRate");
  if (
    (annualRate.value.isNegative() && !annualRate.value.isZero()) ||
    annualRate.value.gt(100)
  )
    return failed("rate-out-of-range", "annualRate");

  const months = boundedMonths(input.months);
  if (months === null) return failed("invalid-months", "months");

  const regularPaymentCents = calculateRegularPaymentCents(
    principal.cents,
    annualRate.canonical,
    months,
  );
  if (regularPaymentCents === null) return failed("output-overflow");
  if (regularPaymentCents === 0n)
    return failed("non-amortizing-payment", "months");

  let balanceCents = principal.cents;
  let totalPaidCents = 0n;
  let totalInterestCents = 0n;
  let finalPaymentCents = 0n;
  const schedule: Mortgage[] = [];
  for (let month = 1; month <= months; month += 1) {
    const interestCents = settleMonthlyInterestCents(
      balanceCents,
      annualRate.canonical,
    );
    if (interestCents === null) return failed("output-overflow");
    const dueCents = balanceCents + interestCents;
    if (dueCents > MAX_USD_CENTS) return failed("output-overflow");

    let paymentCents: bigint;
    if (month === months) {
      paymentCents = dueCents;
      finalPaymentCents = paymentCents;
    } else {
      if (regularPaymentCents <= interestCents)
        return failed("non-amortizing-payment", "months");
      if (regularPaymentCents >= dueCents)
        return failed("unrepresentable-schedule", "months");
      paymentCents = regularPaymentCents;
    }
    const principalPaidCents = paymentCents - interestCents;
    if (principalPaidCents <= 0n)
      return failed("non-amortizing-payment", "months");
    balanceCents = dueCents - paymentCents;
    if (month < months && balanceCents <= 0n)
      return failed("unrepresentable-schedule", "months");

    totalPaidCents += paymentCents;
    totalInterestCents += interestCents;
    if (totalPaidCents > MAX_USD_CENTS || totalInterestCents > MAX_USD_CENTS)
      return failed("output-overflow");
    schedule.push({
      month,
      paymentCents: paymentCents.toString(),
      interestCents: interestCents.toString(),
      principalCents: principalPaidCents.toString(),
      balanceCents: balanceCents.toString(),
    });
  }
  if (balanceCents !== 0n) return failed("unrepresentable-schedule", "months");

  const years: MortgageYear[] = [];
  for (let start = 0; start < schedule.length; start += 12) {
    const rows = schedule.slice(start, start + 12);
    const sum = (key: "paymentCents" | "interestCents" | "principalCents") =>
      rows.reduce((total, row) => total + BigInt(row[key]), 0n).toString();
    years.push({
      year: start / 12 + 1,
      paymentCents: sum("paymentCents"),
      interestCents: sum("interestCents"),
      principalCents: sum("principalCents"),
      balanceCents: rows[rows.length - 1]?.balanceCents ?? "0",
    });
  }

  const schedulePoints: MortgagePoint[] = schedule.map((payment) => ({
    month: payment.month,
    paymentCents: payment.paymentCents,
    balanceCents: payment.balanceCents,
  }));
  const working: WorkingStep<MortgageWorkingArguments>[] = [
    {
      id: "schedule-summary",
      messageKey: "mortgage.working.summary",
      args: {
        principal: decimalArgument(usdCentsToString(principal.cents)),
        annualRate: decimalArgument(annualRate.canonical),
        months: { kind: "text", value: String(months) },
        payment: decimalArgument(usdCentsToString(regularPaymentCents)),
        finalPayment: decimalArgument(usdCentsToString(finalPaymentCents)),
        interest: decimalArgument(usdCentsToString(totalInterestCents)),
      },
    },
  ];

  return {
    ok: true,
    result: {
      calculatorId: "mortgage",
      operation: "amortize",
      answer: {
        kind: "usd-money",
        currency: "USD",
        cents: totalPaidCents.toString(),
      },
      principalCents: principal.cents.toString(),
      regularPaymentCents: regularPaymentCents.toString(),
      finalPaymentCents: finalPaymentCents.toString(),
      totalInterestCents: totalInterestCents.toString(),
      schedule,
      years,
      working,
      visual: {
        kind: "loan-amortization",
        points: schedulePoints,
        descriptionKey: "mortgage.visual.description",
        alternativeKey: "mortgage.visual.alternative",
      },
    },
  };
}

function boundedMonths(text: string): number | null {
  if (!/^\d+$/.test(text) || text.length > 4) return null;
  const value = BigInt(text);
  if (value < 1n || value > 1200n) return null;
  return Number(value);
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(
  code: MortgageErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<MortgageErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
