import type {
  CalculationResult,
  EngineFailure,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";

const PI = new DecimalValue(
  "3.14159265358979323846264338327950288419716939937510",
);

export type AreaOperation = "rectangle" | "triangle" | "circle";
export type AreaInput =
  | { operation: "rectangle"; width: string; height: string }
  | { operation: "triangle"; base: string; height: string }
  | { operation: "circle"; radius: string };
export type AreaErrorCode =
  | "invalid-field"
  | "nonpositive-dimension"
  | "output-overflow";

export const errorCodes = [
  "invalid-field",
  "nonpositive-dimension",
  "output-overflow",
] as const satisfies readonly AreaErrorCode[];

export const operationDescriptors = {
  rectangle: {
    id: "rectangle",
    labelKey: "area.operation.rectangle",
    fields: [
      {
        id: "width",
        labelKey: "area.field.width",
        defaultValue: "5",
        input: "decimal",
        unitKey: "area.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "area.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "area.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "area.working.rectangle",
        arguments: { width: "decimal", height: "decimal", answer: "decimal" },
      },
    ],
  },
  triangle: {
    id: "triangle",
    labelKey: "area.operation.triangle",
    fields: [
      {
        id: "base",
        labelKey: "area.field.base",
        defaultValue: "6",
        input: "decimal",
        unitKey: "area.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "area.field.height",
        defaultValue: "4",
        input: "decimal",
        unitKey: "area.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "area.working.triangle",
        arguments: { base: "decimal", height: "decimal", answer: "decimal" },
      },
    ],
  },
  circle: {
    id: "circle",
    labelKey: "area.operation.circle",
    fields: [
      {
        id: "radius",
        labelKey: "area.field.radius",
        defaultValue: "2",
        input: "decimal",
        unitKey: "area.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "area.working.circle",
        arguments: { radius: "decimal", answer: "decimal" },
      },
    ],
  },
} satisfies Record<AreaOperation, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);

export type AreaVisual =
  | {
      kind: "area-rectangle";
      width: string;
      height: string;
      area: string;
      unitKey: "area.unit.square-metre";
    }
  | {
      kind: "area-triangle";
      base: string;
      perpendicularHeight: string;
      area: string;
      unitKey: "area.unit.square-metre";
    }
  | {
      kind: "area-circle";
      radius: string;
      area: string;
      unitKey: "area.unit.square-metre";
    };
export type AreaResult = {
  calculatorId: "area";
  operation: AreaOperation;
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: AreaVisual;
};

export function calculate(
  input: AreaInput,
): CalculationResult<AreaResult, AreaErrorCode> {
  const fields =
    input.operation === "rectangle"
      ? (["width", "height"] as const)
      : input.operation === "triangle"
        ? (["base", "height"] as const)
        : (["radius"] as const);
  const rawFields = input as unknown as Readonly<Record<string, string>>;
  const parsed = fields.map(
    (field) => [field, parseCanonicalDecimal(rawFields[field] ?? "")] as const,
  );
  for (const [field, result] of parsed) {
    if (!result.ok) return failed("invalid-field", field);
    if (!result.value.gt(0)) return failed("nonpositive-dimension", field);
  }
  const values = new Map(parsed);
  let area: InstanceType<typeof DecimalValue>;
  let visual: AreaVisual;
  let workingKey: string;
  let args: Record<string, { kind: "decimal"; value: string }>;
  if (input.operation === "rectangle") {
    const widthResult = values.get("width");
    if (!widthResult?.ok) return failed("invalid-field", "width");
    const heightResult = values.get("height");
    if (!heightResult?.ok) return failed("invalid-field", "height");
    const width = widthResult;
    const height = heightResult;
    area = width.value.mul(height.value);
    visual = {
      kind: "area-rectangle",
      width: width.canonical,
      height: height.canonical,
      area: area.toFixed(),
      unitKey: "area.unit.square-metre",
    };
    workingKey = "area.working.rectangle";
    args = {
      width: decimalArg(width.canonical),
      height: decimalArg(height.canonical),
    };
  } else if (input.operation === "triangle") {
    const baseResult = values.get("base");
    if (!baseResult?.ok) return failed("invalid-field", "base");
    const heightResult = values.get("height");
    if (!heightResult?.ok) return failed("invalid-field", "height");
    const base = baseResult;
    const height = heightResult;
    area = base.value.mul(height.value).div(2);
    visual = {
      kind: "area-triangle",
      base: base.canonical,
      perpendicularHeight: height.canonical,
      area: area.toFixed(),
      unitKey: "area.unit.square-metre",
    };
    workingKey = "area.working.triangle";
    args = {
      base: decimalArg(base.canonical),
      height: decimalArg(height.canonical),
    };
  } else {
    const radiusResult = values.get("radius");
    if (!radiusResult?.ok) return failed("invalid-field", "radius");
    const radius = radiusResult;
    area = PI.mul(radius.value).mul(radius.value);
    visual = {
      kind: "area-circle",
      radius: radius.canonical,
      area: area.toFixed(),
      unitKey: "area.unit.square-metre",
    };
    workingKey = "area.working.circle";
    args = { radius: decimalArg(radius.canonical) };
  }
  const answer = decimalOutput(area);
  if (answer === null) return failed("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "area",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      working: [
        {
          id: "substitution",
          messageKey: workingKey,
          args: { ...args, answer: decimalArg(answer) },
        },
      ],
      visual,
    },
  };
}

function decimalArg(value: string) {
  return { kind: "decimal" as const, value };
}

function failed(
  code: AreaErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<AreaErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
