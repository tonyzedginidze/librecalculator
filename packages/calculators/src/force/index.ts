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
const ID = "force";
export const operationDescriptors = {
  "force-si": {
    id: "force-si",
    labelKey: "force.operation.force-si",
    fields: [
      {
        id: "mass",
        labelKey: "force.field.mass",
        defaultValue: "1200",
        input: "decimal",
        unitKey: "force.unit.kg",
        sign: "nonnegative",
      },
      {
        id: "acceleration",
        labelKey: "force.field.acceleration",
        defaultValue: "2.5",
        input: "decimal",
        unitKey: "force.unit.mps2",
      },
    ],
    working: [
      {
        messageKey: "force.working.force-si",
        arguments: {
          mass: "decimal",
          acceleration: "decimal",
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
  if (!fields.mass) return fail("invalid-field", "mass");
  if (!fields.acceleration) return fail("invalid-field", "acceleration");

  if (fields.mass.lte(0)) return fail("invalid-domain");
  return numericResult(
    ID,
    input.operation,
    fields.mass.mul(fields.acceleration),
    fields,
  );
}
