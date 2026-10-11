import "../../../../design/src/finance.css";
import type {
  TipSplittingErrorCode,
  TipSplittingResult,
} from "../../../../calculators/src/tip-splitting/index";
import { formatDecimal, renderWorkingStep } from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  Equation,
  fillMessage,
  SplitBar,
  StatGrid,
  VizFigure,
} from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { formatUsdCents, withUsdArguments } from "../core-money";
import { adapter as tipAdapter } from "./adapter";

export type { TopicViewProps };

const tipPresets = ["15", "18", "20", "25"];
const tipMoneyArguments = [
  "subtotal",
  "tip",
  "total",
  "baseShare",
  "extraShare",
];

export default function TipSplittingTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<TipSplittingResult, TipSplittingErrorCode>({
    adapter: tipAdapter,
    locale,
  });

  const operations = tipAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));

  const currentTipRate = controller.drafts.tipRate ?? "";
  const money = (cents: string) => formatUsdCents(cents, locale);
  const perPerson = (res: TipSplittingResult) => res.shares[0].shareCents;

  return (
    <CalculatorPanel<TipSplittingResult, TipSplittingErrorCode>
      title={title}
      description={description}
      topicId="tip-splitting"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok"
          ? money(perPerson(evaluation.outcome.result))
          : ""
      }
      extra={
        <div className="oc-finance-extra">
          <fieldset className="oc-finance-presets">
            <legend className="oc-quiet">
              {messageText(messages, "tip-splitting.ui.presets")}
            </legend>
            {tipPresets.map((rate) => (
              <button
                key={rate}
                type="button"
                className="oc-finance-chip"
                data-active={currentTipRate === rate}
                aria-pressed={currentTipRate === rate}
                onClick={() => controller.setDraft("tipRate", rate)}
              >
                {`${formatDecimal(rate, locale)}%`}
              </button>
            ))}
          </fieldset>
        </div>
      }
      renderAnswer={(
        evaluation: Evaluation<TipSplittingResult, TipSplittingErrorCode>,
      ) => {
        if (evaluation.status !== "ok") {
          return (
            <div className="oc-answer" aria-live="polite">
              <p className="oc-kicker">
                {messageText(messages, "tip-splitting.ui.per-person")}
              </p>
              <p className="oc-answer-value">
                <span className="oc-answer-empty">{ui["ui.answer.empty"]}</span>
              </p>
            </div>
          );
        }
        const res = evaluation.outcome.result;
        const [, extra] = res.shares;
        const vars = {
          extraShare: money(extra.shareCents),
          extraCount: String(extra.count),
          total: money(res.totalCents),
        };
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">
              {messageText(messages, "tip-splitting.ui.per-person")}
            </p>
            <p className="oc-answer-value">
              <NumText text={money(perPerson(res))} />
            </p>
            {extra.count > 0 ? (
              <p>
                {fillMessage(
                  messageText(
                    messages,
                    extra.count === 1
                      ? "tip-splitting.ui.leftover-one"
                      : "tip-splitting.ui.leftover-many",
                  ),
                  vars,
                )}
              </p>
            ) : null}
            <StatGrid
              items={[
                {
                  label: messageText(messages, "tip-splitting.ui.tip-amount"),
                  display: money(res.tipCents),
                },
                {
                  label: messageText(messages, "tip-splitting.ui.total-bill"),
                  display: money(res.totalCents),
                },
              ]}
            />
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<TipSplittingResult, TipSplittingErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        return (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {evaluation.outcome.result.working.map((step) => (
              <p key={step.id}>
                <NumText
                  text={renderWorkingStep(
                    withUsdArguments(step, tipMoneyArguments, locale),
                    { locale, messages },
                  )}
                />
              </p>
            ))}
          </div>
        );
      }}
      renderVisual={(
        evaluation: Evaluation<TipSplittingResult, TipSplittingErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        const res = evaluation.outcome.result;
        const vars = {
          total: money(res.totalCents),
          subtotal: money(res.subtotalCents),
          tip: money(res.tipCents),
          people: formatDecimal(String(res.people), locale),
          share: money(perPerson(res)),
        };
        return (
          <VizFigure
            caption={messageText(messages, "tip-splitting.visual.caption")}
            summary={fillMessage(
              messageText(messages, "tip-splitting.visual.summary"),
              vars,
            )}
          >
            <SplitBar
              total={{
                label: messageText(messages, "tip-splitting.ui.total-bill"),
                display: vars.total,
              }}
              parts={[
                {
                  label: messageText(messages, "tip-splitting.ui.bill"),
                  value: Number(res.subtotalCents),
                  display: vars.subtotal,
                  tone: "soft",
                },
                {
                  label: messageText(messages, "tip-splitting.ui.tip-amount"),
                  value: Number(res.tipCents),
                  display: vars.tip,
                  tone: "accent",
                },
              ]}
            />
            <Equation
              items={[
                {
                  label: messageText(messages, "tip-splitting.ui.total-bill"),
                  display: vars.total,
                },
                { op: "÷" },
                {
                  label: messageText(messages, "tip-splitting.ui.people"),
                  display: vars.people,
                },
                { op: "=" },
                {
                  label: messageText(messages, "tip-splitting.ui.each"),
                  display: vars.share,
                  emphasis: true,
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
