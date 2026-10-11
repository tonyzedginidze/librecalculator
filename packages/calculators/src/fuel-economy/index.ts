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
/** The same trip in both conventions: consumption and distance per litre. */
export type FuelEconomyVisual = NumericResult["visual"] & {
  litresPer100km: string;
  kilometresPerLitre: string;
};
export type FuelEconomyResult = NumericResult & { visual: FuelEconomyVisual };
const ID = "fuel-economy";
export const operationDescriptors = {
  "litres-per-100km": {
    id: "litres-per-100km",
    labelKey: "fuel-economy.operation.litres-per-100km",
    fields: [
      {
        id: "distance",
        labelKey: "fuel-economy.field.distance",
        unitKey: "fuel-economy.unit.km",
        sign: "nonnegative",
        defaultValue: "600",
        input: "decimal",
      },
      {
        id: "fuel",
        labelKey: "fuel-economy.field.fuel",
        unitKey: "fuel-economy.unit.litres",
        sign: "nonnegative",
        defaultValue: "42",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "fuel-economy.working.litres-per-100km",
        arguments: {
          distance: "decimal",
          fuel: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "kilometres-per-litre": {
    id: "kilometres-per-litre",
    labelKey: "fuel-economy.operation.kilometres-per-litre",
    fields: [
      {
        id: "distance",
        labelKey: "fuel-economy.field.distance",
        unitKey: "fuel-economy.unit.km",
        sign: "nonnegative",
        defaultValue: "600",
        input: "decimal",
      },
      {
        id: "fuel",
        labelKey: "fuel-economy.field.fuel",
        unitKey: "fuel-economy.unit.litres",
        sign: "nonnegative",
        defaultValue: "42",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "fuel-economy.working.kilometres-per-litre",
        arguments: {
          distance: "decimal",
          fuel: "decimal",
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
): { ok: false; error: { code: NumericError; field?: string } } {
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
): CalculationResult<FuelEconomyResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const fields = parseFields(input);
  if (!fields) return fail("invalid-field");
  const { distance, fuel } = fields;
  if (!distance) return fail("invalid-field", "distance");
  if (!fuel) return fail("invalid-field", "fuel");

  if (distance.lte(0) || fuel.lte(0)) return fail("invalid-domain");
  const consumption = fuel.div(distance).mul(100);
  const efficiency = distance.div(fuel);
  const answer =
    input.operation === "litres-per-100km" ? consumption : efficiency;
  const base = numericResult(ID, input.operation, answer, fields);
  if (!base.ok) return base;
  const litresPer100km = decimalOutput(consumption);
  const kilometresPerLitre = decimalOutput(efficiency);
  if (litresPer100km === null || kilometresPerLitre === null)
    return fail("output-overflow");
  return {
    ok: true,
    result: {
      ...base.result,
      visual: { ...base.result.visual, litresPer100km, kilometresPerLitre },
    },
  };
}
