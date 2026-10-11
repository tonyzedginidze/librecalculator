import type {
  CalculationResult,
  FieldDescriptor,
} from "../../calculators/src/contracts";

export type EngineOutcome<R, Code extends string = string> = CalculationResult<
  R,
  Code
>;

export type FieldIssue = {
  fieldId: string;
  state: "incomplete" | "invalid";
  reason?: string;
};

export type Evaluation<R, Code extends string = string> =
  | { status: "incomplete"; issues: readonly FieldIssue[] }
  | { status: "invalid"; issues: readonly FieldIssue[] }
  | {
      status: "error";
      issues: readonly FieldIssue[];
      code: string;
      field?: string;
    }
  | {
      status: "ok";
      canonical: Record<string, string>;
      outcome: Extract<EngineOutcome<R, Code>, { ok: true }>;
    };

export function evaluateDrafts<R, Code extends string = string>(input: {
  operationId: string;
  fields: readonly FieldDescriptor[];
  drafts: Readonly<Record<string, string>>;
  locale: string;
  parseField: (
    raw: string,
    locale: string,
    field: FieldDescriptor,
  ) =>
    | { state: "valid"; canonical: string }
    | { state: "incomplete" }
    | { state: "invalid"; reason: string };
  calculate: (fields: Record<string, string>) => EngineOutcome<R, Code>;
}): Evaluation<R, Code> {
  const issues: FieldIssue[] = [];
  const canonical: Record<string, string> = {};
  for (const field of input.fields) {
    const raw = input.drafts[field.id] ?? "";
    const parsed = input.parseField(raw, input.locale, field);
    if (parsed.state === "incomplete") {
      issues.push({ fieldId: field.id, state: "incomplete" });
    } else if (parsed.state === "invalid") {
      issues.push({
        fieldId: field.id,
        state: "invalid",
        reason: parsed.reason,
      });
    } else {
      canonical[field.id] = parsed.canonical;
    }
  }
  if (issues.some((issue) => issue.state === "invalid")) {
    return { status: "invalid", issues };
  }
  if (issues.length > 0) return { status: "incomplete", issues };
  const outcome = input.calculate(canonical);
  if (!outcome.ok) {
    return {
      status: "error",
      issues: outcome.error.field
        ? [{ fieldId: outcome.error.field, state: "invalid" }]
        : [],
      code: outcome.error.code,
      ...(outcome.error.field === undefined
        ? {}
        : { field: outcome.error.field }),
    };
  }
  return { status: "ok", canonical, outcome };
}
