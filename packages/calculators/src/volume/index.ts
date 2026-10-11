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

export type VolumeOperation = "prism" | "cylinder" | "sphere";
export type VolumeInput =
  | { operation: "prism"; width: string; height: string; depth: string }
  | { operation: "cylinder"; radius: string; height: string }
  | { operation: "sphere"; radius: string };
export type VolumeErrorCode =
  | "invalid-field"
  | "nonpositive-dimension"
  | "output-overflow";

export const errorCodes = [
  "invalid-field",
  "nonpositive-dimension",
  "output-overflow",
] as const satisfies readonly VolumeErrorCode[];

export const operationDescriptors = {
  prism: {
    id: "prism",
    labelKey: "volume.operation.prism",
    fields: [
      {
        id: "width",
        labelKey: "volume.field.width",
        defaultValue: "4",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "volume.field.height",
        defaultValue: "2.5",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "depth",
        labelKey: "volume.field.depth",
        defaultValue: "3",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "volume.working.prism",
        arguments: {
          width: "decimal",
          height: "decimal",
          depth: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  cylinder: {
    id: "cylinder",
    labelKey: "volume.operation.cylinder",
    fields: [
      {
        id: "radius",
        labelKey: "volume.field.radius",
        defaultValue: "0.5",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "height",
        labelKey: "volume.field.height",
        defaultValue: "1.2",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "volume.working.cylinder",
        arguments: { radius: "decimal", height: "decimal", answer: "decimal" },
      },
    ],
  },
  sphere: {
    id: "sphere",
    labelKey: "volume.operation.sphere",
    fields: [
      {
        id: "radius",
        labelKey: "volume.field.radius",
        defaultValue: "1.5",
        input: "decimal",
        unitKey: "volume.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "volume.working.sphere",
        arguments: { radius: "decimal", answer: "decimal" },
      },
    ],
  },
} satisfies Record<VolumeOperation, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);

export type VolumeVisual =
  | {
      kind: "volume-prism";
      width: string;
      height: string;
      depth: string;
      volume: string;
      unitKey: "volume.unit.cubic-metre";
    }
  | {
      kind: "volume-cylinder";
      radius: string;
      height: string;
      volume: string;
      unitKey: "volume.unit.cubic-metre";
    }
  | {
      kind: "volume-sphere";
      radius: string;
      volume: string;
      unitKey: "volume.unit.cubic-metre";
    };
export type VolumeResult = {
  calculatorId: "volume";
  operation: VolumeOperation;
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: VolumeVisual;
};

export function calculate(
  input: VolumeInput,
): CalculationResult<VolumeResult, VolumeErrorCode> {
  const fields =
    input.operation === "prism"
      ? (["width", "height", "depth"] as const)
      : input.operation === "cylinder"
        ? (["radius", "height"] as const)
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
  let volume: InstanceType<typeof DecimalValue>;
  let visual: VolumeVisual;
  let workingKey: string;
  let args: Record<string, { kind: "decimal"; value: string }>;
  if (input.operation === "prism") {
    const widthResult = values.get("width");
    if (!widthResult?.ok) return failed("invalid-field", "width");
    const heightResult = values.get("height");
    if (!heightResult?.ok) return failed("invalid-field", "height");
    const depthResult = values.get("depth");
    if (!depthResult?.ok) return failed("invalid-field", "depth");
    const width = widthResult;
    const height = heightResult;
    const depth = depthResult;
    volume = width.value.mul(height.value).mul(depth.value);
    visual = {
      kind: "volume-prism",
      width: width.canonical,
      height: height.canonical,
      depth: depth.canonical,
      volume: volume.toFixed(),
      unitKey: "volume.unit.cubic-metre",
    };
    workingKey = "volume.working.prism";
    args = {
      width: decimalArg(width.canonical),
      height: decimalArg(height.canonical),
      depth: decimalArg(depth.canonical),
    };
  } else if (input.operation === "cylinder") {
    const radiusResult = values.get("radius");
    if (!radiusResult?.ok) return failed("invalid-field", "radius");
    const heightResult = values.get("height");
    if (!heightResult?.ok) return failed("invalid-field", "height");
    const radius = radiusResult;
    const height = heightResult;
    volume = PI.mul(radius.value).mul(radius.value).mul(height.value);
    visual = {
      kind: "volume-cylinder",
      radius: radius.canonical,
      height: height.canonical,
      volume: volume.toFixed(),
      unitKey: "volume.unit.cubic-metre",
    };
    workingKey = "volume.working.cylinder";
    args = {
      radius: decimalArg(radius.canonical),
      height: decimalArg(height.canonical),
    };
  } else {
    const radiusResult = values.get("radius");
    if (!radiusResult?.ok) return failed("invalid-field", "radius");
    const radius = radiusResult;
    volume = PI.mul(4)
      .div(3)
      .mul(radius.value)
      .mul(radius.value)
      .mul(radius.value);
    visual = {
      kind: "volume-sphere",
      radius: radius.canonical,
      volume: volume.toFixed(),
      unitKey: "volume.unit.cubic-metre",
    };
    workingKey = "volume.working.sphere";
    args = { radius: decimalArg(radius.canonical) };
  }
  const answer = decimalOutput(volume);
  if (answer === null) return failed("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "volume",
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
  code: VolumeErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<VolumeErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
