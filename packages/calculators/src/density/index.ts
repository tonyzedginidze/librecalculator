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
const ID = "density";
export const operationDescriptors = {
  "density-si": {
    id: "density-si",
    labelKey: "density.operation.density-si",
    fields: [
      {
        id: "mass",
        labelKey: "density.field.mass",
        defaultValue: "2.7",
        input: "decimal",
        unitKey: "density.unit.kg",
        sign: "nonnegative",
      },
      {
        id: "volume",
        labelKey: "density.field.volume",
        defaultValue: "0.001",
        input: "decimal",
        unitKey: "density.unit.m3",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "density.working.density-si",
        arguments: {
          mass: "decimal",
          volume: "decimal",
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
  if (!fields.volume) return fail("invalid-field", "volume");
  if (!fields.mass) return fail("invalid-field", "mass");

  if (fields.mass.lt(0) || fields.volume.lte(0)) return fail("invalid-domain");
  return numericResult(
    ID,
    input.operation,
    fields.mass.div(fields.volume),
    fields,
  );
}
