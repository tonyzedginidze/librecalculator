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
  operation: "bmi-weight";
  height: string;
  targetBmi: string;
  age: string;
};
export const operationDescriptors = {
  "bmi-weight": {
    id: "bmi-weight",
    labelKey: "ideal-weight.operation.bmi-weight",
    fields: [
      {
        id: "height",
        labelKey: "ideal-weight.field.height",
        unitKey: "ideal-weight.unit.cm",
        sign: "nonnegative",
        defaultValue: "175",
        input: "decimal",
      },
      {
        id: "targetBmi",
        labelKey: "ideal-weight.field.targetBmi",
        unitKey: "ideal-weight.unit.bmi",
        sign: "nonnegative",
        defaultValue: "22",
        input: "decimal",
      },
      {
        id: "age",
        labelKey: "ideal-weight.field.age",
        unitKey: "ideal-weight.unit.years",
        sign: "nonnegative",
        defaultValue: "30",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "ideal-weight.working.summary",
        arguments: {
          height: "decimal",
          targetBmi: "decimal",
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
  calculatorId: "ideal-weight";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** BMI scale converted to kilograms at the entered height; the chosen BMI sits at `fraction`. */
    height: string;
    scale: readonly { bmi: string; weight: string }[];
    fraction: string;
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
  const height = parseCanonicalDecimal(input.height);
  if (!height.ok) return failure("invalid-field", "height");
  if (height.value.lt(100) || height.value.gt(250))
    return failure("out-of-range", "height");
  v.height = height.value;
  const targetBmi = parseCanonicalDecimal(input.targetBmi);
  if (!targetBmi.ok) return failure("invalid-field", "targetBmi");
  if (targetBmi.value.lt(10) || targetBmi.value.gt(50))
    return failure("out-of-range", "targetBmi");
  v.targetBmi = targetBmi.value;
  const age = parseCanonicalDecimal(input.age);
  if (!age.ok) return failure("invalid-field", "age");
  if (age.value.lt(20) || age.value.gt(120) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  const reference = v.targetBmi;
  const answer = v.targetBmi.mul(v.height.div(100).pow(2));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  if (value === null || ref === null) return failure("output-overflow");
  const squared = v.height.div(100).pow(2);
  const inner = v.targetBmi.gte(15) && v.targetBmi.lte(40);
  const [lo, hi, step] = inner ? [15, 40, 5] : [10, 50, 10];
  const scale: { bmi: string; weight: string }[] = [];
  for (let bmi = lo; bmi <= hi; bmi += step) {
    const weight = decimalOutput(squared.mul(bmi));
    if (weight === null) return failure("output-overflow");
    scale.push({ bmi: String(bmi), weight });
  }
  const fraction = decimalOutput(v.targetBmi.sub(lo).div(hi - lo));
  if (fraction === null) return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "ideal-weight",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "ideal-weight.working.summary",
          args: {
            height: { kind: "decimal", value: v.height.toFixed() },
            targetBmi: { kind: "decimal", value: v.targetBmi.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        height: v.height.toFixed(),
        scale,
        fraction,
        descriptionKey: "ideal-weight.visual.description",
        alternativeKey: "ideal-weight.visual.alternative",
      },
    },
  };
}
