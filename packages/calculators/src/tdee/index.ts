import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  type DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
export type Input = {
  operation: "daily-energy";
  resting: string;
  factor: string;
  age: string;
};
export const operationDescriptors = {
  "daily-energy": {
    id: "daily-energy",
    labelKey: "tdee.operation.daily-energy",
    fields: [
      {
        id: "resting",
        labelKey: "tdee.field.resting",
        unitKey: "tdee.unit.kcal",
        sign: "nonnegative",
        defaultValue: "1650",
        input: "decimal",
      },
      {
        id: "factor",
        labelKey: "tdee.field.factor",
        sign: "nonnegative",
        defaultValue: "1.5",
        input: "decimal",
      },
      {
        id: "age",
        labelKey: "tdee.field.age",
        unitKey: "tdee.unit.years",
        sign: "nonnegative",
        defaultValue: "30",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "tdee.working.summary",
        arguments: {
          resting: "decimal",
          factor: "decimal",
          age: "decimal",
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
  calculatorId: "tdee";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** Daily expenditure above the entered resting energy: answer − reference. */
    extra: string;
    factor: string;
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
  const resting = parseCanonicalDecimal(input.resting);
  if (!resting.ok) return failure("invalid-field", "resting");
  if (resting.value.lt(400) || resting.value.gt(5000))
    return failure("out-of-range", "resting");
  v.resting = resting.value;
  const factor = parseCanonicalDecimal(input.factor);
  if (!factor.ok) return failure("invalid-field", "factor");
  if (factor.value.lt(1) || factor.value.gt(2.5))
    return failure("out-of-range", "factor");
  v.factor = factor.value;
  const age = parseCanonicalDecimal(input.age);
  if (!age.ok) return failure("invalid-field", "age");
  if (age.value.lt(20) || age.value.gt(120) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const reference = v.resting;
  const answer = v.resting.mul(v.factor);
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const extra = decimalOutput(answer.sub(reference));
  if (value === null || ref === null || extra === null)
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "tdee",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "tdee.working.summary",
          args: {
            resting: { kind: "decimal", value: v.resting.toFixed() },
            factor: { kind: "decimal", value: v.factor.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        extra,
        factor: v.factor.toFixed(),
        descriptionKey: "tdee.visual.description",
        alternativeKey: "tdee.visual.alternative",
      },
    },
  };
}
