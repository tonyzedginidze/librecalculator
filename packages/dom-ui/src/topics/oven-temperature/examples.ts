import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import type { ExamplePresenter } from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter } from "./adapter";
import { answerText } from "./format";

export const presentExample: ExamplePresenter = (example, locale, messages) => {
  const descriptor = adapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) return { ok: false, reason: "unsupported-operation" };
  const calculation = adapter.calculate(example.operation, {
    ...example.inputs,
  });
  if (!calculation.ok) return { ok: false, reason: "engine-failed" };
  const result = calculation.result;
  return {
    ok: true,
    fields: descriptor.fields.map((f) => ({
      id: f.id,
      label: messageText(messages, f.labelKey),
      value: formatDecimal(example.inputs[f.id] ?? "", locale),
    })),
    answer: answerText(result, locale, messages),
    working: result.working.map((step) =>
      renderWorkingStep(step, { locale, messages }),
    ),
  };
};
