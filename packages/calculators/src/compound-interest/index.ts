import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
import {
  parseUsdCents,
  roundUsdToCents,
  usdCentsToString,
} from "../numeric/money";

export type CompoundInterestInputsByOperation = {
  compound: {
    principal: string;
    annualRate: string;
    years: string;
    frequency: string;
  };
};

export const operationDescriptors = {
  compound: {
    id: "compound",
    labelKey: "compound-interest.operation.compound",
    fields: [
      {
        id: "principal",
        labelKey: "compound-interest.field.principal",
        unitKey: "unit.usd",
        defaultValue: "10000.00",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "annualRate",
        labelKey: "compound-interest.field.annualRate",
        unitKey: "unit.percent",
        defaultValue: "5",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "years",
        labelKey: "compound-interest.field.years",
        unitKey: "compound-interest.unit.years",
        defaultValue: "10",
        input: "integer",
      },
      {
        id: "frequency",
        labelKey: "compound-interest.field.frequency",
        unitKey: "compound-interest.unit.per-year",
        defaultValue: "12",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "compound-interest.working.summary",
        arguments: {
          principal: "decimal",
          annualRate: "decimal",
          years: "text",
          frequency: "text",
          balance: "decimal",
          interest: "decimal",
        },
      },
    ],
  },
} satisfies {
  [Id in keyof CompoundInterestInputsByOperation]: OperationDescriptor;
};

export const operations = Object.values(operationDescriptors);

export type CompoundInterestInput = {
  [Id in keyof CompoundInterestInputsByOperation]: {
    operation: Id;
  } & CompoundInterestInputsByOperation[Id];
}[keyof CompoundInterestInputsByOperation];

export const errorCodes = [
  "invalid-principal",
  "negative-principal",
  "fractional-cent-principal",
  "principal-out-of-range",
  "invalid-rate",
  "rate-out-of-range",
  "invalid-years",
  "invalid-frequency",
  "output-overflow",
] as const;
export type CompoundInterestErrorCode = (typeof errorCodes)[number];

export type CompoundInterestPoint = {
  year: number;
  balanceCents: string;
};

export type CompoundInterestVisual = {
  kind: "compound-growth";
  series: readonly CompoundInterestPoint[];
  descriptionKey: "compound-interest.visual.description";
  alternativeKey: "compound-interest.visual.alternative";
};

export type CompoundInterestWorkingArguments = {
  principal: NumericValue;
  annualRate: NumericValue;
  years: { kind: "text"; value: string };
  frequency: { kind: "text"; value: string };
  balance: NumericValue;
  interest: NumericValue;
};

export type CompoundInterestResult = {
  calculatorId: "compound-interest";
  operation: "compound";
  answer: { kind: "usd-money"; currency: "USD"; cents: string };
  principalCents: string;
  interestCents: string;
  periods: number;
  annualSeries: readonly CompoundInterestPoint[];
  working: readonly WorkingStep<CompoundInterestWorkingArguments>[];
  visual: CompoundInterestVisual;
};

export function calculate(
  input: CompoundInterestInput,
): CalculationResult<CompoundInterestResult, CompoundInterestErrorCode> {
  const principal = parseUsdCents(input.principal);
  if (!principal.ok) {
    if (principal.error === "negative")
      return failed("negative-principal", "principal");
    if (principal.error === "fractional-cent")
      return failed("fractional-cent-principal", "principal");
    if (principal.error === "out-of-range")
      return failed("principal-out-of-range", "principal");
    return failed("invalid-principal", "principal");
  }

  const rate = parseCanonicalDecimal(input.annualRate);
  if (!rate.ok) return failed("invalid-rate", "annualRate");
  if ((rate.value.isNegative() && !rate.value.isZero()) || rate.value.gt(100))
    return failed("rate-out-of-range", "annualRate");

  const years = boundedInteger(input.years, 1, 1000);
  if (years === null) return failed("invalid-years", "years");
  const frequency = boundedInteger(input.frequency, 1, 365);
  if (frequency === null || ![1, 2, 4, 12, 365].includes(frequency))
    return failed("invalid-frequency", "frequency");

  const perPeriodRate = rate.value.div(100).div(frequency);
  const annualFactor = new DecimalValue(1).add(perPeriodRate).pow(frequency);
  const principalDollars = principal.dollars;
  const annualSeries: CompoundInterestPoint[] = [];
  for (let year = 1; year <= years; year += 1) {
    const projected = principalDollars.mul(annualFactor.pow(year));
    if (decimalOutput(projected) === null) return failed("output-overflow");
    const balanceCents = roundUsdToCents(projected);
    if (balanceCents === null) return failed("output-overflow");
    annualSeries.push({ year, balanceCents: balanceCents.toString() });
  }

  const finalPoint = annualSeries.at(-1);
  if (!finalPoint) return failed("output-overflow");
  const balanceCents = BigInt(finalPoint.balanceCents);
  const interestCents = balanceCents - principal.cents;
  const interestValue = new DecimalValue(usdCentsToString(interestCents));
  const balanceValue = new DecimalValue(usdCentsToString(balanceCents));
  const working: WorkingStep<CompoundInterestWorkingArguments>[] = [
    {
      id: "compound-substitution",
      messageKey: "compound-interest.working.summary",
      args: {
        principal: decimalArgument(usdCentsToString(principal.cents)),
        annualRate: decimalArgument(rate.canonical),
        years: { kind: "text", value: String(years) },
        frequency: { kind: "text", value: String(frequency) },
        balance: decimalArgument(balanceValue.toFixed()),
        interest: decimalArgument(interestValue.toFixed()),
      },
    },
  ];

  const series = annualSeries;
  return {
    ok: true,
    result: {
      calculatorId: "compound-interest",
      operation: "compound",
      answer: {
        kind: "usd-money",
        currency: "USD",
        cents: balanceCents.toString(),
      },
      principalCents: principal.cents.toString(),
      interestCents: interestCents.toString(),
      periods: years * frequency,
      annualSeries: series,
      working,
      visual: {
        kind: "compound-growth",
        series,
        descriptionKey: "compound-interest.visual.description",
        alternativeKey: "compound-interest.visual.alternative",
      },
    },
  };
}

function boundedInteger(
  text: string,
  minimum: number,
  maximum: number,
): number | null {
  if (!/^\d+$/.test(text) || text.length > 12) return null;
  const value = BigInt(text);
  if (value < BigInt(minimum) || value > BigInt(maximum)) return null;
  return Number(value);
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(
  code: CompoundInterestErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<CompoundInterestErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
