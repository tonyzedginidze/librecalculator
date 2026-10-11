import type {
  DiscountErrorCode,
  DiscountResult,
} from "../../../../calculators/src/discount";
import {
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  CompareBars,
  fillMessage,
  SplitBar,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter as discountAdapter } from "./adapter";
import { money, PERCENT_DIGITS, percent } from "./format";

export type { TopicViewProps };

export default function DiscountTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator<DiscountResult, DiscountErrorCode>({
    adapter: discountAdapter,
    locale,
  });
  const text = (key: string) => messageText(messages, key);
  const answerText = (result: DiscountResult) =>
    result.operation === "discount-percent"
      ? percent(result.answer.value, locale, messages)
      : money(result.answer.value, locale, messages);
  const rounded = (result: DiscountResult) =>
    isRoundedForDisplay(
      result.answer.value,
      result.operation === "discount-percent" ? PERCENT_DIGITS : 2,
    );

  return (
    <CalculatorPanel<DiscountResult, DiscountErrorCode>
      title={title}
      description={description}
      topicId="discount"
      controller={controller}
      operations={discountAdapter.descriptors.map((d) => ({
        id: d.id,
        label: text(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <div className="oc-answer-scroll">
            <p className="oc-answer-value">
              {e.status === "ok" ? (
                <NumText text={answerText(e.outcome.result)} />
              ) : (
                ui["ui.answer.empty"]
              )}
            </p>
          </div>
          {e.status === "ok" && rounded(e.outcome.result) ? (
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
        const v = e.outcome.result.visual;
        const vars = {
          original: money(v.original, locale, messages),
          sale: money(v.sale, locale, messages),
          saved: money(v.saved, locale, messages),
          change: money(v.saved.replace(/^-/, ""), locale, messages),
        };
        const isSplit =
          !v.saved.startsWith("-") &&
          !v.sale.startsWith("-") &&
          Number(v.original) > 0;
        return isSplit ? (
          <VizFigure
            caption={text("discount.visual.caption")}
            summary={fillMessage(text("discount.visual.summary"), vars)}
          >
            <SplitBar
              total={{
                label: text("discount.visual.total"),
                display: vars.original,
              }}
              parts={[
                {
                  label: text("discount.visual.paid"),
                  value: Number(v.sale),
                  display: vars.sale,
                  tone: "accent",
                },
                {
                  label: text("discount.visual.savedPart"),
                  value: Number(v.saved),
                  display: vars.saved,
                  tone: "soft",
                },
              ]}
            />
          </VizFigure>
        ) : (
          <VizFigure
            caption={text("discount.visual.captionRise")}
            summary={fillMessage(text("discount.visual.summaryRise"), vars)}
          >
            <CompareBars
              rows={[
                {
                  label: text("discount.visual.original"),
                  value: Number(v.original),
                  display: vars.original,
                  tone: "soft",
                },
                {
                  label: text("discount.visual.new"),
                  value: Number(v.sale),
                  display: vars.sale,
                  tone: "accent",
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
