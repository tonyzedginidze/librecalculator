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
const ID = "pressure";
export const operationDescriptors = {
  "pressure-si": {
    id: "pressure-si",
    labelKey: "pressure.operation.pressure-si",
    fields: [
      {
        id: "force",
        labelKey: "pressure.field.force",
        defaultValue: "700",
        input: "decimal",
        unitKey: "pressure.unit.n",
        sign: "nonnegative",
      },
      {
        id: "area",
        labelKey: "pressure.field.area",
        defaultValue: "0.05",
        input: "decimal",
        unitKey: "pressure.unit.m2",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "pressure.working.pressure-si",
        arguments: {
          force: "decimal",
          area: "decimal",
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
  if (!fields.force) return fail("invalid-field", "force");
  if (!fields.area) return fail("invalid-field", "area");

  if (fields.force.lt(0) || fields.area.lte(0)) return fail("invalid-domain");
  return numericResult(
    ID,
    input.operation,
    fields.force.div(fields.area),
    fields,
  );
}
