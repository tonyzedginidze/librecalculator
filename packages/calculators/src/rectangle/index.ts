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
export const operationDescriptors = {
  "rectangle-area": {
    id: "rectangle-area",
    labelKey: "rectangle.operation.rectangle-area",
    fields: [
      {
        id: "width",
        labelKey: "rectangle.field.width",
        defaultValue: "5",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "rectangle.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "rectangle.working.rectangle-area",
        arguments: {
          width: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "rectangle-perimeter": {
    id: "rectangle-perimeter",
    labelKey: "rectangle.operation.rectangle-perimeter",
    fields: [
      {
        id: "width",
        labelKey: "rectangle.field.width",
        defaultValue: "5",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "rectangle.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "rectangle.working.rectangle-perimeter",
        arguments: {
          width: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "rectangle-diagonal": {
    id: "rectangle-diagonal",
    labelKey: "rectangle.operation.rectangle-diagonal",
    fields: [
      {
        id: "width",
        labelKey: "rectangle.field.width",
        defaultValue: "5",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "rectangle.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "rectangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "rectangle.working.rectangle-diagonal",
        arguments: {
          width: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export type Input = { operation: keyof typeof operationDescriptors } & Record<
  string,
  string
>;
export type ErrorCode =
  | "invalid-field"
  | "nonpositive-dimension"
  | "impossible-triangle"
  | "output-overflow";
export const errorCodes = [
  "invalid-field",
  "nonpositive-dimension",
  "impossible-triangle",
  "output-overflow",
] as const;
export type Result = {
  calculatorId: "rectangle";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  approximate: boolean;
  working: readonly WorkingStep[];
  visual: {
    kind: "rectangle";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
  };
};
export function calculate(input: Input): CalculationResult<Result, ErrorCode> {
  const descriptor = operationDescriptors[input.operation];
  if (!descriptor) return { ok: false, error: { code: "invalid-field" } };
  const values: Record<string, InstanceType<typeof DecimalValue>> = {};
  const dimensions: Record<string, string> = {};
  for (const field of descriptor.fields) {
    const parsed = parseCanonicalDecimal(input[field.id] ?? "");
    if (!parsed.ok)
      return { ok: false, error: { code: "invalid-field", field: field.id } };
    if (!parsed.value.gt(0))
      return {
        ok: false,
        error: { code: "nonpositive-dimension", field: field.id },
      };
    values[field.id] = parsed.value;
    dimensions[field.id] = parsed.canonical;
  }
  const height = values.height ?? new DecimalValue(0);
  const width = values.width ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "rectangle-area":
      value = width.mul(height);
      unitKey = "rectangle.unit.square-metre";
      break;
    case "rectangle-perimeter":
      value = width.plus(height).mul(2);
      unitKey = "rectangle.unit.metre";
      break;
    case "rectangle-diagonal":
      value = width.mul(width).plus(height.mul(height)).sqrt();
      unitKey = "rectangle.unit.metre";
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  const answer = decimalOutput(value);
  if (answer === null) return { ok: false, error: { code: "output-overflow" } };
  const args = Object.fromEntries(
    Object.entries({ ...dimensions, answer }).map(([key, value]) => [
      key,
      { kind: "decimal" as const, value },
    ]),
  );
  return {
    ok: true,
    result: {
      calculatorId: "rectangle",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      approximate: input.operation === "rectangle-diagonal",
      working: [
        {
          id: "substitution",
          messageKey: `rectangle.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "rectangle", dimensions, answer, unitKey },
    },
  };
}
