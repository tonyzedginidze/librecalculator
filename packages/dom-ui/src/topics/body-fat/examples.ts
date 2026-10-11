import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import type { ExamplePresenter } from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter } from "./adapter";
export const presentExample: ExamplePresenter = (example, locale, messages) => {
  const descriptor = adapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) return { ok: false, reason: "unsupported-operation" };
  const output = adapter.calculate(example.operation, { ...example.inputs });
  if (!output.ok) return { ok: false, reason: "engine-failed" };
  return {
    ok: true,
    fields: descriptor.fields.map((f) => ({
      id: f.id,
      label: messageText(messages, f.labelKey),
      value: formatDecimal(example.inputs[f.id] ?? "", locale),
    })),
    answer: `${formatDecimal(output.result.answer.value, locale, { fractionDigits: 1 })}${messageText(messages, "body-fat.answer.unit")}`,
    working: output.result.working.map((step) =>
      renderWorkingStep(step, { locale, messages }),
    ),
  };
};
