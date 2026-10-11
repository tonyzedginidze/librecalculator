import type { CalculationResult, OperationDescriptor } from "../contracts";
import {
  type DecimalValue as D,
  decimalOutput,
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
const ID = "energy";
export const operationDescriptors = {
  "energy-si": {
    id: "energy-si",
    labelKey: "energy.operation.energy-si",
    fields: [
      {
        id: "mass",
        labelKey: "energy.field.mass",
        defaultValue: "1500",
        input: "decimal",
        unitKey: "energy.unit.kg",
        sign: "nonnegative",
      },
      {
        id: "speed",
        labelKey: "energy.field.speed",
        defaultValue: "20",
        input: "decimal",
        unitKey: "energy.unit.mps",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "energy.working.energy-si",
        arguments: {
          mass: "decimal",
          speed: "decimal",
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
  if (!fields.speed) return fail("invalid-field", "speed");

  if (fields.mass.lte(0) || fields.speed.lt(0)) return fail("invalid-domain");
  const energy = fields.mass.mul(fields.speed.pow(2)).div(2);
  const result = numericResult(ID, input.operation, energy, fields);
  if (!result.ok) return result;
  // Same mass at twice the speed: the visual shows the squared-speed effect (4×).
  const doubledSpeed = decimalOutput(fields.speed.mul(2));
  const doubledEnergy = decimalOutput(energy.mul(4));
  if (doubledSpeed === null || doubledEnergy === null)
    return fail("output-overflow");
  return {
    ok: true,
    result: {
      ...result.result,
      visual: {
        ...result.result.visual,
        rows: [
          ...result.result.visual.rows,
          { labelKey: "energy.visual.doubled-speed", value: doubledSpeed },
          { labelKey: "energy.visual.doubled-energy", value: doubledEnergy },
        ],
      },
    },
  };
}
