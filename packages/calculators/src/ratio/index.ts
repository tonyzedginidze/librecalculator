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
const ID = "ratio";
export const operationDescriptors = {
  quotient: {
    id: "quotient",
    labelKey: "ratio.operation.quotient",
    fields: [
      {
        id: "first",
        labelKey: "ratio.field.first",
        sign: "nonnegative",
        defaultValue: "16",
        input: "decimal",
      },
      {
        id: "second",
        labelKey: "ratio.field.second",
        sign: "nonnegative",
        defaultValue: "9",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "ratio.working.quotient",
        arguments: {
          first: "decimal",
          second: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "scale-ratio": {
    id: "scale-ratio",
    labelKey: "ratio.operation.scale-ratio",
    fields: [
      {
        id: "first",
        labelKey: "ratio.field.first",
        sign: "nonnegative",
        defaultValue: "16",
        input: "decimal",
      },
      {
        id: "second",
        labelKey: "ratio.field.second",
        sign: "nonnegative",
        defaultValue: "9",
        input: "decimal",
      },
      {
        id: "target",
        labelKey: "ratio.field.target",
        sign: "nonnegative",
        defaultValue: "1920",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "ratio.working.scale-ratio",
        arguments: {
          first: "decimal",
          second: "decimal",
          target: "decimal",
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
  const { first, second } = fields;
  const target = fields.target ?? new D(0);
  if (!first) return fail("invalid-field", "first");
  if (!second) return fail("invalid-field", "second");

  if (first.lt(0) || second.lte(0)) return fail("invalid-domain");
  if (input.operation === "scale-ratio" && (first.isZero() || target.lt(0)))
    return fail("invalid-domain");
  const answer =
    input.operation === "quotient"
      ? first.div(second)
      : target.mul(second).div(first);
  return numericResult(ID, input.operation, answer, fields);
}
