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
  operation: "board-feet";
  thickness: string;
  width: string;
  length: string;
  quantity: string;
};
export const operationDescriptors = {
  "board-feet": {
    id: "board-feet",
    labelKey: "lumber.operation.board-feet",
    fields: [
      {
        id: "thickness",
        labelKey: "lumber.field.thickness",
        unitKey: "lumber.unit.in",
        sign: "nonnegative",
        defaultValue: "1.5",
        input: "decimal",
      },
      {
        id: "width",
        labelKey: "lumber.field.width",
        unitKey: "lumber.unit.in",
        sign: "nonnegative",
        defaultValue: "5.5",
        input: "decimal",
      },
      {
        id: "length",
        labelKey: "lumber.field.length",
        unitKey: "lumber.unit.ft",
        sign: "nonnegative",
        defaultValue: "8",
        input: "decimal",
      },
      {
        id: "quantity",
        labelKey: "lumber.field.quantity",
        defaultValue: "10",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "lumber.working.summary",
        arguments: {
          thickness: "decimal",
          width: "decimal",
          length: "decimal",
          quantity: "decimal",
          perBoard: "decimal",
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
  calculatorId: "lumber";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "boards";
    /** Total board feet. */
    answer: string;
    /** Number of boards. */
    reference: string;
    /** Board feet in one board. */
    perBoard: string;
    thickness: string;
    width: string;
    length: string;
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
  const thickness = parseCanonicalDecimal(input.thickness);
  if (!thickness.ok) return failure("invalid-field", "thickness");
  if (thickness.value.lt(0.000000000001) || thickness.value.gt(1000000))
    return failure("out-of-range", "thickness");
  v.thickness = thickness.value;
  const width = parseCanonicalDecimal(input.width);
  if (!width.ok) return failure("invalid-field", "width");
  if (width.value.lt(0.000000000001) || width.value.gt(1000000))
    return failure("out-of-range", "width");
  v.width = width.value;
  const length = parseCanonicalDecimal(input.length);
  if (!length.ok) return failure("invalid-field", "length");
  if (length.value.lt(0.000000000001) || length.value.gt(1000000))
    return failure("out-of-range", "length");
  v.length = length.value;
  const quantity = parseCanonicalDecimal(input.quantity);
  if (!quantity.ok) return failure("invalid-field", "quantity");
  if (
    quantity.value.lt(1) ||
    quantity.value.gt(100) ||
    !/^\d+$/.test(input.quantity)
  )
    return failure("out-of-range", "quantity");
  v.quantity = quantity.value;
  const reference = v.quantity;
  const one = v.thickness.mul(v.width).mul(v.length).div(12);
  const answer = v.thickness.mul(v.width).mul(v.length).mul(v.quantity).div(12);
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const perBoard = decimalOutput(one);
  if (value === null || ref === null || perBoard === null)
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "lumber",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "lumber.working.summary",
          args: {
            thickness: { kind: "decimal", value: v.thickness.toFixed() },
            width: { kind: "decimal", value: v.width.toFixed() },
            length: { kind: "decimal", value: v.length.toFixed() },
            quantity: { kind: "decimal", value: v.quantity.toFixed() },
            perBoard: { kind: "decimal", value: perBoard },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "boards",
        answer: value,
        reference: ref,
        perBoard,
        thickness: v.thickness.toFixed(),
        width: v.width.toFixed(),
        length: v.length.toFixed(),
        descriptionKey: "lumber.visual.description",
        alternativeKey: "lumber.visual.alternative",
      },
    },
  };
}
