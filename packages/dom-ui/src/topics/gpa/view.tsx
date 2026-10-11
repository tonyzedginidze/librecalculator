import type { ReactNode } from "react";
import type { ErrorCode, Result } from "../../../../calculators/src/gpa";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  CompareBars,
  Equation,
  fillMessage,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** GPA and quality points both read naturally at two decimals. */
const DIGITS = 2;

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  const shown = (value: string) =>
    formatDecimal(value, locale, { fractionDigits: DIGITS });
  const answerText = (result: Result) =>
    `${shown(result.answer.value)} ${m(result.unitKey)}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="gpa"
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <p className="oc-answer-value">
            {e.status === "ok" ? (
              <NumText text={answerText(e.outcome.result)} />
            ) : (
              ui["ui.answer.empty"]
            )}
          </p>
          {e.status === "ok" &&
          isRoundedForDisplay(e.outcome.result.answer.value, DIGITS) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((step) => (
              <p key={step.id}>
                <NumText text={renderWorkingStep(step, { locale, messages })} />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const { operation, visual } = e.outcome.result;
        const d = visual.dimensions;
        const plain = (value: string | undefined) =>
          formatDecimal(value ?? "0", locale);
        const vars: Record<string, string> = { answer: shown(visual.answer) };
        for (const [key, value] of Object.entries(d)) vars[key] = plain(value);
        const figure = (body: ReactNode) => (
          <VizFigure
            caption={m(`gpa.visual.caption.${operation}`)}
            summary={fillMessage(m(`gpa.visual.summary.${operation}`), vars)}
          >
            {body}
          </VizFigure>
        );
        const credits = (value: string | undefined) =>
          fillMessage(m("gpa.visual.term"), { credits: plain(value) });
        if (operation === "gpa-combined")
          return figure(
            <CompareBars
              rows={[
                {
                  label: m("gpa.visual.previous"),
                  value: Number(d.previousGpa),
                  display: plain(d.previousGpa),
                  tone: "soft",
                  note: credits(d.previousCredits),
                },
                {
                  label: m("gpa.visual.new"),
                  value: Number(d.newGpa),
                  display: plain(d.newGpa),
                  tone: "soft",
                  note: credits(d.newCredits),
                },
                {
                  label: m("gpa.visual.combined"),
                  value: Number(visual.answer),
                  display: vars.answer ?? "",
                  tone: "accent",
                },
              ]}
            />,
          );
        if (operation === "gpa-target")
          return figure(
            <Equation
              items={[
                { label: m("gpa.visual.target"), display: plain(d.targetGpa) },
                { op: "×" },
                {
                  label: m("gpa.visual.credits"),
                  display: plain(d.totalCredits),
                },
                { op: "=" },
                {
                  label: m("gpa.visual.qp"),
                  display: vars.answer ?? "",
                  emphasis: true,
                },
              ]}
            />,
          );
        return figure(
          <Equation
            items={[
              { label: m("gpa.visual.qp"), display: plain(d.qualityPoints) },
              { op: "÷" },
              { label: m("gpa.visual.credits"), display: plain(d.credits) },
              { op: "=" },
              {
                label: m("gpa.visual.gpa"),
                display: vars.answer ?? "",
                emphasis: true,
              },
            ]}
          />,
        );
      }}
    />
  );
}
