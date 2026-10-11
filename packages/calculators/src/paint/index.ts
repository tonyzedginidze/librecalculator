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
  operation: "litres";
  area: string;
  coats: string;
  coverage: string;
  waste: string;
};
export const operationDescriptors = {
  litres: {
    id: "litres",
    labelKey: "paint.operation.litres",
    fields: [
      {
        id: "area",
        labelKey: "paint.field.area",
        unitKey: "paint.unit.m2",
        sign: "nonnegative",
        defaultValue: "36",
        input: "decimal",
      },
      {
        id: "coats",
        labelKey: "paint.field.coats",
        defaultValue: "2",
        input: "integer",
      },
      {
        id: "coverage",
        labelKey: "paint.field.coverage",
        unitKey: "paint.unit.coverage",
        sign: "nonnegative",
        defaultValue: "12",
        input: "decimal",
      },
      {
        id: "waste",
        labelKey: "paint.field.waste",
        unitKey: "paint.unit.percent",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "paint.working.summary",
        arguments: {
          area: "decimal",
          coats: "decimal",
          coverage: "decimal",
          waste: "decimal",
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
  calculatorId: "paint";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "paint";
    /** Litres including the allowance. */
    answer: string;
    /** Litres before the allowance. */
    reference: string;
    /** Area painted across all coats (m²). */
    paintedArea: string;
    area: string;
    coats: string;
    coverage: string;
    /** Allowance multiplier 1 + w/100. */
    factor: string;
    waste: string;
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
  const area = parseCanonicalDecimal(input.area);
  if (!area.ok) return failure("invalid-field", "area");
  if (area.value.lt(0.000000000001) || area.value.gt(1000000))
    return failure("out-of-range", "area");
  v.area = area.value;
  const coats = parseCanonicalDecimal(input.coats);
  if (!coats.ok) return failure("invalid-field", "coats");
  if (coats.value.lt(1) || coats.value.gt(100) || !/^\d+$/.test(input.coats))
    return failure("out-of-range", "coats");
  v.coats = coats.value;
  const coverage = parseCanonicalDecimal(input.coverage);
  if (!coverage.ok) return failure("invalid-field", "coverage");
  if (coverage.value.lt(0.000000000001) || coverage.value.gt(1000000))
    return failure("out-of-range", "coverage");
  v.coverage = coverage.value;
  const waste = parseCanonicalDecimal(input.waste);
  if (!waste.ok) return failure("invalid-field", "waste");
  if (waste.value.lt(0) || waste.value.gt(100))
    return failure("out-of-range", "waste");
  v.waste = waste.value;
  const painted = v.area.mul(v.coats);
  const reference = painted.div(v.coverage);
  const multiplier = new DecimalValue(1).add(v.waste.div(100));
  const answer = reference.mul(multiplier);
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const paintedArea = decimalOutput(painted);
  if (value === null || ref === null || paintedArea === null)
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "paint",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "paint.working.summary",
          args: {
            area: { kind: "decimal", value: v.area.toFixed() },
            coats: { kind: "decimal", value: v.coats.toFixed() },
            coverage: { kind: "decimal", value: v.coverage.toFixed() },
            waste: { kind: "decimal", value: v.waste.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "paint",
        answer: value,
        reference: ref,
        paintedArea,
        area: v.area.toFixed(),
        coats: v.coats.toFixed(),
        coverage: v.coverage.toFixed(),
        factor: multiplier.toFixed(),
        waste: v.waste.toFixed(),
        descriptionKey: "paint.visual.description",
        alternativeKey: "paint.visual.alternative",
      },
    },
  };
}
