import { pointsOf } from "../../../../calculators/src/weighted-average";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { CompareBars, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 2;
const MAX_ROWS = 12;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, show, messages, locale }) => {
        const msg = (key: string) => messageText(messages, key);
        const points = pointsOf(result);
        const row = (key: string) =>
          result.visual.rows.find((r) => r.labelKey.endsWith(`.field.${key}`))
            ?.value ?? "0";
        const count = formatDecimal(String(points.length), locale);
        const shownCount = formatDecimal(
          String(Math.min(points.length, MAX_ROWS)),
          locale,
        );
        const answer = show(result.answer.value);
        return (
          <VizFigure
            caption={msg("weighted-average.visual.caption")}
            summary={fillMessage(msg("weighted-average.visual.summary"), {
              count,
              answer,
              weightedSum: formatDecimal(row("weightedSum"), locale),
              totalWeight: formatDecimal(row("totalWeight"), locale),
            })}
            note={
              points.length > MAX_ROWS
                ? fillMessage(msg("weighted-average.visual.more"), {
                    shown: shownCount,
                    count,
                  })
                : undefined
            }
          >
            <CompareBars
              rows={[
                ...points.slice(0, MAX_ROWS).map((p, i) => ({
                  label: fillMessage(msg("weighted-average.visual.row"), {
                    index: formatDecimal(String(i + 1), locale),
                  }),
                  value: Number(p.value),
                  display: show(p.value),
                  tone: "soft" as const,
                  note: fillMessage(msg("weighted-average.visual.row-note"), {
                    weight: formatDecimal(p.weight, locale),
                    percent: formatDecimal(p.percent, locale, {
                      fractionDigits: 1,
                    }),
                  }),
                })),
                {
                  label: msg("weighted-average.visual.mean"),
                  value: Number(result.answer.value),
                  display: answer,
                  tone: "accent" as const,
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
