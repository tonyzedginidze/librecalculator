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

const PI = new DecimalValue(
  "3.14159265358979323846264338327950288419716939937510",
);
export const operationDescriptors = {
  "sphere-volume": {
    id: "sphere-volume",
    labelKey: "sphere.operation.sphere-volume",
    fields: [
      {
        id: "radius",
        labelKey: "sphere.field.radius",
        defaultValue: "1.5",
        input: "decimal",
        unitKey: "sphere.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "sphere.working.sphere-volume",
        arguments: {
          radius: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "sphere-surface": {
    id: "sphere-surface",
    labelKey: "sphere.operation.sphere-surface",
    fields: [
      {
        id: "radius",
        labelKey: "sphere.field.radius",
        defaultValue: "1.5",
        input: "decimal",
        unitKey: "sphere.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "sphere.working.sphere-surface",
        arguments: {
          radius: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "sphere-diameter": {
    id: "sphere-diameter",
    labelKey: "sphere.operation.sphere-diameter",
    fields: [
      {
        id: "radius",
        labelKey: "sphere.field.radius",
        defaultValue: "1.5",
        input: "decimal",
        unitKey: "sphere.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "sphere.working.sphere-diameter",
        arguments: {
          radius: "decimal",
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
  calculatorId: "sphere";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  approximate: boolean;
  working: readonly WorkingStep[];
  visual: {
    kind: "sphere";
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
  const radius = values.radius ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "sphere-volume":
      value = PI.mul(radius.pow(3)).mul(4).div(3);
      unitKey = "sphere.unit.cubic-metre";
      break;
    case "sphere-surface":
      value = PI.mul(radius.pow(2)).mul(4);
      unitKey = "sphere.unit.square-metre";
      break;
    case "sphere-diameter":
      value = radius.mul(2);
      unitKey = "sphere.unit.metre";
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
      calculatorId: "sphere",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      approximate: !input.operation.endsWith("diameter"),
      working: [
        {
          id: "substitution",
          messageKey: `sphere.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "sphere", dimensions, answer, unitKey },
    },
  };
}
