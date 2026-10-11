import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { type DecimalValue, decimalOutput } from "../numeric/decimal";
import { parseUsdCents } from "../numeric/money";
export type Input = {
  operation: "margin" | "markup";
  cost: string;
  price: string;
};
export const operationDescriptors = {
  margin: {
    id: "margin",
    labelKey: "margin-markup.operation.margin",
    fields: [
      {
        id: "cost",
        labelKey: "margin-markup.field.cost",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "45",
        input: "decimal",
      },
      {
        id: "price",
        labelKey: "margin-markup.field.price",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "75",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "margin-markup.working.summary",
        arguments: {
          cost: "decimal",
          price: "decimal",
          question: "message",
          answer: "decimal",
        },
      },
    ],
  },
  markup: {
    id: "markup",
    labelKey: "margin-markup.operation.markup",
    fields: [
      {
        id: "cost",
        labelKey: "margin-markup.field.cost",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "45",
        input: "decimal",
      },
      {
        id: "price",
        labelKey: "margin-markup.field.price",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "75",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "margin-markup.working.summary",
        arguments: {
          cost: "decimal",
          price: "decimal",
          question: "message",
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
  calculatorId: "margin-markup";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "price-split";
    answer: string;
    cost: string;
    price: string;
    /** Price minus cost; negative when selling below cost. */
    profit: string;
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
  const cost = parseUsdCents(input.cost, { positive: true });
  if (!cost.ok) return failure("invalid-field", "cost");
  v.cost = cost.dollars;
  const price = parseUsdCents(input.price, { positive: true });
  if (!price.ok) return failure("invalid-field", "price");
  v.price = price.dollars;
  const gain = v.price.sub(v.cost);
  const answer = gain
    .div(input.operation === "margin" ? v.price : v.cost)
    .mul(100);
  const value = decimalOutput(answer);
  const costOut = decimalOutput(v.cost);
  const priceOut = decimalOutput(v.price);
  const profit = decimalOutput(gain);
  if (
    value === null ||
    costOut === null ||
    priceOut === null ||
    profit === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "margin-markup",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "margin-markup.working.summary",
          args: {
            cost: { kind: "decimal", value: v.cost.toFixed() },
            price: { kind: "decimal", value: v.price.toFixed() },
            question: {
              kind: "message",
              key: `margin-markup.operation.${input.operation}`,
            },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "price-split",
        answer: value,
        cost: costOut,
        price: priceOut,
        profit,
        descriptionKey: "margin-markup.visual.description",
        alternativeKey: "margin-markup.visual.alternative",
      },
    },
  };
}
