import type {
  CalculationResult,
  EngineFailure,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  type DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";

export type PythagoreanOperation = "missing-hypotenuse" | "missing-leg";
export type PythagoreanInput =
  | { operation: "missing-hypotenuse"; a: string; b: string }
  | { operation: "missing-leg"; hypotenuse: string; leg: string };
export type PythagoreanErrorCode =
  | "invalid-field"
  | "nonpositive-side"
  | "impossible-triangle"
  | "output-overflow";

export const errorCodes = [
  "invalid-field",
  "nonpositive-side",
  "impossible-triangle",
  "output-overflow",
] as const satisfies readonly PythagoreanErrorCode[];

export const operationDescriptors = {
  "missing-hypotenuse": {
    id: "missing-hypotenuse",
    labelKey: "pythagorean.operation.missing-hypotenuse",
    fields: [
      {
        id: "a",
        labelKey: "pythagorean.field.leg-a",
        defaultValue: "3",
        input: "decimal",
        unitKey: "pythagorean.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "b",
        labelKey: "pythagorean.field.leg-b",
        defaultValue: "4",
        input: "decimal",
        unitKey: "pythagorean.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "pythagorean.working.missing-hypotenuse",
        arguments: { a: "decimal", b: "decimal", hypotenuse: "decimal" },
      },
    ],
  },
  "missing-leg": {
    id: "missing-leg",
    labelKey: "pythagorean.operation.missing-leg",
    fields: [
      {
        id: "hypotenuse",
        labelKey: "pythagorean.field.hypotenuse",
        defaultValue: "5",
        input: "decimal",
        unitKey: "pythagorean.unit.metre",
        sign: "nonnegative",
      },
      {
        id: "leg",
        labelKey: "pythagorean.field.known-leg",
        defaultValue: "3",
        input: "decimal",
        unitKey: "pythagorean.unit.metre",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "pythagorean.working.missing-leg",
        arguments: { hypotenuse: "decimal", leg: "decimal", answer: "decimal" },
      },
    ],
  },
} satisfies Record<PythagoreanOperation, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);

export type PythagoreanVisual = {
  kind: "pythagorean-right-triangle";
  a: string;
  b: string;
  c: string;
  solvedSide: "a" | "b" | "c";
  unitKey: "pythagorean.unit.metre";
};
export type PythagoreanResult = {
  calculatorId: "pythagorean";
  operation: PythagoreanOperation;
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: PythagoreanVisual;
};

export function calculate(
  input: PythagoreanInput,
): CalculationResult<PythagoreanResult, PythagoreanErrorCode> {
  const fields =
    input.operation === "missing-hypotenuse"
      ? (["a", "b"] as const)
      : (["hypotenuse", "leg"] as const);
  const rawFields = input as unknown as Readonly<Record<string, string>>;
  const parsed = fields.map(
    (field) => [field, parseCanonicalDecimal(rawFields[field] ?? "")] as const,
  );
  for (const [field, result] of parsed) {
    if (!result.ok) return failed("invalid-field", field);
    if (!result.value.gt(0)) return failed("nonpositive-side", field);
  }
  const values = new Map(parsed);
  let answer: InstanceType<typeof DecimalValue>;
  let visual: PythagoreanVisual;
  let workingKey: string;
  let args: Record<string, { kind: "decimal"; value: string }>;
  if (input.operation === "missing-hypotenuse") {
    const aResult = values.get("a");
    if (!aResult?.ok) return failed("invalid-field", "a");
    const bResult = values.get("b");
    if (!bResult?.ok) return failed("invalid-field", "b");
    const a = aResult;
    const b = bResult;
    answer = a.value.mul(a.value).plus(b.value.mul(b.value)).sqrt();
    visual = {
      kind: "pythagorean-right-triangle",
      a: a.canonical,
      b: b.canonical,
      c: answer.toFixed(),
      solvedSide: "c",
      unitKey: "pythagorean.unit.metre",
    };
    workingKey = "pythagorean.working.missing-hypotenuse";
    args = { a: decimalArg(a.canonical), b: decimalArg(b.canonical) };
  } else {
    const hypotenuseResult = values.get("hypotenuse");
    if (!hypotenuseResult?.ok) return failed("invalid-field", "hypotenuse");
    const legResult = values.get("leg");
    if (!legResult?.ok) return failed("invalid-field", "leg");
    const hypotenuse = hypotenuseResult;
    const leg = legResult;
    if (!hypotenuse.value.gt(leg.value))
      return failed("impossible-triangle", "hypotenuse");
    answer = hypotenuse.value
      .mul(hypotenuse.value)
      .minus(leg.value.mul(leg.value))
      .sqrt();
    visual = {
      kind: "pythagorean-right-triangle",
      a: leg.canonical,
      b: answer.toFixed(),
      c: hypotenuse.canonical,
      solvedSide: "b",
      unitKey: "pythagorean.unit.metre",
    };
    workingKey = "pythagorean.working.missing-leg";
    args = {
      hypotenuse: decimalArg(hypotenuse.canonical),
      leg: decimalArg(leg.canonical),
    };
  }
  const canonicalAnswer = decimalOutput(answer);
  if (canonicalAnswer === null) return failed("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "pythagorean",
      operation: input.operation,
      answer: { kind: "decimal", value: canonicalAnswer },
      working: [
        {
          id: "substitution",
          messageKey: workingKey,
          args: {
            ...args,
            ...(input.operation === "missing-hypotenuse"
              ? { hypotenuse: decimalArg(canonicalAnswer) }
              : { answer: decimalArg(canonicalAnswer) }),
          },
        },
      ],
      visual: {
        ...visual,
        ...(input.operation === "missing-hypotenuse"
          ? { c: canonicalAnswer }
          : { b: canonicalAnswer }),
      },
    },
  };
}

function decimalArg(value: string) {
  return { kind: "decimal" as const, value };
}

function failed(
  code: PythagoreanErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<PythagoreanErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
