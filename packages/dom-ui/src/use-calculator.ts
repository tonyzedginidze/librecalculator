import { useMemo, useState } from "react";
import type { OperationDescriptor } from "../../calculators/src/contracts";
import { canonicalToDraft, toggleSign } from "./draft";
import { type Evaluation, evaluateDrafts } from "./evaluate";
import type { TopicAdapter } from "./topic";

export type CalculatorController<R, Code extends string = string> = {
  operationId: string;
  setOperation: (id: string) => void;
  descriptor: OperationDescriptor;
  drafts: Record<string, string>;
  setDraft: (fieldId: string, value: string) => void;
  toggleFieldSign: (fieldId: string) => void;
  evaluation: Evaluation<R, Code>;
};

export function useCalculator<R, Code extends string = string>(options: {
  adapter: TopicAdapter<R, Code>;
  locale: string;
}): CalculatorController<R, Code> {
  const { adapter, locale } = options;
  const first = adapter.descriptors[0];
  if (!first) throw new Error(`Calculator ${adapter.id} has no operations`);

  const [operationId, setOperationId] = useState(first.id);
  const [draftsByOperation, setDraftsByOperation] = useState(() =>
    initialDrafts(adapter.descriptors, locale),
  );

  const descriptor =
    adapter.descriptors.find((item) => item.id === operationId) ?? first;
  const drafts = draftsByOperation[descriptor.id] ?? {};

  const evaluation = useMemo(
    () =>
      evaluateDrafts({
        operationId: descriptor.id,
        fields: descriptor.fields,
        drafts,
        locale,
        parseField: (raw, loc, field) => adapter.parseField(raw, loc, field),
        calculate: (canonicalFields) =>
          adapter.calculate(descriptor.id, canonicalFields),
      }),
    [adapter, descriptor, drafts, locale],
  );

  return {
    operationId: descriptor.id,
    setOperation: (id) => {
      if (adapter.descriptors.some((item) => item.id === id)) {
        setOperationId(id);
      }
    },
    descriptor,
    drafts,
    setDraft: (fieldId, value) => {
      setDraftsByOperation((current) => ({
        ...current,
        [descriptor.id]: {
          ...(current[descriptor.id] ?? {}),
          [fieldId]: value,
        },
      }));
    },
    toggleFieldSign: (fieldId) => {
      const fieldDesc = descriptor.fields.find((f) => f.id === fieldId);
      if (fieldDesc?.input === "choice" || fieldDesc?.input === "text") return;
      setDraftsByOperation((current) => {
        const operationDrafts = current[descriptor.id] ?? {};
        return {
          ...current,
          [descriptor.id]: {
            ...operationDrafts,
            [fieldId]: toggleSign(operationDrafts[fieldId] ?? ""),
          },
        };
      });
    },
    evaluation,
  };
}

function initialDrafts(
  descriptors: readonly OperationDescriptor[],
  locale: string,
): Record<string, Record<string, string>> {
  return Object.fromEntries(
    descriptors.map((descriptor) => [
      descriptor.id,
      Object.fromEntries(
        descriptor.fields.map((field) => [
          field.id,
          field.input === "choice" || field.input === "text"
            ? field.defaultValue
            : canonicalToDraft(field.defaultValue, locale),
        ]),
      ),
    ]),
  );
}
