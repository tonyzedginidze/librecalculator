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
  operation: "project";
  balance: string;
  contribution: string;
  annualRate: string;
  years: string;
};
export const operationDescriptors = {
  project: {
    id: "project",
    labelKey: "retirement.operation.project",
    fields: [
      {
        id: "balance",
        labelKey: "retirement.field.balance",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "25000",
        input: "decimal",
      },
      {
        id: "contribution",
        labelKey: "retirement.field.contribution",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "6000",
        input: "decimal",
      },
      {
        id: "annualRate",
        labelKey: "retirement.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "6",
        input: "decimal",
      },
      {
        id: "years",
        labelKey: "retirement.field.years",
        unitKey: "retirement.unit.years",
        defaultValue: "25",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "retirement.working.summary",
        arguments: {
          balance: "decimal",
          contribution: "decimal",
          annualRate: "decimal",
          years: "decimal",
          answer: "decimal",
          reference: "decimal",
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
  calculatorId: "retirement";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "retirement-split";
    answer: string;
    /** Starting balance plus every contribution, before growth. */
    reference: string;
    starting: string;
    contributions: string;
    /** Settled projected balance minus starting balance and contributions. */
    growth: string;
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
  const balance = parseUsdCents(input.balance, { positive: false });
  if (!balance.ok) return failure("invalid-field", "balance");
  v.balance = balance.dollars;
  const contribution = parseUsdCents(input.contribution, { positive: false });
  if (!contribution.ok) return failure("invalid-field", "contribution");
  v.contribution = contribution.dollars;
  const annualRate = parseCanonicalDecimal(input.annualRate);
  if (!annualRate.ok) return failure("invalid-field", "annualRate");
  if (annualRate.value.lt(0) || annualRate.value.gt(100))
    return failure("out-of-range", "annualRate");
  v.annualRate = annualRate.value;
  const years = parseCanonicalDecimal(input.years);
  if (!years.ok) return failure("invalid-field", "years");
  if (years.value.lt(1) || years.value.gt(100) || !/^\d+$/.test(input.years))
    return failure("out-of-range", "years");
  v.years = years.value;
  let answer: InstanceType<typeof DecimalValue>;
  let projected = v.balance;
  const q = new DecimalValue(1).add(v.annualRate.div(100));
  for (let year = 0; year < Number(v.years.toFixed()); year++)
    projected = projected.mul(q).add(v.contribution);
  answer = projected;
  const contributions = v.contribution.mul(v.years);
  const reference = v.balance.add(contributions);
  const cents = roundUsdToCents(answer);
  if (cents === null) return failure("output-overflow");
  answer = new DecimalValue(usdCentsToString(cents));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const starting = decimalOutput(v.balance);
  const contributed = decimalOutput(contributions);
  const growth = decimalOutput(answer.sub(reference));
  if (
    value === null ||
    ref === null ||
    starting === null ||
    contributed === null ||
    growth === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "retirement",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "retirement.working.summary",
          args: {
            balance: { kind: "decimal", value: v.balance.toFixed() },
            contribution: { kind: "decimal", value: v.contribution.toFixed() },
            annualRate: { kind: "decimal", value: v.annualRate.toFixed() },
            years: { kind: "decimal", value: v.years.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "retirement-split",
        answer: value,
        reference: ref,
        starting,
        contributions: contributed,
        growth,
        descriptionKey: "retirement.visual.description",
        alternativeKey: "retirement.visual.alternative",
      },
    },
  };
}
