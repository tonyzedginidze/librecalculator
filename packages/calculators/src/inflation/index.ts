import type {
  CalculationResult,
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
export type Input = {
  operation: "future-cost" | "purchasing-power";
  amount: string;
  annualRate: string;
  years: string;
};
export const operationDescriptors = {
  "future-cost": {
    id: "future-cost",
    labelKey: "inflation.operation.future-cost",
    fields: [
      {
        id: "amount",
        labelKey: "inflation.field.amount",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "1000",
        input: "decimal",
      },
      {
        id: "annualRate",
        labelKey: "inflation.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "3",
        input: "decimal",
      },
      {
        id: "years",
        labelKey: "inflation.field.years",
        unitKey: "inflation.unit.years",
        defaultValue: "10",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "inflation.working.summary",
        arguments: {
          amount: "decimal",
          annualRate: "decimal",
          years: "decimal",
          question: "message",
          answer: "decimal",
        },
      },
    ],
  },
  "purchasing-power": {
    id: "purchasing-power",
    labelKey: "inflation.operation.purchasing-power",
    fields: [
      {
        id: "amount",
        labelKey: "inflation.field.amount",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "1000",
        input: "decimal",
      },
      {
        id: "annualRate",
        labelKey: "inflation.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "3",
        input: "decimal",
      },
      {
        id: "years",
        labelKey: "inflation.field.years",
        unitKey: "inflation.unit.years",
        defaultValue: "10",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "inflation.working.summary",
        arguments: {
          amount: "decimal",
          annualRate: "decimal",
          years: "decimal",
          question: "message",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<Input["operation"], OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export const errorCodes = [
  "invalid-field",
  "out-of-range",
  "output-overflow",
] as const;
export type ErrorCode = (typeof errorCodes)[number];
export type Result = {
  calculatorId: "inflation";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "then-now";
    answer: string;
    /** The entered amount, unchanged. */
    reference: string;
    years: string;
    descriptionKey: string;
    alternativeKey: string;
  };
};
function failure(
  code: ErrorCode,
  field?: string,
): CalculationResult<Result, ErrorCode> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
export function calculate(input: Input): CalculationResult<Result, ErrorCode> {
  if (!Object.hasOwn(operationDescriptors, input.operation))
    return failure("invalid-field");
  const v = {} as Record<string, InstanceType<typeof DecimalValue>>;
  const amount = parseUsdCents(input.amount, { positive: false });
  if (!amount.ok) return failure("invalid-field", "amount");
  v.amount = amount.dollars;
  const annualRate = parseCanonicalDecimal(input.annualRate);
  if (!annualRate.ok) return failure("invalid-field", "annualRate");
  if (annualRate.value.lt(0) || annualRate.value.gt(100))
    return failure("out-of-range", "annualRate");
  v.annualRate = annualRate.value;
  const years = parseCanonicalDecimal(input.years);
  if (!years.ok) return failure("invalid-field", "years");
  if (years.value.lt(0) || years.value.gt(100) || !/^\d+$/.test(input.years))
    return failure("out-of-range", "years");
  v.years = years.value;
  const growth = new DecimalValue(1)
    .add(v.annualRate.div(100))
    .pow(Number(v.years.toFixed()));
  let answer =
    input.operation === "future-cost"
      ? v.amount.mul(growth)
      : v.amount.div(growth);
  const reference = v.amount;
  const cents = roundUsdToCents(answer);
  if (cents === null) return failure("output-overflow");
  answer = new DecimalValue(usdCentsToString(cents));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  if (value === null || ref === null) return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "inflation",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "inflation.working.summary",
          args: {
            amount: { kind: "decimal", value: v.amount.toFixed() },
            annualRate: { kind: "decimal", value: v.annualRate.toFixed() },
            years: { kind: "decimal", value: v.years.toFixed() },
            question: {
              kind: "message",
              key: `inflation.operation.${input.operation}`,
            },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "then-now",
        answer: value,
        reference: ref,
        years: v.years.toFixed(),
        descriptionKey: "inflation.visual.description",
        alternativeKey: "inflation.visual.alternative",
      },
    },
  };
}
