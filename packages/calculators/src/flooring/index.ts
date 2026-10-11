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
  operation: "packs";
  length: string;
  width: string;
  packArea: string;
  waste: string;
};
export const operationDescriptors = {
  packs: {
    id: "packs",
    labelKey: "flooring.operation.packs",
    fields: [
      {
        id: "length",
        labelKey: "flooring.field.length",
        unitKey: "flooring.unit.m",
        sign: "nonnegative",
        defaultValue: "5",
        input: "decimal",
      },
      {
        id: "width",
        labelKey: "flooring.field.width",
        unitKey: "flooring.unit.m",
        sign: "nonnegative",
        defaultValue: "4",
        input: "decimal",
      },
      {
        id: "packArea",
        labelKey: "flooring.field.packArea",
        unitKey: "flooring.unit.m2",
        sign: "nonnegative",
        defaultValue: "2.4",
        input: "decimal",
      },
      {
        id: "waste",
        labelKey: "flooring.field.waste",
        unitKey: "flooring.unit.percent",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "flooring.working.summary",
        arguments: {
          length: "decimal",
          width: "decimal",
          packArea: "decimal",
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
  calculatorId: "flooring";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "packs";
    /** Whole packs to buy. */
    answer: string;
    /** Room area L × W (m²). */
    reference: string;
    /** Area to cover after the allowance (m²). */
    neededArea: string;
    /** Packs before rounding up. */
    exactPacks: string;
    packArea: string;
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
  const length = parseCanonicalDecimal(input.length);
  if (!length.ok) return failure("invalid-field", "length");
  if (length.value.lt(0.000000000001) || length.value.gt(1000000))
    return failure("out-of-range", "length");
  v.length = length.value;
  const width = parseCanonicalDecimal(input.width);
  if (!width.ok) return failure("invalid-field", "width");
  if (width.value.lt(0.000000000001) || width.value.gt(1000000))
    return failure("out-of-range", "width");
  v.width = width.value;
  const packArea = parseCanonicalDecimal(input.packArea);
  if (!packArea.ok) return failure("invalid-field", "packArea");
  if (packArea.value.lt(0.000000000001) || packArea.value.gt(1000000))
    return failure("out-of-range", "packArea");
  v.packArea = packArea.value;
  const waste = parseCanonicalDecimal(input.waste);
  if (!waste.ok) return failure("invalid-field", "waste");
  if (waste.value.lt(0) || waste.value.gt(100))
    return failure("out-of-range", "waste");
  v.waste = waste.value;
  const reference = v.length.mul(v.width);
  const needed = reference.mul(new DecimalValue(1).add(v.waste.div(100)));
  const exact = needed.div(v.packArea);
  const answer = exact.ceil();
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const neededArea = decimalOutput(needed);
  const exactPacks = decimalOutput(exact);
  if (
    value === null ||
    ref === null ||
    neededArea === null ||
    exactPacks === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "flooring",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "flooring.working.summary",
          args: {
            length: { kind: "decimal", value: v.length.toFixed() },
            width: { kind: "decimal", value: v.width.toFixed() },
            packArea: { kind: "decimal", value: v.packArea.toFixed() },
            waste: { kind: "decimal", value: v.waste.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "packs",
        answer: value,
        reference: ref,
        neededArea,
        exactPacks,
        packArea: v.packArea.toFixed(),
        waste: v.waste.toFixed(),
        descriptionKey: "flooring.visual.description",
        alternativeKey: "flooring.visual.alternative",
      },
    },
  };
}
