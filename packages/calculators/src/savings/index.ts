import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
import {
  parseUsdCents,
  roundUsdToCents,
  usdCentsToString,
} from "../numeric/money";
export type Input = {
  operation: "save";
  principal: string;
  deposit: string;
  annualRate: string;
  months: string;
};
export const operationDescriptors = {
  save: {
    id: "save",
    labelKey: "savings.operation.save",
    fields: [
      {
        id: "principal",
        labelKey: "savings.field.principal",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "5000",
        input: "decimal",
      },
      {
        id: "deposit",
        labelKey: "savings.field.deposit",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "250",
        input: "decimal",
      },
      {
        id: "annualRate",
        labelKey: "savings.field.annualRate",
        unitKey: "unit.percent",
        sign: "nonnegative",
        defaultValue: "4",
        input: "decimal",
      },
      {
        id: "months",
        labelKey: "savings.field.months",
        unitKey: "savings.unit.months",
        defaultValue: "120",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "savings.working.summary",
        arguments: {
          principal: "decimal",
          deposit: "decimal",
          annualRate: "decimal",
          months: "decimal",
          answer: "decimal",
          reference: "decimal",
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
  calculatorId: "savings";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "savings-split";
    answer: string;
    /** Starting balance plus every deposit, before interest. */
    reference: string;
    starting: string;
    deposits: string;
    /** Settled final balance minus starting balance and deposits. */
    interest: string;
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
  const principal = parseUsdCents(input.principal, { positive: false });
  if (!principal.ok) return failure("invalid-field", "principal");
  v.principal = principal.dollars;
  const deposit = parseUsdCents(input.deposit, { positive: false });
  if (!deposit.ok) return failure("invalid-field", "deposit");
  v.deposit = deposit.dollars;
  const annualRate = parseCanonicalDecimal(input.annualRate);
  if (!annualRate.ok) return failure("invalid-field", "annualRate");
  if (annualRate.value.lt(0) || annualRate.value.gt(100))
    return failure("out-of-range", "annualRate");
  v.annualRate = annualRate.value;
  const months = parseCanonicalDecimal(input.months);
  if (!months.ok) return failure("invalid-field", "months");
  if (
    months.value.lt(1) ||
    months.value.gt(1200) ||
    !/^\d+$/.test(input.months)
  )
    return failure("out-of-range", "months");
  v.months = months.value;
  let answer: InstanceType<typeof DecimalValue>;
  const q = new DecimalValue(1).add(v.annualRate.div(1200));
  let balance = v.principal;
  for (let month = 0; month < Number(v.months.toFixed()); month++)
    balance = balance.mul(q).add(v.deposit);
  answer = balance;
  const deposits = v.deposit.mul(v.months);
  const reference = v.principal.add(deposits);
  const cents = roundUsdToCents(answer);
  if (cents === null) return failure("output-overflow");
  answer = new DecimalValue(usdCentsToString(cents));
  const value = decimalOutput(answer);
  const ref = decimalOutput(reference);
  const starting = decimalOutput(v.principal);
  const deposited = decimalOutput(deposits);
  const interest = decimalOutput(answer.sub(reference));
  if (
    value === null ||
    ref === null ||
    starting === null ||
    deposited === null ||
    interest === null
  )
    return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "savings",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "savings.working.summary",
          args: {
            principal: { kind: "decimal", value: v.principal.toFixed() },
            deposit: { kind: "decimal", value: v.deposit.toFixed() },
            annualRate: { kind: "decimal", value: v.annualRate.toFixed() },
            months: { kind: "decimal", value: v.months.toFixed() },
            answer: { kind: "decimal", value },
            reference: { kind: "decimal", value: ref },
          },
        },
      ],
      visual: {
        kind: "savings-split",
        answer: value,
        reference: ref,
        starting,
        deposits: deposited,
        interest,
        descriptionKey: "savings.visual.description",
        alternativeKey: "savings.visual.alternative",
      },
    },
  };
}
