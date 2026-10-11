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
  operation: "male-regression" | "female-regression";
  weight: string;
  height: string;
  age: string;
};
const fields = [
  {
    id: "weight",
    labelKey: "body-fat.field.weight",
    unitKey: "body-fat.unit.kg",
    sign: "nonnegative",
    defaultValue: "70",
    input: "decimal",
  },
  {
    id: "height",
    labelKey: "body-fat.field.height",
    unitKey: "body-fat.unit.cm",
    sign: "nonnegative",
    defaultValue: "175",
    input: "decimal",
  },
  {
    id: "age",
    labelKey: "body-fat.field.age",
    unitKey: "body-fat.unit.years",
    sign: "nonnegative",
    defaultValue: "30",
    input: "integer",
  },
] satisfies OperationDescriptor["fields"];
const working = [
  {
    messageKey: "body-fat.working.summary",
    arguments: {
      weight: "decimal",
      height: "decimal",
      age: "decimal",
      question: "message",
      answer: "decimal",
      reference: "decimal",
    },
  },
] satisfies OperationDescriptor["working"];
export const operationDescriptors = {
  "male-regression": {
    id: "male-regression",
    labelKey: "body-fat.operation.male-regression",
    fields,
    working,
  },
  "female-regression": {
    id: "female-regression",
    labelKey: "body-fat.operation.female-regression",
    fields,
    working,
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
  calculatorId: "body-fat";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** Entered weight split by the predicted percentage: fat + fatFree = weight (kg). */
    weight: string;
    fatMass: string;
    fatFreeMass: string;
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
  if (age.value.lt(20) || age.value.gt(83) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const bmi = v.weight.mul(10000).div(v.height.mul(v.height));
  if (bmi.lt("13.9") || bmi.gt("40.9"))
    return failure("out-of-range", "weight");
  const reference = bmi;
  const answer = bmi
    .mul("1.2")
    .add(v.age.mul("0.23"))
    .sub(input.operation === "male-regression" ? "10.8" : 0)
    .sub("5.4");
  if (answer.lt(0) || answer.gt(100)) return failure("out-of-range");
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const fat = v.weight.mul(answer).div(100);
  const fatMass = decimalOutput(fat);
  const fatFreeMass = decimalOutput(v.weight.sub(fat));
  if (
    value === null ||
    ref === null ||
    fatMass === null ||
    fatFreeMass === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "body-fat",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "body-fat.working.summary",
          args: {
            weight: { kind: "decimal", value: v.weight.toFixed() },
            height: { kind: "decimal", value: v.height.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            question: {
              kind: "message",
              key: `body-fat.operation.${input.operation}`,
            },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        weight: v.weight.toFixed(),
        fatMass,
        fatFreeMass,
        descriptionKey: "body-fat.visual.description",
        alternativeKey: "body-fat.visual.alternative",
      },
    },
  };
}
