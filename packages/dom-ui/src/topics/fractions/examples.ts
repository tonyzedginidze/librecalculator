import { renderWorkingStep } from "../../../../i18n/src/en";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { adapter as fractionsAdapter } from "./adapter";

export const presentExample: ExamplePresenter = (
  example,
  locale,
  messages,
): ExamplePresentation => {
  const descriptor = fractionsAdapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) {
    return { ok: false, reason: "unsupported-operation" };
  }

  const calculation = fractionsAdapter.calculate(
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
    value: example.inputs[f.id] ?? "",
  }));

  const answer = `${result.answer.numerator}/${result.answer.denominator}`;
  const working = result.working.map((step) =>
    renderWorkingStep(step as Parameters<typeof renderWorkingStep>[0], {
      locale,
      messages,
    }),
  );

  return {
    ok: true,
    fields,
    answer,
    working,
  };
};
