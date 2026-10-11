import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";

export type PercentageInputsByOperation = {
  "of-value": { value: string; percentage: string };
  ratio: { part: string; whole: string };
};

export const operationDescriptors = {
  "of-value": {
    id: "of-value",
    labelKey: "percentage.operation.ofValue",
    fields: [
      {
        id: "value",
        labelKey: "percentage.field.value",
        defaultValue: "80",
        input: "decimal",
      },
      {
        id: "percentage",
        labelKey: "percentage.field.percentage",
        unitKey: "unit.percent",
        defaultValue: "15",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "percentage.working.ofValue",
        arguments: { first: "decimal", second: "decimal", answer: "decimal" },
      },
    ],
  },
  ratio: {
    id: "ratio",
    labelKey: "percentage.operation.ratio",
    fields: [
      {
        id: "part",
        labelKey: "percentage.field.part",
        defaultValue: "18",
        input: "decimal",
      },
      {
        id: "whole",
        labelKey: "percentage.field.whole",
        defaultValue: "24",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "percentage.working.ratio",
        arguments: { first: "decimal", second: "decimal", answer: "decimal" },
      },
    ],
  },
} satisfies { [Id in keyof PercentageInputsByOperation]: OperationDescriptor };
export const operations = Object.values(operationDescriptors);

export type PercentageInput = {
  [Id in keyof PercentageInputsByOperation]: {
    operation: Id;
  } & PercentageInputsByOperation[Id];
}[keyof PercentageInputsByOperation];

export const errorCodes = [
  "invalid-field",
  "zero-denominator",
  "output-overflow",
] as const;
export type PercentageErrorCode = (typeof errorCodes)[number];
export type PercentageVisual = {
  kind: "percentage-bar";
  value: string;
  reference: "100" | string;
  fraction: string;
  outside: boolean;
  sign: "negative" | "zero" | "positive";
  descriptionKey: "percentage.visual.description";
  alternativeKey: "percentage.visual.alternative";
  outsideLabelKey: "percentage.visual.outside";
};
export type PercentageResult = {
  calculatorId: "percentage";
  operation: PercentageInput["operation"];
  answer: NumericValue;
  working: readonly WorkingStep<PercentageWorkingArguments>[];
  visual: PercentageVisual;
};
export type PercentageWorkingArguments = {
  first: NumericValue;
  second: NumericValue;
  answer: NumericValue;
};

function visual(
  answer: InstanceType<typeof DecimalValue>,
  reference: InstanceType<typeof DecimalValue>,
): PercentageVisual {
  const absolute = answer.abs();
  const denominator = reference.abs();
  const outside = absolute.gt(denominator);
  const filled = DecimalValue.min(absolute, denominator);
  const fraction = denominator.isZero()
    ? "0"
    : filled.div(denominator).toFixed();
  return {
    kind: "percentage-bar",
    value: answer.toFixed(),
    reference: denominator.toFixed(),
    fraction,
    outside,
    sign: answer.isZero()
      ? "zero"
      : answer.isNegative()
        ? "negative"
        : "positive",
    descriptionKey: "percentage.visual.description",
    alternativeKey: "percentage.visual.alternative",
    outsideLabelKey: "percentage.visual.outside",
  };
}

export function calculate(
  input: PercentageInput,
): CalculationResult<PercentageResult, PercentageErrorCode> {
  const left = parseCanonicalDecimal(
    input.operation === "of-value" ? input.value : input.part,
  );
  const right = parseCanonicalDecimal(
    input.operation === "of-value" ? input.percentage : input.whole,
  );
  if (!left.ok)
    return failed(
      "invalid-field",
      input.operation === "of-value" ? "value" : "part",
    );
  if (!right.ok)
    return failed(
      "invalid-field",
      input.operation === "of-value" ? "percentage" : "whole",
    );
  if (input.operation === "ratio" && right.value.isZero())
    return failed("zero-denominator", "whole");
  const answer =
    input.operation === "of-value"
      ? left.value.mul(right.value).div(100)
      : left.value.div(right.value).mul(100);
  const output = decimalOutput(answer);
  if (output === null) return failed("output-overflow");
  const formula =
    input.operation === "of-value"
      ? "percentage.working.ofValue"
      : "percentage.working.ratio";
  return {
    ok: true,
    result: {
      calculatorId: "percentage",
      operation: input.operation,
      answer: { kind: "decimal", value: output },
      working: [
        {
          id: "substitution",
          messageKey: formula,
          args: {
            first: decimalArgument(left.canonical),
            second: decimalArgument(right.canonical),
            answer: decimalArgument(output),
          },
        },
      ],
      visual: visual(
        answer,
        input.operation === "of-value" ? left.value : new DecimalValue(100),
      ),
    },
  };
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(
  code: PercentageErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<PercentageErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
