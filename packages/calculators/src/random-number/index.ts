import type { CalculationResult, OperationDescriptor } from "../contracts";
import {
  type DecimalValue as D,
  parseCanonicalDecimal,
} from "../numeric/decimal";
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
const ID = "random-number";
export const operationDescriptors = {
  "seeded-integer": {
    id: "seeded-integer",
    labelKey: "random-number.operation.seeded-integer",
    fields: [
      {
        id: "minimum",
        labelKey: "random-number.field.minimum",
        defaultValue: "1",
        input: "integer",
      },
      {
        id: "maximum",
        labelKey: "random-number.field.maximum",
        defaultValue: "100",
        input: "integer",
      },
      {
        id: "seed",
        labelKey: "random-number.field.seed",
        defaultValue: "42",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "random-number.working.seeded-integer",
        arguments: {
          minimum: "decimal",
          maximum: "decimal",
          seed: "decimal",
          nextSeed: "decimal",
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
  const { minimum, maximum, seed } = fields;
  if (!minimum) return fail("invalid-field", "minimum");
  if (!maximum) return fail("invalid-field", "maximum");
  if (!seed) return fail("invalid-field", "seed");

  if (
    !minimum.isInteger() ||
    !maximum.isInteger() ||
    !seed.isInteger() ||
    minimum.abs().gt(1000000000) ||
    maximum.abs().gt(1000000000) ||
    minimum.gt(maximum) ||
    seed.lt(1) ||
    seed.gt(2147483646)
  )
    return fail("invalid-domain");
  const nextSeed = seed.mul(16807).mod(2147483647);
  const answer = minimum.add(nextSeed.mod(maximum.sub(minimum).add(1)));
  return numericResult(ID, input.operation, answer, { ...fields, nextSeed });
}
