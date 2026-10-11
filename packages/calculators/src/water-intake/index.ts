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
  operation: "water-volume";
  weight: string;
  rate: string;
  age: string;
};
export const operationDescriptors = {
  "water-volume": {
    id: "water-volume",
    labelKey: "water-intake.operation.water-volume",
    fields: [
      {
        id: "weight",
        labelKey: "water-intake.field.weight",
        unitKey: "water-intake.unit.kg",
        sign: "nonnegative",
        defaultValue: "70",
        input: "decimal",
      },
      {
        id: "rate",
        labelKey: "water-intake.field.rate",
        unitKey: "water-intake.unit.rate",
        sign: "nonnegative",
        defaultValue: "30",
        input: "decimal",
      },
      {
        id: "age",
        labelKey: "water-intake.field.age",
        unitKey: "water-intake.unit.years",
        sign: "nonnegative",
        defaultValue: "30",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "water-intake.working.summary",
        arguments: {
          weight: "decimal",
          rate: "decimal",
          age: "decimal",
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
/** Counting unit for the visual only; it does not change the answer. */
const GLASS_ML = 250;
export type Result = {
  calculatorId: "water-intake";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** The same millilitres counted in 250 mL glasses (reference ÷ 250). */
    glasses: string;
    glassMillilitres: string;
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
  const rate = parseCanonicalDecimal(input.rate);
  if (!rate.ok) return failure("invalid-field", "rate");
  if (rate.value.lt(1) || rate.value.gt(50))
    return failure("out-of-range", "rate");
  v.rate = rate.value;
  const age = parseCanonicalDecimal(input.age);
  if (!age.ok) return failure("invalid-field", "age");
  if (age.value.lt(20) || age.value.gt(120) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const reference = v.weight.mul(v.rate);
  const answer = reference.div(1000);
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const glasses = decimalOutput(reference.div(GLASS_ML));
  if (value === null || ref === null || glasses === null)
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "water-intake",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "water-intake.working.summary",
          args: {
            weight: { kind: "decimal", value: v.weight.toFixed() },
            rate: { kind: "decimal", value: v.rate.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        glasses,
        glassMillilitres: String(GLASS_ML),
        descriptionKey: "water-intake.visual.description",
        alternativeKey: "water-intake.visual.alternative",
      },
    },
  };
}
