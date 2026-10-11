import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import type { ExamplePresenter } from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter } from "./adapter";
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
    fields: descriptor.fields.map((field) => ({
      id: field.id,
      label: messageText(messages, field.labelKey),
      value:
        field.input === "choice"
          ? messageText(
              messages,
              `temperature.unit.${example.inputs[field.id]}`,
            )
          : formatDecimal(example.inputs[field.id] ?? "", locale),
    })),
    answer: `${formatDecimal(result.answer.value, locale)} ${messageText(messages, `temperature.symbol.${result.visual.target}`)}`,
    working: result.working.map((step) =>
      renderWorkingStep(step, { locale, messages }),
    ),
  };
};
