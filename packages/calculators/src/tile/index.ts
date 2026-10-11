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
export type Input = {
  operation: "tiles";
  area: string;
  tileWidth: string;
  tileHeight: string;
  waste: string;
};
export const operationDescriptors = {
  tiles: {
    id: "tiles",
    labelKey: "tile.operation.tiles",
    fields: [
      {
        id: "area",
        labelKey: "tile.field.area",
        unitKey: "tile.unit.m2",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
      {
        id: "tileWidth",
        labelKey: "tile.field.tileWidth",
        unitKey: "tile.unit.cm",
        sign: "nonnegative",
        defaultValue: "60",
        input: "decimal",
      },
      {
        id: "tileHeight",
        labelKey: "tile.field.tileHeight",
        unitKey: "tile.unit.cm",
        sign: "nonnegative",
        defaultValue: "30",
        input: "decimal",
      },
      {
        id: "waste",
        labelKey: "tile.field.waste",
        unitKey: "tile.unit.percent",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "tile.working.summary",
        arguments: {
          area: "decimal",
          tileWidth: "decimal",
          tileHeight: "decimal",
          waste: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<Input["operation"], OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export const errorCodes = [
  "invalid-field",
  "out-of-range",
  "output-overflow",
] as const;
export type ErrorCode = (typeof errorCodes)[number];
export type Result = {
  calculatorId: "tile";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "tiles";
    /** Whole tiles to buy. */
    answer: string;
    /** Net area (m²). */
    reference: string;
    /** Tiles before rounding up. */
    exactTiles: string;
    /** Face area of one tile (cm²). */
    tileArea: string;
    waste: string;
    descriptionKey: string;
    alternativeKey: string;
  };
};
function failure(
  code: ErrorCode,
  field?: string,
): CalculationResult<Result, ErrorCode> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
export function calculate(input: Input): CalculationResult<Result, ErrorCode> {
  if (!Object.hasOwn(operationDescriptors, input.operation))
    return failure("invalid-field");
  const v = {} as Record<string, InstanceType<typeof DecimalValue>>;
  const area = parseCanonicalDecimal(input.area);
  if (!area.ok) return failure("invalid-field", "area");
  if (area.value.lt(0.000000000001) || area.value.gt(1000000))
    return failure("out-of-range", "area");
  v.area = area.value;
  const tileWidth = parseCanonicalDecimal(input.tileWidth);
  if (!tileWidth.ok) return failure("invalid-field", "tileWidth");
  if (tileWidth.value.lt(0.000000000001) || tileWidth.value.gt(1000000))
    return failure("out-of-range", "tileWidth");
  v.tileWidth = tileWidth.value;
  const tileHeight = parseCanonicalDecimal(input.tileHeight);
  if (!tileHeight.ok) return failure("invalid-field", "tileHeight");
  if (tileHeight.value.lt(0.000000000001) || tileHeight.value.gt(1000000))
    return failure("out-of-range", "tileHeight");
  v.tileHeight = tileHeight.value;
  const waste = parseCanonicalDecimal(input.waste);
  if (!waste.ok) return failure("invalid-field", "waste");
  if (waste.value.lt(0) || waste.value.gt(100))
    return failure("out-of-range", "waste");
  v.waste = waste.value;
  const reference = v.area;
  const face = v.tileWidth.mul(v.tileHeight);
  const exact = v.area
    .mul(10000)
    .mul(new DecimalValue(1).add(v.waste.div(100)))
    .div(face);
  const answer = exact.ceil();
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const exactTiles = decimalOutput(exact);
  const tileArea = decimalOutput(face);
  if (
    value === null ||
    ref === null ||
    exactTiles === null ||
    tileArea === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "tile",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "tile.working.summary",
          args: {
            area: { kind: "decimal", value: v.area.toFixed() },
            tileWidth: { kind: "decimal", value: v.tileWidth.toFixed() },
            tileHeight: { kind: "decimal", value: v.tileHeight.toFixed() },
            waste: { kind: "decimal", value: v.waste.toFixed() },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "tiles",
        answer: value,
        reference: ref,
        exactTiles,
        tileArea,
        waste: v.waste.toFixed(),
        descriptionKey: "tile.visual.description",
        alternativeKey: "tile.visual.alternative",
      },
    },
  };
}
