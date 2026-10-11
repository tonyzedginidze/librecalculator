import type { CalculationResult, OperationDescriptor } from "../contracts";
import { DecimalValue as D, parseCanonicalDecimal } from "../numeric/decimal";
import {
  type NumericError,
  type NumericResult,
  numericResult,
} from "../runtime/numeric-result";

type Dec = InstanceType<typeof D>;
export const errorCodes = [
  "invalid-field",
  "invalid-domain",
  "output-overflow",
] as const;
export type Input = { operation: string } & Record<string, string>;
const ID = "scientific";
export const operationDescriptors = {
  "square-root": {
    id: "square-root",
    labelKey: "scientific.operation.square-root",
    fields: [
      {
        id: "value",
        labelKey: "scientific.field.radicand",
        sign: "nonnegative",
        defaultValue: "2",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "scientific.working.square-root",
        arguments: {
          value: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "integer-power": {
    id: "integer-power",
    labelKey: "scientific.operation.integer-power",
    fields: [
      {
        id: "value",
        labelKey: "scientific.field.base",
        defaultValue: "2",
        input: "decimal",
      },
      {
        id: "exponent",
        labelKey: "scientific.field.exponent",
        defaultValue: "10",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "scientific.working.integer-power",
        arguments: {
          value: "decimal",
          exponent: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "natural-log": {
    id: "natural-log",
    labelKey: "scientific.operation.natural-log",
    fields: [
      {
        id: "value",
        labelKey: "scientific.field.argument",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "scientific.working.natural-log",
        arguments: {
          value: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "sine-degrees": {
    id: "sine-degrees",
    labelKey: "scientific.operation.sine-degrees",
    fields: [
      {
        id: "value",
        labelKey: "scientific.field.angle",
        unitKey: "scientific.unit.degrees",
        defaultValue: "30",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "scientific.working.sine-degrees",
        arguments: {
          value: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
function fail(
  code: NumericError,
  field?: string,
): CalculationResult<NumericResult, NumericError> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
function parseFields(input: Input): Record<string, Dec> | null {
  const descriptor = operations.find((o) => o.id === input.operation);
  if (!descriptor) return null;
  const result: Record<string, Dec> = {};
  for (const f of descriptor.fields) {
    const parsed = parseCanonicalDecimal(input[f.id] ?? "");
    if (!parsed.ok) return null;
    result[f.id] = parsed.value;
  }
  return result;
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const fields = parseFields(input);
  if (!fields) return fail("invalid-field");
  if (!fields.value) return fail("invalid-field", "value");

  const value = fields.value;
  let answer: Dec;
  if (input.operation === "square-root") {
    if (value.lt(0)) return fail("invalid-domain", "value");
    answer = value.sqrt();
  } else if (input.operation === "integer-power") {
    const exponent = fields.exponent;
    if (!exponent) return fail("invalid-field", "exponent");
    if (
      !exponent.isInteger() ||
      exponent.abs().gt(100) ||
      (value.isZero() && exponent.lte(0))
    )
      return fail("invalid-domain");
    answer = value.pow(exponent);
  } else if (input.operation === "natural-log") {
    if (value.lte(0)) return fail("invalid-domain", "value");
    answer = value.ln();
  } else {
    if (value.abs().gt(1000000)) return fail("invalid-domain", "value");
    const angle = value.mod(360);
    const positive = angle.add(360).mod(360);
    answer =
      positive.eq(0) || positive.eq(180)
        ? new D(0)
        : positive.eq(90)
          ? new D(1)
          : positive.eq(270)
            ? new D(-1)
            : angle.mul(D.acos(-1)).div(180).sin();
  }
  return numericResult(ID, input.operation, answer, fields);
}
