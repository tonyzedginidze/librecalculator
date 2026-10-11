import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import { answerCopyText } from "../../copy";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter as unitAdapter } from "./adapter";

export const presentExample: ExamplePresenter = (
  example,
  locale,
  messages,
): ExamplePresentation => {
  const descriptor = unitAdapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) {
    return { ok: false, reason: "unsupported-operation" };
  }

  const calculation = unitAdapter.calculate(
    example.operation,
    example.inputs as Record<string, string>,
  );

  if (!calculation.ok) {
    return { ok: false, reason: "engine-failed" };
  }

  const result = calculation.result;
  const fields = descriptor.fields.map((f) => {
    const rawValue = example.inputs[f.id] ?? "";
    let formattedValue: string;
    if (f.input === "choice") {
      const choiceLabelKey = `unit-conversion.unit.${rawValue}`;
      formattedValue = messageText(messages, choiceLabelKey);
    } else {
      formattedValue = formatDecimal(rawValue, locale);
    }
    return {
      id: f.id,
      label: messageText(messages, f.labelKey),
      value: formattedValue,
    };
  });

  const answer = answerCopyText(example.operation, result.answer.value, locale);
  const working = result.working.map((step) =>
    renderWorkingStep(step, { locale, messages }),
  );

  return {
    ok: true,
    fields,
    answer,
    working,
  };
};
