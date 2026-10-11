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
  operation: "slab";
  length: string;
  width: string;
  depth: string;
  waste: string;
};
export const operationDescriptors = {
  slab: {
    id: "slab",
    labelKey: "concrete.operation.slab",
    fields: [
      {
        id: "length",
        labelKey: "concrete.field.length",
        unitKey: "concrete.unit.m",
        sign: "nonnegative",
        defaultValue: "6",
        input: "decimal",
      },
      {
        id: "width",
        labelKey: "concrete.field.width",
        unitKey: "concrete.unit.m",
        sign: "nonnegative",
        defaultValue: "4",
        input: "decimal",
      },
      {
        id: "depth",
        labelKey: "concrete.field.depth",
        unitKey: "concrete.unit.m",
        sign: "nonnegative",
        defaultValue: "0.1",
        input: "decimal",
      },
      {
        id: "waste",
        labelKey: "concrete.field.waste",
        unitKey: "concrete.unit.percent",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "concrete.working.summary",
        arguments: {
          length: "decimal",
          width: "decimal",
          depth: "decimal",
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
  calculatorId: "concrete";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "slab";
    /** Ordered volume including the allowance (m³). */
    answer: string;
    /** Net geometric volume L × W × D (m³). */
    reference: string;
    /** Extra volume added by the allowance (m³). */
    allowance: string;
    length: string;
    width: string;
    depth: string;
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
  const depth = parseCanonicalDecimal(input.depth);
  if (!depth.ok) return failure("invalid-field", "depth");
  if (depth.value.lt(0.000000000001) || depth.value.gt(1000000))
    return failure("out-of-range", "depth");
  v.depth = depth.value;
  const waste = parseCanonicalDecimal(input.waste);
  if (!waste.ok) return failure("invalid-field", "waste");
  if (waste.value.lt(0) || waste.value.gt(100))
    return failure("out-of-range", "waste");
  v.waste = waste.value;
  const reference = v.length.mul(v.width).mul(v.depth);
  const answer = reference.mul(new DecimalValue(1).add(v.waste.div(100)));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const extra = decimalOutput(answer.sub(reference));
  if (value === null || ref === null || extra === null)
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "concrete",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "concrete.working.summary",
          args: {
            length: { kind: "decimal", value: v.length.toFixed() },
            width: { kind: "decimal", value: v.width.toFixed() },
            depth: { kind: "decimal", value: v.depth.toFixed() },
            waste: { kind: "decimal", value: v.waste.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "slab",
        answer: value,
        reference: ref,
        allowance: extra,
        length: v.length.toFixed(),
        width: v.width.toFixed(),
        depth: v.depth.toFixed(),
        waste: v.waste.toFixed(),
        descriptionKey: "concrete.visual.description",
        alternativeKey: "concrete.visual.alternative",
      },
    },
  };
}
