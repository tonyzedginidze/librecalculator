export type FieldDescriptor = {
  id: string;
  labelKey: string;
  unitKey?: string;
  defaultValue: string;
  input: "decimal" | "integer" | "choice" | "text";
  /** "nonnegative" hides the sign toggle; the engine still validates the domain. */
  sign?: "any" | "nonnegative";
  choices?: readonly { id: string; labelKey: string }[];
};
export type NumericValue = { kind: "decimal"; value: string };
export type WorkingArgument =
  | NumericValue
  | { kind: "text"; value: string }
  | {
      kind: "message";
      key: string;
      args?: Readonly<Record<string, WorkingArgument>>;
    }
  | { kind: "reference"; id: string };
export type WorkingArgumentKind = WorkingArgument["kind"];
export type WorkingTemplateDescriptor = {
  messageKey: string;
  arguments: Readonly<Record<string, WorkingArgumentKind>>;
};
export type OperationDescriptor = {
  id: string;
  labelKey: string;
  fields: readonly FieldDescriptor[];
  working: readonly WorkingTemplateDescriptor[];
};
export type EngineFailure<Code extends string> = {
  code: Code;
  field?: string;
};
export type WorkingStep<
  Args extends Readonly<Record<string, WorkingArgument>> = Readonly<
    Record<string, WorkingArgument>
  >,
> = {
  id: string;
  messageKey: string;
  args: Args;
};
export type CalculationResult<T, Code extends string = string> =
  | { ok: true; result: T }
  | { ok: false; error: EngineFailure<Code> };
