import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { DecimalValue, parseCanonicalDecimal } from "../numeric/decimal";
import {
  MAX_USD_CENTS,
  parseUsdCents,
  roundCents,
  usdCentsToString,
} from "../numeric/money";

export type TipSplittingInputsByOperation = {
  split: { subtotal: string; tipRate: string; people: string };
};

const unevenArguments = {
  total: "decimal",
  people: "text",
  baseShare: "decimal",
  baseCount: "text",
  extraShare: "decimal",
  extraCount: "text",
} as const;

export const operationDescriptors = {
  split: {
    id: "split",
    labelKey: "tip-splitting.operation.split",
    fields: [
      {
        id: "subtotal",
        labelKey: "tip-splitting.field.subtotal",
        unitKey: "unit.usd",
        defaultValue: "86.40",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "tipRate",
        labelKey: "tip-splitting.field.tipRate",
        unitKey: "unit.percent",
        defaultValue: "18",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "people",
        labelKey: "tip-splitting.field.people",
        defaultValue: "3",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "tip-splitting.working.summary",
        arguments: {
          subtotal: "decimal",
          tipRate: "decimal",
          people: "text",
          tip: "decimal",
          total: "decimal",
        },
      },
      {
        messageKey: "tip-splitting.working.even",
        arguments: { total: "decimal", people: "text", baseShare: "decimal" },
      },
      {
        messageKey: "tip-splitting.working.uneven",
        arguments: unevenArguments,
      },
      {
        messageKey: "tip-splitting.working.single",
        arguments: { total: "decimal" },
      },
    ],
  },
} satisfies {
  [Id in keyof TipSplittingInputsByOperation]: OperationDescriptor;
};

export const operations = Object.values(operationDescriptors);

export type TipSplittingInput = {
  [Id in keyof TipSplittingInputsByOperation]: {
    operation: Id;
  } & TipSplittingInputsByOperation[Id];
}[keyof TipSplittingInputsByOperation];

export const errorCodes = [
  "invalid-subtotal",
  "negative-subtotal",
  "fractional-cent-subtotal",
  "subtotal-out-of-range",
  "invalid-rate",
  "rate-out-of-range",
  "invalid-people",
  "output-overflow",
] as const;
export type TipSplittingErrorCode = (typeof errorCodes)[number];

export type TipShareClass = {
  shareCents: string;
  count: number;
};

export type TipSplittingVisual = {
  kind: "tip-split-allocation";
  shares: readonly [TipShareClass, TipShareClass];
  totalCents: string;
  descriptionKey: "tip-splitting.visual.description";
  alternativeKey: "tip-splitting.visual.alternative";
};

export type TipSplittingWorkingArguments = {
  subtotal: NumericValue;
  tipRate: NumericValue;
  people: { kind: "text"; value: string };
  tip: NumericValue;
  total: NumericValue;
};

export type TipSplittingShareArguments = {
  total: NumericValue;
  people?: { kind: "text"; value: string };
  baseShare?: NumericValue;
  baseCount?: { kind: "text"; value: string };
  extraShare?: NumericValue;
  extraCount?: { kind: "text"; value: string };
};

export type TipSplittingResult = {
  calculatorId: "tip-splitting";
  operation: "split";
  answer: { kind: "usd-money"; currency: "USD"; cents: string };
  subtotalCents: string;
  tipCents: string;
  totalCents: string;
  people: number;
  shares: readonly [TipShareClass, TipShareClass];
  working: readonly [
    WorkingStep<TipSplittingWorkingArguments>,
    WorkingStep<TipSplittingShareArguments>,
  ];
  visual: TipSplittingVisual;
};

export function calculate(
  input: TipSplittingInput,
): CalculationResult<TipSplittingResult, TipSplittingErrorCode> {
  const subtotal = parseUsdCents(input.subtotal);
  if (!subtotal.ok) {
    if (subtotal.error === "negative")
      return failed("negative-subtotal", "subtotal");
    if (subtotal.error === "fractional-cent")
      return failed("fractional-cent-subtotal", "subtotal");
    if (subtotal.error === "out-of-range")
      return failed("subtotal-out-of-range", "subtotal");
    return failed("invalid-subtotal", "subtotal");
  }

  const rate = parseCanonicalDecimal(input.tipRate);
  if (!rate.ok) return failed("invalid-rate", "tipRate");
  if ((rate.value.isNegative() && !rate.value.isZero()) || rate.value.gt(1000))
    return failed("rate-out-of-range", "tipRate");

  const people = boundedPeople(input.people);
  if (people === null) return failed("invalid-people", "people");

  const tipCents = roundCents(
    new DecimalValue(subtotal.cents.toString()).mul(rate.value).div(100),
  );
  if (tipCents === null) return failed("output-overflow");
  const totalCents = subtotal.cents + tipCents;
  if (totalCents > MAX_USD_CENTS) return failed("output-overflow");

  const peopleBigInt = BigInt(people);
  const baseShare = totalCents / peopleBigInt;
  const extraCount = Number(totalCents % peopleBigInt);
  const baseCount = people - extraCount;
  const shares: readonly [TipShareClass, TipShareClass] = [
    { shareCents: baseShare.toString(), count: baseCount },
    { shareCents: (baseShare + 1n).toString(), count: extraCount },
  ];
  const allocatedCents =
    baseShare * BigInt(baseCount) + (baseShare + 1n) * BigInt(extraCount);
  if (allocatedCents !== totalCents) return failed("output-overflow");

  const peopleText = { kind: "text" as const, value: String(people) };
  const total = decimalArgument(usdCentsToString(totalCents));
  const base = decimalArgument(usdCentsToString(baseShare));
  const working: TipSplittingResult["working"] = [
    {
      id: "tip-allocation",
      messageKey: "tip-splitting.working.summary",
      args: {
        subtotal: decimalArgument(usdCentsToString(subtotal.cents)),
        tipRate: decimalArgument(rate.canonical),
        people: peopleText,
        tip: decimalArgument(usdCentsToString(tipCents)),
        total,
      },
    },
    {
      id: "share-allocation",
      messageKey:
        people === 1
          ? "tip-splitting.working.single"
          : extraCount === 0
            ? "tip-splitting.working.even"
            : "tip-splitting.working.uneven",
      args:
        people === 1
          ? { total }
          : extraCount === 0
            ? { total, people: peopleText, baseShare: base }
            : {
                total,
                people: peopleText,
                baseShare: base,
                baseCount: { kind: "text", value: String(baseCount) },
                extraShare: decimalArgument(usdCentsToString(baseShare + 1n)),
                extraCount: { kind: "text", value: String(extraCount) },
              },
    },
  ];

  return {
    ok: true,
    result: {
      calculatorId: "tip-splitting",
      operation: "split",
      answer: {
        kind: "usd-money",
        currency: "USD",
        cents: totalCents.toString(),
      },
      subtotalCents: subtotal.cents.toString(),
      tipCents: tipCents.toString(),
      totalCents: totalCents.toString(),
      people,
      shares,
      working,
      visual: {
        kind: "tip-split-allocation",
        shares,
        totalCents: totalCents.toString(),
        descriptionKey: "tip-splitting.visual.description",
        alternativeKey: "tip-splitting.visual.alternative",
      },
    },
  };
}

function boundedPeople(text: string): number | null {
  if (!/^\d+$/.test(text) || text.length > 5) return null;
  const value = BigInt(text);
  if (value < 1n || value > 10_000n) return null;
  return Number(value);
}

function decimalArgument(value: string): NumericValue {
  return { kind: "decimal", value };
}

function failed(
  code: TipSplittingErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<TipSplittingErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
