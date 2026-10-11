import type {
  CalculationResult,
  EngineFailure,
  NumericValue,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  type DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";

export type DiscountInputsByOperation = {
  "sale-price": { original: string; discount: string };
  "discount-percent": { original: string; sale: string };
};

export const operationDescriptors = {
  "sale-price": {
    id: "sale-price",
    labelKey: "discount.operation.salePrice",
    fields: [
      {
        id: "original",
        labelKey: "discount.field.original",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "120",
        input: "decimal",
      },
      {
        id: "discount",
        labelKey: "discount.field.discount",
        unitKey: "unit.percent",
        defaultValue: "25",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "discount.working.saved",
        arguments: { original: "decimal", rate: "decimal", saved: "decimal" },
      },
      {
        messageKey: "discount.working.sale",
        arguments: { original: "decimal", saved: "decimal", sale: "decimal" },
      },
    ],
  },
  "discount-percent": {
    id: "discount-percent",
    labelKey: "discount.operation.discountPercent",
    fields: [
      {
        id: "original",
        labelKey: "discount.field.original",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "120",
        input: "decimal",
      },
      {
        id: "sale",
        labelKey: "discount.field.sale",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "90",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "discount.working.savedAmount",
        arguments: { original: "decimal", sale: "decimal", saved: "decimal" },
      },
      {
        messageKey: "discount.working.percent",
        arguments: {
          saved: "decimal",
          original: "decimal",
          percent: "decimal",
        },
      },
    ],
  },
} satisfies { [Id in keyof DiscountInputsByOperation]: OperationDescriptor };
export const operations = Object.values(operationDescriptors);

export type DiscountInput = {
  [Id in keyof DiscountInputsByOperation]: {
    operation: Id;
  } & DiscountInputsByOperation[Id];
}[keyof DiscountInputsByOperation];

export const errorCodes = [
  "invalid-field",
  "zero-denominator",
  "output-overflow",
] as const;
export type DiscountErrorCode = (typeof errorCodes)[number];

/** Original price split into what is paid and what is saved, from one calculation. */
export type DiscountVisual = {
  kind: "discount-split";
  original: string;
  sale: string;
  saved: string;
  descriptionKey: "discount.visual.description";
  alternativeKey: "discount.visual.alternative";
};
export type DiscountWorkingArguments = Readonly<Record<string, NumericValue>>;
export type DiscountResult = {
  calculatorId: "discount";
  operation: DiscountInput["operation"];
  answer: NumericValue;
  saved: NumericValue;
  sale: NumericValue;
  working: readonly WorkingStep<DiscountWorkingArguments>[];
  visual: DiscountVisual;
};

type Dec = InstanceType<typeof DecimalValue>;

export function calculate(
  input: DiscountInput,
): CalculationResult<DiscountResult, DiscountErrorCode> {
  const original = parseCanonicalDecimal(input.original);
  if (!original.ok) return failed("invalid-field", "original");
  const secondField = input.operation === "sale-price" ? "discount" : "sale";
  const second = parseCanonicalDecimal(
    input.operation === "sale-price" ? input.discount : input.sale,
  );
  if (!second.ok) return failed("invalid-field", secondField);

  let saved: Dec;
  let sale: Dec;
  let answer: Dec;
  if (input.operation === "sale-price") {
    saved = original.value.mul(second.value).div(100);
    sale = original.value.sub(saved);
    answer = sale;
  } else {
    if (original.value.isZero()) return failed("zero-denominator", "original");
    sale = second.value;
    saved = original.value.sub(sale);
    answer = saved.div(original.value).mul(100);
  }

  const answerOut = decimalOutput(answer);
  const savedOut = decimalOutput(saved);
  const saleOut = decimalOutput(sale);
  if (answerOut === null || savedOut === null || saleOut === null)
    return failed("output-overflow");

  const dec = (value: string): NumericValue => ({ kind: "decimal", value });
  const working: WorkingStep<DiscountWorkingArguments>[] =
    input.operation === "sale-price"
      ? [
          {
            id: "saved",
            messageKey: "discount.working.saved",
            args: {
              original: dec(original.canonical),
              rate: dec(second.canonical),
              saved: dec(savedOut),
            },
          },
          {
            id: "sale",
            messageKey: "discount.working.sale",
            args: {
              original: dec(original.canonical),
              saved: dec(savedOut),
              sale: dec(saleOut),
            },
          },
        ]
      : [
          {
            id: "saved",
            messageKey: "discount.working.savedAmount",
            args: {
              original: dec(original.canonical),
              sale: dec(second.canonical),
              saved: dec(savedOut),
            },
          },
          {
            id: "percent",
            messageKey: "discount.working.percent",
            args: {
              saved: dec(savedOut),
              original: dec(original.canonical),
              percent: dec(answerOut),
            },
          },
        ];

  return {
    ok: true,
    result: {
      calculatorId: "discount",
      operation: input.operation,
      answer: dec(answerOut),
      saved: dec(savedOut),
      sale: dec(saleOut),
      working,
      visual: {
        kind: "discount-split",
        original: original.canonical,
        sale: saleOut,
        saved: savedOut,
        descriptionKey: "discount.visual.description",
        alternativeKey: "discount.visual.alternative",
      },
    },
  };
}

function failed(
  code: DiscountErrorCode,
  field?: string,
): { ok: false; error: EngineFailure<DiscountErrorCode> } {
  return {
    ok: false,
    error: { code, ...(field === undefined ? {} : { field }) },
  };
}
