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
  "cylinder-volume": {
    id: "cylinder-volume",
    labelKey: "cylinder.operation.cylinder-volume",
    fields: [
      {
        id: "radius",
        labelKey: "cylinder.field.radius",
        defaultValue: "0.5",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "cylinder.field.height",
        defaultValue: "1.2",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "cylinder.working.cylinder-volume",
        arguments: {
          radius: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "cylinder-surface": {
    id: "cylinder-surface",
    labelKey: "cylinder.operation.cylinder-surface",
    fields: [
      {
        id: "radius",
        labelKey: "cylinder.field.radius",
        defaultValue: "0.5",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "cylinder.field.height",
        defaultValue: "1.2",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "cylinder.working.cylinder-surface",
        arguments: {
          radius: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "cylinder-lateral": {
    id: "cylinder-lateral",
    labelKey: "cylinder.operation.cylinder-lateral",
    fields: [
      {
        id: "radius",
        labelKey: "cylinder.field.radius",
        defaultValue: "0.5",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "cylinder.field.height",
        defaultValue: "1.2",
        input: "decimal",
        unitKey: "cylinder.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "cylinder.working.cylinder-lateral",
        arguments: {
          radius: "decimal",
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
  calculatorId: "cylinder";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  approximate: boolean;
  working: readonly WorkingStep[];
  visual: {
    kind: "cylinder";
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
  const radius = values.radius ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "cylinder-volume":
      value = PI.mul(radius.pow(2)).mul(height);
      unitKey = "cylinder.unit.cubic-metre";
      break;
    case "cylinder-surface":
      value = PI.mul(radius).mul(radius.plus(height)).mul(2);
      unitKey = "cylinder.unit.square-metre";
      break;
    case "cylinder-lateral":
      value = PI.mul(radius).mul(height).mul(2);
      unitKey = "cylinder.unit.square-metre";
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
      calculatorId: "cylinder",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      approximate: !input.operation.endsWith("diameter"),
      working: [
        {
          id: "substitution",
          messageKey: `cylinder.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "cylinder", dimensions, answer, unitKey },
    },
  };
}
