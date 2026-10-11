import type {
  CalculationResult,
  OperationDescriptor,
  WorkingArgument,
  WorkingStep,
} from "../contracts";
import {
  type DecimalValue,
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
      {
        messageKey: "bmi.working.category",
        arguments: {
          answer: "decimal",
          range: "message",
          category: "message",
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
/** WHO adult BMI categories, kg/m², lower bound inclusive, upper bound exclusive. */
export const categories = [
  { id: "underweight", from: null, to: "18.5" },
  { id: "healthy", from: "18.5", to: "25" },
  { id: "overweight", from: "25", to: "30" },
  { id: "obesity-1", from: "30", to: "35" },
  { id: "obesity-2", from: "35", to: "40" },
  { id: "obesity-3", from: "40", to: null },
] as const;
export type Category = (typeof categories)[number];
export type CategoryId = Category["id"];
/** Classifies the exact, unrounded BMI against the WHO adult cut-offs. */
export function classify(bmi: InstanceType<typeof DecimalValue>): Category {
  const found = categories.find((c) => c.to === null || bmi.lt(c.to));
  return found ?? categories[5];
}
function rangeArgument(category: Category): WorkingArgument {
  if (category.from === null)
    return {
      kind: "message",
      key: "bmi.range.below",
      args: { to: { kind: "decimal", value: category.to } },
    };
  if (category.to === null)
    return {
      kind: "message",
      key: "bmi.range.from",
      args: { from: { kind: "decimal", value: category.from } },
    };
  return {
    kind: "message",
    key: "bmi.range.between",
    args: {
      from: { kind: "decimal", value: category.from },
      to: { kind: "decimal", value: category.to },
    },
  };
}
export type Result = {
  calculatorId: "bmi";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  category: {
    id: CategoryId;
    labelKey: string;
    from: string | null;
    to: string | null;
  };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    /** The WHO band the answer falls in; null means the band is open-ended. */
    band: { from: string | null; to: string | null };
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
  const answer = v.weight.mul(10000).div(v.height.mul(v.height));
  const value = decimalOutput(answer);
  if (value === null) return failure("output-overflow");
  const category = classify(answer);
  const labelKey = `bmi.category.${category.id}`;
  return {
    ok: true,
    result: {
      calculatorId: "bmi",
      operation: input.operation,
      answer: { kind: "decimal", value },
      category: {
        id: category.id,
        labelKey,
        from: category.from,
        to: category.to,
      },
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
        {
          id: "category",
          messageKey: "bmi.working.category",
          args: {
            answer: { kind: "decimal", value },
            range: rangeArgument(category),
            category: { kind: "message", key: labelKey },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        band: { from: category.from, to: category.to },
        descriptionKey: "bmi.visual.description",
        alternativeKey: "bmi.visual.alternative",
      },
    },
  };
}
