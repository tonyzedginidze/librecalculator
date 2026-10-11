import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import { type DecimalValue, decimalOutput } from "../numeric/decimal";
import { parseUsdCents } from "../numeric/money";
export type Input = {
  operation: "return";
  investment: string;
  proceeds: string;
  fees: string;
};
export const operationDescriptors = {
  return: {
    id: "return",
    labelKey: "roi.operation.return",
    fields: [
      {
        id: "investment",
        labelKey: "roi.field.investment",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "10000",
        input: "decimal",
      },
      {
        id: "proceeds",
        labelKey: "roi.field.proceeds",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "12500",
        input: "decimal",
      },
      {
        id: "fees",
        labelKey: "roi.field.fees",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "150",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "roi.working.summary",
        arguments: {
          investment: "decimal",
          proceeds: "decimal",
          fees: "decimal",
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
  calculatorId: "roi";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "roi-comparison";
    answer: string;
    investment: string;
    /** Gross proceeds minus fees; negative when fees exceed proceeds. */
    netProceeds: string;
    /** Net proceeds minus investment; negative for a loss. */
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
  const investment = parseUsdCents(input.investment, { positive: true });
  if (!investment.ok) return failure("invalid-field", "investment");
  v.investment = investment.dollars;
  const proceeds = parseUsdCents(input.proceeds, { positive: false });
  if (!proceeds.ok) return failure("invalid-field", "proceeds");
  v.proceeds = proceeds.dollars;
  const fees = parseUsdCents(input.fees, { positive: false });
  if (!fees.ok) return failure("invalid-field", "fees");
  v.fees = fees.dollars;
  const net = v.proceeds.sub(v.fees);
  const gain = net.sub(v.investment);
  const answer = gain.div(v.investment).mul(100);
  const value = decimalOutput(answer);
  const invested = decimalOutput(v.investment);
  const netProceeds = decimalOutput(net);
  const profit = decimalOutput(gain);
  if (
    value === null ||
    invested === null ||
    netProceeds === null ||
    profit === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "roi",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "roi.working.summary",
          args: {
            investment: { kind: "decimal", value: v.investment.toFixed() },
            proceeds: { kind: "decimal", value: v.proceeds.toFixed() },
            fees: { kind: "decimal", value: v.fees.toFixed() },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "roi-comparison",
        answer: value,
        investment: invested,
        netProceeds,
        profit,
        descriptionKey: "roi.visual.description",
        alternativeKey: "roi.visual.alternative",
      },
    },
  };
}
