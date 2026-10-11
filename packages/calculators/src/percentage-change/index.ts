import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingArgument,
  WorkingStep,
} from "../contracts";
import { decimalOutput, parseCanonicalDecimal } from "../numeric/decimal";

export type PercentageChangeInputsByOperation = {
  change: { oldValue: string; newValue: string };
};

export const operationDescriptors = {
  change: {
    id: "change",
    labelKey: "percentage-change.operation.change",
    fields: [
      {
        id: "oldValue",
        labelKey: "percentage-change.field.oldValue",
        defaultValue: "80",
        input: "decimal",
      },
      {
        id: "newValue",
        labelKey: "percentage-change.field.newValue",
        defaultValue: "92",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "percentage-change.working.change",
        arguments: {
          oldValue: "decimal",
          newValue: "decimal",
          delta: "decimal",
          percentage: "decimal",
          interpretation: "message",
        },
      },
    ],
  },
} satisfies {
  [Id in keyof PercentageChangeInputsByOperation]: OperationDescriptor;
};

export const operations = Object.values(operationDescriptors);

export type PercentageChangeInput = {
  [Id in keyof PercentageChangeInputsByOperation]: {
    operation: Id;
  } & PercentageChangeInputsByOperation[Id];
}[keyof PercentageChangeInputsByOperation];

export const errorCodes = [
  "invalid-field",
  "zero-baseline",
  "output-overflow",
] as const;
export type PercentageChangeErrorCode = (typeof errorCodes)[number];

export type PercentageChangeVisual = {
  kind: "percentage-change-comparison";
  oldValue: string;
  newValue: string;
  delta: string;
  percentageChange: string;
  baselineSign: "negative" | "positive";
  negativeBaseline: boolean;
  descriptionKey: "percentage-change.visual.description";
  alternativeKey: "percentage-change.visual.alternative";
};

export type PercentageChangeWorkingArguments = {
  oldValue: NumericValue;
  newValue: NumericValue;
  delta: NumericValue;
  percentage: NumericValue;
  interpretation: Extract<WorkingArgument, { kind: "message" }>;
};

export type PercentageChangeResult = {
  calculatorId: "percentage-change";
  operation: "change";
  answer: { kind: "percentage-change"; percent: string };
  delta: { kind: "signed-delta"; value: string };
  negativeBaseline: boolean;
  working: readonly WorkingStep<PercentageChangeWorkingArguments>[];
  visual: PercentageChangeVisual;
};

export function calculate(
  input: PercentageChangeInput,
): CalculationResult<PercentageChangeResult, PercentageChangeErrorCode> {
  const oldValue = parseCanonicalDecimal(input.oldValue);
  if (!oldValue.ok) return failed("invalid-field", "oldValue");
  const newValue = parseCanonicalDecimal(input.newValue);
  if (!newValue.ok) return failed("invalid-field", "newValue");
  if (oldValue.value.isZero()) return failed("zero-baseline", "oldValue");

  const delta = newValue.value.sub(oldValue.value);
  const percentageChange = delta.div(oldValue.value).mul(100);
  const deltaOutput = decimalOutput(delta);
  const percentageOutput = decimalOutput(percentageChange);
  if (deltaOutput === null || percentageOutput === null)
    return failed("output-overflow");

  const negativeBaseline = oldValue.value.isNegative();
  const visual: PercentageChangeVisual = {
    kind: "percentage-change-comparison",
    oldValue: oldValue.canonical,
    newValue: newValue.canonical,
    delta: deltaOutput,
    percentageChange: percentageOutput,
    baselineSign: negativeBaseline ? "negative" : "positive",
    negativeBaseline,
    descriptionKey: "percentage-change.visual.description",
    alternativeKey: "percentage-change.visual.alternative",
  };
  const working: WorkingStep<PercentageChangeWorkingArguments>[] = [
    {
      id: "signed-baseline-change",
      messageKey: "percentage-change.working.change",
      args: {
        oldValue: decimalArgument(oldValue.canonical),
        newValue: decimalArgument(newValue.canonical),
        delta: decimalArgument(deltaOutput),
        percentage: decimalArgument(percentageOutput),
        interpretation: {
          kind: "message",
          key: negativeBaseline
            ? "percentage-change.working.negativeBaselineNote"
            : "percentage-change.working.standardBaselineNote",
        },
      },
    },
  ];

  return {
    ok: true,
    result: {
      calculatorId: "percentage-change",
      operation: "change",
      answer: { kind: "percentage-change", percent: percentageOutput },
      delta: { kind: "signed-delta", value: deltaOutput },
      negativeBaseline,
      working,
      visual,
    },
  };
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(
  code: PercentageChangeErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<PercentageChangeErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
