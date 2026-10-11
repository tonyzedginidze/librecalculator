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
const ID = "power";
export const operationDescriptors = {
  "power-si": {
    id: "power-si",
    labelKey: "power.operation.power-si",
    fields: [
      {
        id: "energy",
        labelKey: "power.field.energy",
        defaultValue: "360000",
        input: "decimal",
        unitKey: "power.unit.j",
      },
      {
        id: "time",
        labelKey: "power.field.time",
        defaultValue: "180",
        input: "decimal",
        unitKey: "power.unit.s",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "power.working.power-si",
        arguments: {
          energy: "decimal",
          time: "decimal",
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
  if (!fields.energy) return fail("invalid-field", "energy");
  if (!fields.time) return fail("invalid-field", "time");

  if (fields.time.lte(0)) return fail("invalid-domain");
  return numericResult(
    ID,
    input.operation,
    fields.energy.div(fields.time),
    fields,
  );
}
