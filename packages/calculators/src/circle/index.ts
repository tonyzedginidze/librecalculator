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
  "circle-area": {
    id: "circle-area",
    labelKey: "circle.operation.circle-area",
    fields: [
      {
        id: "radius",
        labelKey: "circle.field.radius",
        defaultValue: "2",
        input: "decimal",
        unitKey: "circle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "circle.working.circle-area",
        arguments: {
          radius: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "circle-circumference": {
    id: "circle-circumference",
    labelKey: "circle.operation.circle-circumference",
    fields: [
      {
        id: "radius",
        labelKey: "circle.field.radius",
        defaultValue: "2",
        input: "decimal",
        unitKey: "circle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "circle.working.circle-circumference",
        arguments: {
          radius: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "circle-diameter": {
    id: "circle-diameter",
    labelKey: "circle.operation.circle-diameter",
    fields: [
      {
        id: "radius",
        labelKey: "circle.field.radius",
        defaultValue: "2",
        input: "decimal",
        unitKey: "circle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "circle.working.circle-diameter",
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
  calculatorId: "circle";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  approximate: boolean;
  working: readonly WorkingStep[];
  visual: {
    kind: "circle";
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
    case "circle-area":
      value = PI.mul(radius.pow(2));
      unitKey = "circle.unit.square-metre";
      break;
    case "circle-circumference":
      value = PI.mul(radius).mul(2);
      unitKey = "circle.unit.metre";
      break;
    case "circle-diameter":
      value = radius.mul(2);
      unitKey = "circle.unit.metre";
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
      calculatorId: "circle",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      approximate: !input.operation.endsWith("diameter"),
      working: [
        {
          id: "substitution",
          messageKey: `circle.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "circle", dimensions, answer, unitKey },
    },
  };
}
