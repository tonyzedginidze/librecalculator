import { usdCentsToString } from "../../../../calculators/src/numeric/money";
import { formatDecimal } from "../../../../i18n/src/en";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { financeFormat, renderFinanceWorking } from "../finance-format";
import { adapter as loanAdapter, moneyArgs } from "./adapter";

export const presentExample: ExamplePresenter = (
  example,
  locale,
  messages,
): ExamplePresentation => {
  const descriptor = loanAdapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) {
    return { ok: false, reason: "unsupported-operation" };
  }

  const calculation = loanAdapter.calculate(
    example.operation,
    example.inputs as Record<string, string>,
  );

  if (!calculation.ok) {
    return { ok: false, reason: "engine-failed" };
  }

  const result = calculation.result;
  const format = financeFormat(messages, locale);
  const fields = descriptor.fields.map((f) => {
    const raw = example.inputs[f.id] ?? "";
    const value =
      f.input === "integer"
        ? raw
        : (moneyArgs as readonly string[]).includes(f.id)
          ? format.usd(raw)
          : formatDecimal(raw, locale);
    return {
      id: f.id,
      label: messageText(messages, f.labelKey),
      value,
    };
  });

  const answer = format.usd(usdCentsToString(BigInt(result.answer.cents)));
  const working = result.working.map((step) =>
    renderFinanceWorking(step, moneyArgs, messages, locale),
  );

  return {
    ok: true,
    fields,
    answer,
    working,
  };
};
