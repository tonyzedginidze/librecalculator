import type {
  CalculationResult,
  EngineFailure,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { decimalOutput, parseCanonicalDecimal } from "../numeric/decimal";

import { baseUnits as units } from "../numeric/unit-catalog";
import { convertUnitValue } from "../numeric/unit-conversion";

export type { Unit } from "../numeric/unit-catalog";
export { baseUnits as units } from "../numeric/unit-catalog";
export type UnitDimension = (typeof units)[number]["dimension"];

const unitById = new Map<string, (typeof units)[number]>(
  units.map((unit) => [unit.id, unit]),
);
const choices = units.map(({ id, labelKey }) => ({ id, labelKey }));
export const operationDescriptors = {
  convert: {
    id: "convert",
    labelKey: "unit-conversion.operation.convert",
    fields: [
      {
        id: "value",
        labelKey: "unit-conversion.field.value",
        defaultValue: "5",
        input: "decimal",
      },
      {
        id: "source",
        labelKey: "unit-conversion.field.source",
        defaultValue: "km",
        input: "choice",
        choices,
      },
      {
        id: "target",
        labelKey: "unit-conversion.field.target",
        defaultValue: "mi",
        input: "choice",
        choices,
      },
    ],
    working: [
      {
        messageKey: "unit-conversion.working.convert",
        arguments: {
          value: "decimal",
          source: "message",
          target: "message",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export const errorCodes = [
  "invalid-field",
  "incompatible-units",
  "below-absolute-zero",
  "output-overflow",
] as const;
export type UnitConversionErrorCode = (typeof errorCodes)[number];
export type UnitConversionInput = {
  operation: "convert";
  value: string;
  source: string;
  target: string;
};
export type UnitConversionVisual = {
  kind: "unit-conversion-scale";
  dimension: UnitDimension;
  source: string;
  target: string;
  sourceKelvin?: string;
  targetKelvin?: string;
};
export type UnitConversionResult = {
  calculatorId: "unit-conversion";
  operation: "convert";
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: UnitConversionVisual;
};

export function calculate(
  input: UnitConversionInput,
): CalculationResult<UnitConversionResult, UnitConversionErrorCode> {
  const parsed = parseCanonicalDecimal(input.value);
  if (!parsed.ok) return failed("invalid-field", "value");
  const source = unitById.get(input.source);
  const target = unitById.get(input.target);
  if (!source) return failed("invalid-field", "source");
  if (!target) return failed("invalid-field", "target");
  if (source.dimension !== target.dimension)
    return failed("incompatible-units");

  const conversion = convertUnitValue(parsed.value, source, target);
  if (!conversion.ok) return failed(conversion.code, "value");
  const result = conversion.value;
  const sourceKelvin = conversion.kelvin;
  const targetKelvin = sourceKelvin;
  const answer = decimalOutput(result);
  if (answer === null) return failed("output-overflow");
  const visual: UnitConversionVisual = {
    kind: "unit-conversion-scale",
    dimension: source.dimension,
    source: source.id,
    target: target.id,
    ...(sourceKelvin !== undefined && targetKelvin !== undefined
      ? { sourceKelvin, targetKelvin }
      : {}),
  };
  return {
    ok: true,
    result: {
      calculatorId: "unit-conversion",
      operation: "convert",
      answer: { kind: "decimal", value: answer },
      working: [
        {
          id: "conversion",
          messageKey: "unit-conversion.working.convert",
          args: {
            value: { kind: "decimal", value: parsed.canonical },
            source: {
              kind: "message",
              key: `unit-conversion.symbol.${source.id}`,
            },
            target: {
              kind: "message",
              key: `unit-conversion.symbol.${target.id}`,
            },
            answer: { kind: "decimal", value: answer },
          },
        },
      ],
      visual,
    },
  };
}

function failed(
  code: UnitConversionErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<UnitConversionErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
