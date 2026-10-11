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
  operation: "male-equation" | "female-equation";
  weight: string;
  height: string;
  age: string;
};
const fields = [
  {
    id: "weight",
    labelKey: "bmr.field.weight",
    unitKey: "bmr.unit.kg",
    sign: "nonnegative",
    defaultValue: "70",
    input: "decimal",
  },
  {
    id: "height",
    labelKey: "bmr.field.height",
    unitKey: "bmr.unit.cm",
    sign: "nonnegative",
    defaultValue: "175",
    input: "decimal",
  },
  {
    id: "age",
    labelKey: "bmr.field.age",
    unitKey: "bmr.unit.years",
    sign: "nonnegative",
    defaultValue: "30",
    input: "integer",
  },
] satisfies OperationDescriptor["fields"];
const working = [
  {
    messageKey: "bmr.working.summary",
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
  "male-equation": {
    id: "male-equation",
    labelKey: "bmr.operation.male-equation",
    fields,
    working,
  },
  "female-equation": {
    id: "female-equation",
    labelKey: "bmr.operation.female-equation",
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
  calculatorId: "bmr";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** Signed terms of the equation in kcal/day; they add up to `answer`. */
    terms: {
      weight: string;
      height: string;
      age: string;
      constant: string;
    };
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
  if (age.value.lt(20) || age.value.gt(78) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const weightTerm = v.weight.mul(10);
  const heightTerm = v.height.mul("6.25");
  const ageTerm = v.age.mul(-5);
  const constant = new DecimalValue(
    input.operation === "male-equation" ? 5 : -161,
  );
  const reference = weightTerm.add(heightTerm).add(ageTerm);
  const answer = reference.add(constant);
  if (answer.lte(0)) return failure("out-of-range");
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const terms = {
    weight: decimalOutput(weightTerm),
    height: decimalOutput(heightTerm),
    age: decimalOutput(ageTerm),
    constant: decimalOutput(constant),
  };
  if (
    value === null ||
    ref === null ||
    terms.weight === null ||
    terms.height === null ||
    terms.age === null ||
    terms.constant === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "bmr",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "bmr.working.summary",
          args: {
            weight: { kind: "decimal", value: v.weight.toFixed() },
            height: { kind: "decimal", value: v.height.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            question: {
              kind: "message",
              key: `bmr.operation.${input.operation}`,
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
        terms: {
          weight: terms.weight,
          height: terms.height,
          age: terms.age,
          constant: terms.constant,
        },
        descriptionKey: "bmr.visual.description",
        alternativeKey: "bmr.visual.alternative",
      },
    },
  };
}
