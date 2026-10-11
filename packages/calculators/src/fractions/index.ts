import type {
  CalculationResult,
  EngineFailure,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  addRationals,
  compareRationalToInteger,
  divideRationals,
  greatestCommonDivisor,
  MAX_RATIONAL_OUTPUT_DIGITS,
  multiplyRationals,
  normalizeRational,
  parseRationalInteger,
  type Rational,
  rationalMagnitudeDigits,
  subtractRationals,
} from "../numeric/rational";

type BinaryFractionFields = {
  leftNumerator: string;
  leftDenominator: string;
  rightNumerator: string;
  rightDenominator: string;
};

export type FractionInputsByOperation = {
  add: BinaryFractionFields;
  subtract: BinaryFractionFields;
  multiply: BinaryFractionFields;
  divide: BinaryFractionFields;
  reduce: { numerator: string; denominator: string };
};

const binaryFields = [
  {
    id: "leftNumerator",
    labelKey: "fractions.field.leftNumerator",
    defaultValue: "1",
    input: "integer",
  },
  {
    id: "leftDenominator",
    labelKey: "fractions.field.leftDenominator",
    defaultValue: "2",
    input: "integer",
  },
  {
    id: "rightNumerator",
    labelKey: "fractions.field.rightNumerator",
    defaultValue: "1",
    input: "integer",
  },
  {
    id: "rightDenominator",
    labelKey: "fractions.field.rightDenominator",
    defaultValue: "3",
    input: "integer",
  },
] as const;

export const operationDescriptors = {
  add: {
    id: "add",
    labelKey: "fractions.operation.add",
    fields: binaryFields,
    working: [
      {
        messageKey: "fractions.working.add",
        arguments: { left: "text", right: "text", answer: "text" },
      },
    ],
  },
  subtract: {
    id: "subtract",
    labelKey: "fractions.operation.subtract",
    fields: binaryFields,
    working: [
      {
        messageKey: "fractions.working.subtract",
        arguments: { left: "text", right: "text", answer: "text" },
      },
    ],
  },
  multiply: {
    id: "multiply",
    labelKey: "fractions.operation.multiply",
    fields: binaryFields,
    working: [
      {
        messageKey: "fractions.working.multiply",
        arguments: { left: "text", right: "text", answer: "text" },
      },
    ],
  },
  divide: {
    id: "divide",
    labelKey: "fractions.operation.divide",
    fields: binaryFields,
    working: [
      {
        messageKey: "fractions.working.divide",
        arguments: { left: "text", right: "text", answer: "text" },
      },
    ],
  },
  reduce: {
    id: "reduce",
    labelKey: "fractions.operation.reduce",
    fields: [
      {
        id: "numerator",
        labelKey: "fractions.field.numerator",
        defaultValue: "-42",
        input: "integer",
      },
      {
        id: "denominator",
        labelKey: "fractions.field.denominator",
        defaultValue: "56",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "fractions.working.reduce",
        arguments: { input: "text", divisor: "text", answer: "text" },
      },
    ],
  },
} satisfies { [Id in keyof FractionInputsByOperation]: OperationDescriptor };

export const operations = Object.values(operationDescriptors);

export type FractionInput = {
  [Id in keyof FractionInputsByOperation]: {
    operation: Id;
  } & FractionInputsByOperation[Id];
}[keyof FractionInputsByOperation];

export const errorCodes = [
  "invalid-integer",
  "integer-too-large",
  "zero-denominator",
  "division-by-zero",
  "output-too-large",
] as const;
export type FractionErrorCode = (typeof errorCodes)[number];

type TextValue = { kind: "text"; value: string };
export type FractionWorkingArguments = Readonly<Record<string, TextValue>>;

export type MixedFraction = {
  sign: "negative" | "zero" | "positive";
  whole: string;
  remainderNumerator: string;
  remainderDenominator: string;
  text: string;
};

export type FractionVisual = {
  kind: "exact-fraction-model";
  numerator: string;
  denominator: string;
  properNumerator: string;
  properDenominator: string;
  mixed: MixedFraction;
  numberLine: {
    lowerBound: "-10";
    upperBound: "10";
    exactMarkerNumerator: string;
    exactMarkerDenominator: string;
    outsideWindow: boolean;
  };
  descriptionKey: "fractions.visual.description";
  alternativeKey: "fractions.visual.alternative";
};

export type FractionResult = {
  calculatorId: "fractions";
  operation: FractionInput["operation"];
  answer: {
    kind: "exact-rational";
    numerator: string;
    denominator: string;
  };
  mixed: MixedFraction;
  working: readonly WorkingStep<FractionWorkingArguments>[];
  visual: FractionVisual;
};

export function calculate(
  input: FractionInput,
): CalculationResult<FractionResult, FractionErrorCode> {
  let result: Rational;
  let messageKey: string;
  let workingArguments: Record<string, TextValue>;

  if (input.operation === "reduce") {
    const numerator = parseIntegerField(input.numerator, "numerator");
    if (!numerator.ok) return numerator;
    const denominator = parseIntegerField(input.denominator, "denominator");
    if (!denominator.ok) return denominator;
    if (denominator.value === 0n)
      return failed("zero-denominator", "denominator");
    result = normalizeRational(numerator.value, denominator.value);
    const divisor = greatestCommonDivisor(numerator.value, denominator.value);
    messageKey = "fractions.working.reduce";
    workingArguments = {
      input: text(
        `${numerator.value.toString()}/${denominator.value.toString()}`,
      ),
      divisor: text(divisor.toString()),
      answer: text(formatRational(result)),
    };
  } else {
    const leftNumerator = parseIntegerField(
      input.leftNumerator,
      "leftNumerator",
    );
    if (!leftNumerator.ok) return leftNumerator;
    const leftDenominator = parseIntegerField(
      input.leftDenominator,
      "leftDenominator",
    );
    if (!leftDenominator.ok) return leftDenominator;
    if (leftDenominator.value === 0n)
      return failed("zero-denominator", "leftDenominator");
    const left = normalizeRational(leftNumerator.value, leftDenominator.value);

    const rightNumerator = parseIntegerField(
      input.rightNumerator,
      "rightNumerator",
    );
    if (!rightNumerator.ok) return rightNumerator;
    const rightDenominator = parseIntegerField(
      input.rightDenominator,
      "rightDenominator",
    );
    if (!rightDenominator.ok) return rightDenominator;
    if (rightDenominator.value === 0n)
      return failed("zero-denominator", "rightDenominator");
    const right = normalizeRational(
      rightNumerator.value,
      rightDenominator.value,
    );
    if (input.operation === "divide" && right.numerator === 0n)
      return failed("division-by-zero", "rightNumerator");

    switch (input.operation) {
      case "add":
        result = addRationals(left, right);
        break;
      case "subtract":
        result = subtractRationals(left, right);
        break;
      case "multiply":
        result = multiplyRationals(left, right);
        break;
      case "divide":
        result = divideRationals(left, right);
        break;
    }
    messageKey = `fractions.working.${input.operation}`;
    workingArguments = {
      left: text(formatRational(left)),
      right: text(formatRational(right)),
      answer: text(formatRational(result)),
    };
  }

  if (!withinOutputBound(result)) return failed("output-too-large");
  const mixed = mixedFraction(result);
  const visual = makeVisual(result, mixed);
  return {
    ok: true,
    result: {
      calculatorId: "fractions",
      operation: input.operation,
      answer: {
        kind: "exact-rational",
        numerator: result.numerator.toString(),
        denominator: result.denominator.toString(),
      },
      mixed,
      working: [
        {
          id: `fraction-${input.operation}`,
          messageKey,
          args: workingArguments,
        },
      ],
      visual,
    },
  };
}

function parseIntegerField(
  value: string,
  field: string,
):
  | { ok: true; value: bigint }
  | { ok: false; error: EngineFailure<FractionErrorCode> } {
  const parsed = parseRationalInteger(value);
  if (parsed.ok) return parsed;
  return failed(parsed.error, field);
}

function withinOutputBound(value: Rational): boolean {
  return (
    rationalMagnitudeDigits(value.numerator) <= MAX_RATIONAL_OUTPUT_DIGITS &&
    rationalMagnitudeDigits(value.denominator) <= MAX_RATIONAL_OUTPUT_DIGITS
  );
}

function mixedFraction(value: Rational): MixedFraction {
  const negative = value.numerator < 0n;
  const absoluteNumerator = negative ? -value.numerator : value.numerator;
  const whole = absoluteNumerator / value.denominator;
  const remainder = absoluteNumerator % value.denominator;
  const sign =
    value.numerator === 0n ? "zero" : negative ? "negative" : "positive";
  const prefix = negative ? "-" : "";
  const mixedText =
    remainder === 0n
      ? `${prefix}${whole}`
      : whole === 0n
        ? `${prefix}${remainder}/${value.denominator}`
        : `${prefix}${whole} ${remainder}/${value.denominator}`;
  return {
    sign,
    whole: whole.toString(),
    remainderNumerator: remainder.toString(),
    remainderDenominator: value.denominator.toString(),
    text: mixedText,
  };
}

function makeVisual(value: Rational, mixed: MixedFraction): FractionVisual {
  const negative = value.numerator < 0n;
  const absoluteNumerator = negative ? -value.numerator : value.numerator;
  const remainder = absoluteNumerator % value.denominator;
  return {
    kind: "exact-fraction-model",
    numerator: value.numerator.toString(),
    denominator: value.denominator.toString(),
    properNumerator: remainder.toString(),
    properDenominator: value.denominator.toString(),
    mixed,
    numberLine: {
      lowerBound: "-10",
      upperBound: "10",
      exactMarkerNumerator: value.numerator.toString(),
      exactMarkerDenominator: value.denominator.toString(),
      outsideWindow:
        compareRationalToInteger(value, -10n) < 0 ||
        compareRationalToInteger(value, 10n) > 0,
    },
    descriptionKey: "fractions.visual.description",
    alternativeKey: "fractions.visual.alternative",
  };
}

function formatRational(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function text(value: string): TextValue {
  return { kind: "text", value };
}

function failed(
  code: FractionErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<FractionErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
