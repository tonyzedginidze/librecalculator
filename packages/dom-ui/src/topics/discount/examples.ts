import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter as discountAdapter } from "./adapter";
import { money, percent } from "./format";

export const presentExample: ExamplePresenter = (
  example,
  locale,
  messages,
): ExamplePresentation => {
  const descriptor = discountAdapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) {
    return { ok: false, reason: "unsupported-operation" };
  }

  const calculation = discountAdapter.calculate(
    example.operation,
    example.inputs as Record<string, string>,
  );

  if (!calculation.ok) {
    return { ok: false, reason: "engine-failed" };
  }

  const result = calculation.result;
  const fields = descriptor.fields.map((f) => ({
    id: f.id,
    label: messageText(messages, f.labelKey),
    value: formatDecimal(example.inputs[f.id] ?? "", locale),
  }));

  const answer =
    example.operation === "discount-percent"
      ? percent(result.answer.value, locale, messages)
      : money(result.answer.value, locale, messages);
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
