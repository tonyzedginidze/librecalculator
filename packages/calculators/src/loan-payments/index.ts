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

export type LoanPaymentInputsByOperation = {
  amortize: { principal: string; annualRate: string; months: string };
};

export const operationDescriptors = {
  amortize: {
    id: "amortize",
    labelKey: "loan-payments.operation.amortize",
    fields: [
      {
        id: "principal",
        labelKey: "loan-payments.field.principal",
        unitKey: "unit.usd",
        defaultValue: "25000.00",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "annualRate",
        labelKey: "loan-payments.field.annualRate",
        unitKey: "unit.percent",
        defaultValue: "6.9",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "months",
        labelKey: "loan-payments.field.months",
        unitKey: "loan-payments.unit.months",
        defaultValue: "60",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "loan-payments.working.summary",
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
} satisfies { [Id in keyof LoanPaymentInputsByOperation]: OperationDescriptor };

export const operations = Object.values(operationDescriptors);

export type LoanPaymentInput = {
  [Id in keyof LoanPaymentInputsByOperation]: {
    operation: Id;
  } & LoanPaymentInputsByOperation[Id];
}[keyof LoanPaymentInputsByOperation];

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
export type LoanPaymentErrorCode = (typeof errorCodes)[number];

export type LoanPayment = {
  month: number;
  paymentCents: string;
  interestCents: string;
  principalCents: string;
  balanceCents: string;
};

export type LoanPaymentPoint = {
  month: number;
  paymentCents: string;
  balanceCents: string;
};

export type LoanPaymentVisual = {
  kind: "loan-amortization";
  points: readonly LoanPaymentPoint[];
  descriptionKey: "loan-payments.visual.description";
  alternativeKey: "loan-payments.visual.alternative";
};

export type LoanPaymentWorkingArguments = {
  principal: NumericValue;
  annualRate: NumericValue;
  months: { kind: "text"; value: string };
  payment: NumericValue;
  finalPayment: NumericValue;
  interest: NumericValue;
};

export type LoanPaymentResult = {
  calculatorId: "loan-payments";
  operation: "amortize";
  answer: { kind: "usd-money"; currency: "USD"; cents: string };
  principalCents: string;
  regularPaymentCents: string;
  finalPaymentCents: string;
  totalInterestCents: string;
  schedule: readonly LoanPayment[];
  working: readonly WorkingStep<LoanPaymentWorkingArguments>[];
  visual: LoanPaymentVisual;
};

export function calculate(
  input: LoanPaymentInput,
): CalculationResult<LoanPaymentResult, LoanPaymentErrorCode> {
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
  const schedule: LoanPayment[] = [];
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

  const schedulePoints: LoanPaymentPoint[] = schedule.map((payment) => ({
    month: payment.month,
    paymentCents: payment.paymentCents,
    balanceCents: payment.balanceCents,
  }));
  const working: WorkingStep<LoanPaymentWorkingArguments>[] = [
    {
      id: "schedule-summary",
      messageKey: "loan-payments.working.summary",
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
      calculatorId: "loan-payments",
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
      working,
      visual: {
        kind: "loan-amortization",
        points: schedulePoints,
        descriptionKey: "loan-payments.visual.description",
        alternativeKey: "loan-payments.visual.alternative",
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
  code: LoanPaymentErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<LoanPaymentErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
