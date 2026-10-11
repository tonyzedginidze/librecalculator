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
  "triangle-area": {
    id: "triangle-area",
    labelKey: "triangle.operation.triangle-area",
    fields: [
      {
        id: "base",
        labelKey: "triangle.field.base",
        defaultValue: "6",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "triangle.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "triangle.working.triangle-area",
        arguments: {
          base: "decimal",
          height: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "triangle-perimeter": {
    id: "triangle-perimeter",
    labelKey: "triangle.operation.triangle-perimeter",
    fields: [
      {
        id: "sideA",
        labelKey: "triangle.field.sideA",
        defaultValue: "7",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "sideB",
        labelKey: "triangle.field.sideB",
        defaultValue: "5",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
      {
        id: "sideC",
        labelKey: "triangle.field.sideC",
        defaultValue: "6",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "triangle.working.triangle-perimeter",
        arguments: {
          sideA: "decimal",
          sideB: "decimal",
          sideC: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "triangle-altitude": {
    id: "triangle-altitude",
    labelKey: "triangle.operation.triangle-altitude",
    fields: [
      {
        id: "area",
        labelKey: "triangle.field.area",
        defaultValue: "12",
        input: "decimal",
        unitKey: "triangle.unit.field-square-metre",
        sign: "nonnegative",
      },
      {
        id: "base",
        labelKey: "triangle.field.base",
        defaultValue: "6",
        input: "decimal",
        unitKey: "triangle.unit.field-metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "triangle.working.triangle-altitude",
        arguments: {
          area: "decimal",
          base: "decimal",
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
  calculatorId: "triangle";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  approximate: boolean;
  working: readonly WorkingStep[];
  visual: {
    kind: "triangle";
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
  const area = values.area ?? new DecimalValue(0);
  const base = values.base ?? new DecimalValue(0);
  const height = values.height ?? new DecimalValue(0);
  const sideA = values.sideA ?? new DecimalValue(0);
  const sideB = values.sideB ?? new DecimalValue(0);
  const sideC = values.sideC ?? new DecimalValue(0);
  if (input.operation === "triangle-perimeter") {
    const sides = [sideA, sideB, sideC].sort((a, b) => a.comparedTo(b));
    if (
      (sides[0] ?? new DecimalValue(0)).lte(
        (sides[2] ?? new DecimalValue(0)).minus(sides[1] ?? 0),
      )
    )
      return { ok: false, error: { code: "impossible-triangle" } };
  }
  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "triangle-area":
      value = base.mul(height).div(2);
      unitKey = "triangle.unit.square-metre";
      break;
    case "triangle-perimeter":
      value = sideA.plus(sideB).plus(sideC);
      unitKey = "triangle.unit.metre";
      break;
    case "triangle-altitude":
      value = area.mul(2).div(base);
      unitKey = "triangle.unit.metre";
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
      calculatorId: "triangle",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      approximate: false,
      working: [
        {
          id: "substitution",
          messageKey: `triangle.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "triangle", dimensions, answer, unitKey },
    },
  };
}
