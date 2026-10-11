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
  operation: "roof-area";
  length: string;
  width: string;
  rise: string;
  run: string;
  waste: string;
};
export const operationDescriptors = {
  "roof-area": {
    id: "roof-area",
    labelKey: "roofing.operation.roof-area",
    fields: [
      {
        id: "length",
        labelKey: "roofing.field.length",
        unitKey: "roofing.unit.m",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
      {
        id: "width",
        labelKey: "roofing.field.width",
        unitKey: "roofing.unit.m",
        sign: "nonnegative",
        defaultValue: "8",
        input: "decimal",
      },
      {
        id: "rise",
        labelKey: "roofing.field.rise",
        sign: "nonnegative",
        defaultValue: "6",
        input: "decimal",
      },
      {
        id: "run",
        labelKey: "roofing.field.run",
        sign: "nonnegative",
        defaultValue: "12",
        input: "decimal",
      },
      {
        id: "waste",
        labelKey: "roofing.field.waste",
        unitKey: "roofing.unit.percent",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "roofing.working.summary",
        arguments: {
          length: "decimal",
          width: "decimal",
          rise: "decimal",
          run: "decimal",
          waste: "decimal",
          answer: "decimal",
          reference: "decimal",
          factor: "decimal",
          sloped: "decimal",
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
  calculatorId: "roofing";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "roof";
    /** Surface area including the allowance (m²). */
    answer: string;
    /** Horizontal footprint L × W (m²). */
    reference: string;
    /** Footprint × slope factor, before the allowance (m²). */
    slopedArea: string;
    /** √(1 + (rise/run)²). */
    slopeFactor: string;
    rise: string;
    run: string;
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
  const rise = parseCanonicalDecimal(input.rise);
  if (!rise.ok) return failure("invalid-field", "rise");
  if (rise.value.lt(0) || rise.value.gt(1000000))
    return failure("out-of-range", "rise");
  v.rise = rise.value;
  const run = parseCanonicalDecimal(input.run);
  if (!run.ok) return failure("invalid-field", "run");
  if (run.value.lt(0.000000000001) || run.value.gt(1000000))
    return failure("out-of-range", "run");
  v.run = run.value;
  const waste = parseCanonicalDecimal(input.waste);
  if (!waste.ok) return failure("invalid-field", "waste");
  if (waste.value.lt(0) || waste.value.gt(100))
    return failure("out-of-range", "waste");
  v.waste = waste.value;
  const reference = v.length.mul(v.width);
  const ratio = v.rise.div(v.run);
  const factor = new DecimalValue(1).add(ratio.mul(ratio)).sqrt();
  const sloped = reference.mul(factor);
  const answer = sloped.mul(new DecimalValue(1).add(v.waste.div(100)));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const slopedArea = decimalOutput(sloped);
  const slopeFactor = decimalOutput(factor);
  if (
    value === null ||
    ref === null ||
    slopedArea === null ||
    slopeFactor === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "roofing",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "roofing.working.summary",
          args: {
            length: { kind: "decimal", value: v.length.toFixed() },
            width: { kind: "decimal", value: v.width.toFixed() },
            rise: { kind: "decimal", value: v.rise.toFixed() },
            run: { kind: "decimal", value: v.run.toFixed() },
            waste: { kind: "decimal", value: v.waste.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
            factor: { kind: "decimal", value: slopeFactor },
            sloped: { kind: "decimal", value: slopedArea },
          },
        },
      ],
      visual: {
        kind: "roof",
        answer: value,
        reference: ref,
        slopedArea,
        slopeFactor,
        rise: v.rise.toFixed(),
        run: v.run.toFixed(),
        waste: v.waste.toFixed(),
        descriptionKey: "roofing.visual.description",
        alternativeKey: "roofing.visual.alternative",
      },
    },
  };
}
