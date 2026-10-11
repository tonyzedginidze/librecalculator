import type { ReactNode } from "react";
import type { ErrorCode, Result } from "../../../../calculators/src/grade";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  Equation,
  fillMessage,
  SplitBar,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** Percent scores read at one decimal; points and percentage points at two. */
const digitsFor = (operation: string) =>
  operation === "grade-percent" ? 1 : 2;

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  const shown = (result: Result, value: string) =>
    formatDecimal(value, locale, {
      fractionDigits: digitsFor(result.operation),
    });
  const withUnit = (value: string, unit: string) =>
    unit === "%" ? `${value}%` : `${value} ${unit}`;
  const answerText = (result: Result) =>
    withUnit(shown(result, result.answer.value), m(result.unitKey));
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="grade"
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
          isRoundedForDisplay(
            e.outcome.result.answer.value,
            digitsFor(e.outcome.result.operation),
          ) ? (
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
        const result = e.outcome.result;
        const { operation, visual } = result;
        const d = visual.dimensions;
        const plain = (value: string | undefined) =>
          formatDecimal(value ?? "0", locale, { fractionDigits: 2 });
        const answer = shown(result, visual.answer);
        const vars: Record<string, string> = {
          answer,
          remainder: plain(visual.parts.remainder),
          outside: plain(visual.parts.outside),
        };
        for (const [key, value] of Object.entries(d)) vars[key] = plain(value);
        const pct = (value: string | undefined) =>
          withUnit(value ?? "", m("grade.answer.percent"));
        const extra =
          Number(visual.parts.remainder) < 0 ||
          Number(visual.parts.outside ?? "0") < 0;
        const figure = (key: string, body: ReactNode) => (
          <VizFigure
            caption={m(`grade.visual.caption.${key}`)}
            summary={fillMessage(m(`grade.visual.summary.${key}`), {
              ...vars,
              answer: withUnit(answer, m(visual.unitKey)),
            })}
          >
            {body}
          </VizFigure>
        );
        if (extra) {
          const [a, op, b] =
            operation === "grade-percent"
              ? ([
                  { label: m("grade.field.earned"), display: vars.earned },
                  "÷",
                  { label: m("grade.field.possible"), display: vars.possible },
                ] as const)
              : operation === "grade-contribution"
                ? ([
                    {
                      label: m("grade.visual.score"),
                      display: pct(vars.percentage),
                    },
                    "×",
                    {
                      label: m("grade.visual.weight"),
                      display: pct(vars.weight),
                    },
                  ] as const)
                : ([
                    {
                      label: m("grade.field.target"),
                      display: pct(vars.target),
                    },
                    "×",
                    {
                      label: m("grade.field.possible"),
                      display: vars.possible,
                    },
                  ] as const);
          return figure(
            "extra",
            <Equation
              items={[
                { label: a.label, display: a.display ?? "" },
                { op },
                { label: b.label, display: b.display ?? "" },
                { op: "=" },
                {
                  label: m("grade.visual.result"),
                  display: withUnit(answer, m(visual.unitKey)),
                  emphasis: true,
                },
              ]}
            />,
          );
        }
        if (operation === "grade-contribution")
          return figure(
            operation,
            <SplitBar
              total={{
                label: m("grade.visual.total.course"),
                display: formatDecimal("100", locale),
              }}
              parts={[
                {
                  label: m("grade.visual.added"),
                  value: Number(visual.answer),
                  display: answer,
                  tone: "accent",
                },
                {
                  label: m("grade.visual.lost"),
                  value: Number(visual.parts.remainder),
                  display: vars.remainder ?? "",
                  tone: "soft",
                },
                {
                  label: m("grade.visual.outside"),
                  value: Number(visual.parts.outside),
                  display: vars.outside ?? "",
                  tone: "muted",
                },
              ]}
            />,
          );
        const percent = operation === "grade-percent";
        return figure(
          operation,
          <SplitBar
            total={{
              label: m("grade.visual.total.points"),
              display: vars.possible ?? "",
            }}
            parts={[
              {
                label: m(
                  percent ? "grade.visual.earned" : "grade.visual.needed",
                ),
                value: Number(percent ? d.earned : visual.answer),
                display: percent ? (vars.earned ?? "") : answer,
                tone: "accent",
              },
              {
                label: m(percent ? "grade.visual.missed" : "grade.visual.room"),
                value: Number(visual.parts.remainder),
                display: vars.remainder ?? "",
                tone: "soft",
              },
            ]}
          />,
        );
      }}
    />
  );
}
