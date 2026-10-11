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
  operation: "annual-to-hourly" | "hourly-to-annual";
  pay: string;
  hours: string;
  weeks: string;
};
export const operationDescriptors = {
  "annual-to-hourly": {
    id: "annual-to-hourly",
    labelKey: "salary.operation.annual-to-hourly",
    fields: [
      {
        id: "pay",
        labelKey: "salary.field.annual",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "65000",
        input: "decimal",
      },
      {
        id: "hours",
        labelKey: "salary.field.hours",
        unitKey: "salary.unit.hours",
        sign: "nonnegative",
        defaultValue: "40",
        input: "decimal",
      },
      {
        id: "weeks",
        labelKey: "salary.field.weeks",
        unitKey: "salary.unit.weeks",
        defaultValue: "52",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "salary.working.summary",
        arguments: {
          pay: "decimal",
          hours: "decimal",
          weeks: "decimal",
          question: "message",
          answer: "decimal",
        },
      },
    ],
  },
  "hourly-to-annual": {
    id: "hourly-to-annual",
    labelKey: "salary.operation.hourly-to-annual",
    fields: [
      {
        id: "pay",
        labelKey: "salary.field.hourly",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "30",
        input: "decimal",
      },
      {
        id: "hours",
        labelKey: "salary.field.hours",
        unitKey: "salary.unit.hours",
        sign: "nonnegative",
        defaultValue: "40",
        input: "decimal",
      },
      {
        id: "weeks",
        labelKey: "salary.field.weeks",
        unitKey: "salary.unit.weeks",
        defaultValue: "52",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "salary.working.summary",
        arguments: {
          pay: "decimal",
          hours: "decimal",
          weeks: "decimal",
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
  calculatorId: "salary";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "pay-periods";
    answer: string;
    /** The entered pay amount. */
    reference: string;
    /** Gross pay per period, each settled once to cents from exact values. */
    hourly: string;
    weekly: string;
    monthly: string;
    annual: string;
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
  const pay = parseUsdCents(input.pay, { positive: false });
  if (!pay.ok) return failure("invalid-field", "pay");
  v.pay = pay.dollars;
  const hours = parseCanonicalDecimal(input.hours);
  if (!hours.ok) return failure("invalid-field", "hours");
  if (hours.value.lt(0.01) || hours.value.gt(168))
    return failure("out-of-range", "hours");
  v.hours = hours.value;
  const weeks = parseCanonicalDecimal(input.weeks);
  if (!weeks.ok) return failure("invalid-field", "weeks");
  if (weeks.value.lt(1) || weeks.value.gt(53) || !/^\d+$/.test(input.weeks))
    return failure("out-of-range", "weeks");
  v.weeks = weeks.value;
  const scheduled = v.hours.mul(v.weeks);
  const toHourly = input.operation === "annual-to-hourly";
  const exactAnnual = toHourly ? v.pay : v.pay.mul(scheduled);
  const exact = {
    hourly: toHourly ? v.pay.div(scheduled) : v.pay,
    weekly: toHourly ? v.pay.div(v.weeks) : v.pay.mul(v.hours),
    monthly: exactAnnual.div(12),
    annual: exactAnnual,
  };
  const settled = {} as Record<keyof typeof exact, string>;
  for (const key of Object.keys(exact) as (keyof typeof exact)[]) {
    const cents = roundUsdToCents(exact[key]);
    if (cents === null) return failure("output-overflow");
    settled[key] = usdCentsToString(cents);
  }
  const answer = new DecimalValue(toHourly ? settled.hourly : settled.annual);
  const value = decimalOutput(answer);
  const ref = decimalOutput(v.pay);
  if (value === null || ref === null) return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "salary",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "salary.working.summary",
          args: {
            pay: { kind: "decimal", value: v.pay.toFixed() },
            hours: { kind: "decimal", value: v.hours.toFixed() },
            weeks: { kind: "decimal", value: v.weeks.toFixed() },
            question: {
              kind: "message",
              key: `salary.operation.${input.operation}`,
            },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "pay-periods",
        answer: value,
        reference: ref,
        ...settled,
        descriptionKey: "salary.visual.description",
        alternativeKey: "salary.visual.alternative",
      },
    },
  };
}
