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
export type Input = {
  operation: "bmi";
  weight: string;
  height: string;
  age: string;
};
export const operationDescriptors = {
  bmi: {
    id: "bmi",
    labelKey: "bmi.operation.bmi",
    fields: [
      {
        id: "weight",
        labelKey: "bmi.field.weight",
        unitKey: "bmi.unit.kg",
        sign: "nonnegative",
        defaultValue: "70",
        input: "decimal",
      },
      {
        id: "height",
        labelKey: "bmi.field.height",
        unitKey: "bmi.unit.cm",
        sign: "nonnegative",
        defaultValue: "175",
        input: "decimal",
      },
      {
        id: "age",
        labelKey: "bmi.field.age",
        unitKey: "bmi.unit.years",
        sign: "nonnegative",
        defaultValue: "30",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "bmi.working.summary",
        arguments: {
          weight: "decimal",
          height: "decimal",
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
  calculatorId: "bmi";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
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
  const weight = parseCanonicalDecimal(input.weight);
  if (!weight.ok) return failure("invalid-field", "weight");
  if (weight.value.lt(20) || weight.value.gt(350))
    return failure("out-of-range", "weight");
  v.weight = weight.value;
  const height = parseCanonicalDecimal(input.height);
  if (!height.ok) return failure("invalid-field", "height");
  if (height.value.lt(100) || height.value.gt(250))
    return failure("out-of-range", "height");
  v.height = height.value;
  const age = parseCanonicalDecimal(input.age);
  if (!age.ok) return failure("invalid-field", "age");
  if (age.value.lt(20) || age.value.gt(120) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const reference = new DecimalValue(25);
  const answer = v.weight.mul(10000).div(v.height.mul(v.height));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  if (value === null || ref === null) return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "bmi",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "bmi.working.summary",
          args: {
            weight: { kind: "decimal", value: v.weight.toFixed() },
            height: { kind: "decimal", value: v.height.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        descriptionKey: "bmi.visual.description",
        alternativeKey: "bmi.visual.alternative",
      },
    },
  };
}
