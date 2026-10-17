import { formatDecimal } from "../../../../i18n/src/en";
import { fillMessage } from "../../components/viz";
import type { ExamplePresenter } from "../../example-presentation";
import { messageText } from "../../lesson-text";
import { financeFormat, renderFinanceWorking } from "../finance-format";
import { adapter, moneyArgs, rowsOf } from "./adapter";
import { answerText } from "./format";

/** Lesson examples: attendee groups and the frequency read as the page shows them. */
export const presentExample: ExamplePresenter = (example, locale, messages) => {
  const descriptor = adapter.descriptors.find(
    (d) => d.id === example.operation,
  );
  if (!descriptor) return { ok: false, reason: "unsupported-operation" };
  const output = adapter.calculate(example.operation, { ...example.inputs });
  if (!output.ok) return { ok: false, reason: "engine-failed" };
  const f = financeFormat(messages, locale);
  const m = (key: string) => messageText(messages, key);
  const value = (id: string, raw: string) => {
    if (id === "attendees")
      return rowsOf(raw)
        .map((r) =>
          fillMessage(m("meeting-cost.visual.group"), {
            people: formatDecimal(r.people, locale),
            salary: f.usd(r.salary),
          }),
        )
        .join("; ");
    if (id === "frequency") return m(`meeting-cost.frequency.${raw}`);
    if (id === "budget") return f.usd(raw);
    if (id === "minutes" || id === "refocus")
      return fillMessage(m("meeting-cost.ui.preset"), {
        minutes: formatDecimal(raw, locale),
      });
    return formatDecimal(raw, locale);
  };
  return {
    ok: true,
    fields: descriptor.fields.map((field) => ({
      id: field.id,
      label: m(field.labelKey),
      value: value(field.id, example.inputs[field.id] ?? ""),
    })),
    answer: answerText(output.result, messages, locale),
    working: output.result.working.map((step) =>
      renderFinanceWorking(step, moneyArgs, messages, locale),
    ),
  };
};
