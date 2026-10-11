import type { CalculationResult, OperationDescriptor } from "../contracts";
import { DecimalValue as D, parseCanonicalDecimal } from "../numeric/decimal";
import {
  type NumericError,
  type NumericResult,
  numericResult,
} from "../runtime/numeric-result";

export const errorCodes = [
  "invalid-field",
  "invalid-domain",
  "output-overflow",
] as const;
export type Input = { operation: string } & Record<string, string>;
const ID = "time-zone";

/** Whole-minute UTC offsets in use worldwide, from UTC−12:00 to UTC+14:00. */
const OFFSET_MINUTES = [
  -720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120,
  -60, 0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 525,
  540, 570, 600, 630, 660, 720, 765, 780, 840,
] as const;

/** Choice ID for an offset: "utc", "utc-minus-5", "utc-plus-5-30". */
export function offsetId(minutes: number): string {
  if (minutes === 0) return "utc";
  const hours = Math.floor(Math.abs(minutes) / 60),
    rest = Math.abs(minutes) % 60;
  return `utc-${minutes > 0 ? "plus" : "minus"}-${hours}${rest ? `-${String(rest).padStart(2, "0")}` : ""}`;
}

/** Signed offset minutes for a choice ID, or null when the ID is not an offset. */
export function offsetMinutes(id: string | undefined): number | null {
  if (id === "utc") return 0;
  const match = /^utc-(plus|minus)-(\d{1,2})(?:-(\d{2}))?$/.exec(id ?? "");
  if (!match) return null;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? "0");
  if (Number(match[3] ?? "0") > 59 || minutes === 0) return null;
  return match[1] === "minus" ? -minutes : minutes;
}

/** Minute of the day as a 24-hour "HH:MM" clock reading. */
export function clockText(minuteOfDay: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(minuteOfDay / 60))}:${pad(minuteOfDay % 60)}`;
}

const offsetChoices = OFFSET_MINUTES.map((minutes) => ({
  id: offsetId(minutes),
  labelKey: `time-zone.offset.${offsetId(minutes)}`,
}));

export const operationDescriptors = {
  "fixed-offset": {
    id: "fixed-offset",
    labelKey: "time-zone.operation.fixed-offset",
    fields: [
      {
        id: "hour",
        labelKey: "time-zone.field.hour",
        defaultValue: "17",
        input: "integer",
      },
      {
        id: "minute",
        labelKey: "time-zone.field.minute",
        defaultValue: "0",
        input: "integer",
      },
      {
        id: "sourceOffset",
        labelKey: "time-zone.field.sourceOffset",
        defaultValue: "utc-minus-5",
        input: "choice",
        choices: offsetChoices,
      },
      {
        id: "targetOffset",
        labelKey: "time-zone.field.targetOffset",
        defaultValue: "utc-plus-9",
        input: "choice",
        choices: offsetChoices,
      },
    ],
    working: [
      {
        messageKey: "time-zone.working.fixed-offset",
        arguments: {
          hour: "decimal",
          minute: "decimal",
          sourceOffset: "decimal",
          targetOffset: "decimal",
          total: "decimal",
          dayShift: "decimal",
          answer: "decimal",
          clock: "text",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
function fail(
  code: NumericError,
  field?: string,
): CalculationResult<NumericResult, NumericError> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const hour = parseCanonicalDecimal(input.hour ?? ""),
    minute = parseCanonicalDecimal(input.minute ?? "");
  if (!hour.ok) return fail("invalid-field", "hour");
  if (!minute.ok) return fail("invalid-field", "minute");
  const source = offsetMinutes(input.sourceOffset),
    target = offsetMinutes(input.targetOffset);
  if (source === null) return fail("invalid-field", "sourceOffset");
  if (target === null) return fail("invalid-field", "targetOffset");
  if (!hour.value.isInteger() || hour.value.lt(0) || hour.value.gt(23))
    return fail("invalid-domain", "hour");
  if (!minute.value.isInteger() || minute.value.lt(0) || minute.value.gt(59))
    return fail("invalid-domain", "minute");
  if (Math.abs(source) > 840 || Math.abs(target) > 840)
    return fail("invalid-domain");
  const sourceOffset = new D(source),
    targetOffset = new D(target);
  const total = hour.value
    .mul(60)
    .add(minute.value)
    .sub(sourceOffset)
    .add(targetOffset);
  const dayShift = total.div(1440).floor();
  const answer = total.sub(dayShift.mul(1440));
  const outcome = numericResult(ID, input.operation, answer, {
    hour: hour.value,
    minute: minute.value,
    sourceOffset,
    targetOffset,
    total,
    dayShift,
  });
  if (!outcome.ok) return outcome;
  return {
    ok: true,
    result: {
      ...outcome.result,
      working: outcome.result.working.map((step) => ({
        ...step,
        args: {
          ...step.args,
          clock: { kind: "text", value: clockText(answer.toNumber()) },
        },
      })),
    },
  };
}
