import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
import { unitCatalog } from "../numeric/unit-catalog";
import { convertUnitValue } from "../numeric/unit-conversion";
export type UnitPresetInput = {
  operation: "convert";
  value: string;
  source: string;
  target: string;
};
export const unitPresetErrors = [
  "invalid-field",
  "incompatible-units",
  "below-absolute-zero",
  "output-overflow",
] as const;
export type UnitPresetError = (typeof unitPresetErrors)[number];
export type UnitPresetResult = {
  calculatorId: string;
  operation: "convert";
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    value: string;
    source: string;
    target: string;
    answer: string;
    /** Exact affine map of this conversion: target = source × slope + offset. */
    slope: string;
    offset: string;
    kelvin?: string;
  };
};
export function makeUnitPreset(
  id: string,
  unitIds: readonly string[],
  sourceDefault: string,
  targetDefault: string,
  valueDefault = "1",
) {
  const units = unitCatalog.filter((unit) => unitIds.includes(unit.id));
  const choices = units.map((unit) => ({
    id: unit.id,
    labelKey: `${id}.unit.${unit.id}`,
  }));
  const operationDescriptors = {
    convert: {
      id: "convert",
      labelKey: `${id}.operation.convert`,
      fields: [
        {
          id: "value",
          labelKey: `${id}.field.value`,
          defaultValue: valueDefault,
          input: "decimal",
        },
        {
          id: "source",
          labelKey: `${id}.field.source`,
          defaultValue: sourceDefault,
          input: "choice",
          choices,
        },
        {
          id: "target",
          labelKey: `${id}.field.target`,
          defaultValue: targetDefault,
          input: "choice",
          choices,
        },
      ],
      working: [
        {
          messageKey: `${id}.working.convert`,
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
  function calculate(
    input: UnitPresetInput,
  ): CalculationResult<UnitPresetResult, UnitPresetError> {
    if (input.operation !== "convert")
      return { ok: false, error: { code: "invalid-field" } };
    const parsed = parseCanonicalDecimal(input.value);
    if (!parsed.ok)
      return { ok: false, error: { code: "invalid-field", field: "value" } };
    const source = units.find((unit) => unit.id === input.source);
    if (!source)
      return { ok: false, error: { code: "invalid-field", field: "source" } };
    const target = units.find((unit) => unit.id === input.target);
    if (!target)
      return { ok: false, error: { code: "invalid-field", field: "target" } };
    const converted = convertUnitValue(parsed.value, source, target);
    if (!converted.ok) return { ok: false, error: { code: converted.code } };
    const answer = decimalOutput(converted.value);
    if (answer === null)
      return { ok: false, error: { code: "output-overflow" } };
    // The visual's two aligned scales use the same exact map as the answer.
    const at = (x: number) => {
      const point = convertUnitValue(new DecimalValue(x), source, target);
      return point.ok ? point.value : null;
    };
    const zero = at(0);
    const one = at(1);
    const offset = zero && decimalOutput(zero);
    const slope = zero && one && decimalOutput(one.minus(zero));
    if (!offset || !slope)
      return { ok: false, error: { code: "output-overflow" } };
    return {
      ok: true,
      result: {
        calculatorId: id,
        operation: "convert",
        answer: { kind: "decimal", value: answer },
        working: [
          {
            id: "conversion",
            messageKey: `${id}.working.convert`,
            args: {
              value: { kind: "decimal", value: parsed.canonical },
              source: { kind: "message", key: `${id}.symbol.${source.id}` },
              target: { kind: "message", key: `${id}.symbol.${target.id}` },
              answer: { kind: "decimal", value: answer },
            },
          },
        ],
        visual: {
          value: parsed.canonical,
          source: source.id,
          target: target.id,
          answer,
          slope,
          offset,
          ...(converted.kelvin !== undefined
            ? { kelvin: converted.kelvin }
            : {}),
        },
      },
    };
  }
  return {
    operationDescriptors,
    operations: Object.values(operationDescriptors),
    calculate,
  };
}
