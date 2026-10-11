import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import { measureDigits } from "../../components/measure";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter as pythagoreanAdapter } from "./adapter";

export const presentExample: ExamplePresenter = (
  example,
  locale,
  messages,
): ExamplePresentation => {
  const descriptor = pythagoreanAdapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) {
    return { ok: false, reason: "unsupported-operation" };
  }

  const calculation = pythagoreanAdapter.calculate(
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

  const answer = `${formatDecimal(result.answer.value, locale, { fractionDigits: measureDigits(result.answer.value) })} ${messageText(messages, "pythagorean.symbol.metre")}`;
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
