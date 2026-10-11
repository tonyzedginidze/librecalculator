import type { NumericResult } from "../../../../calculators/src/runtime/numeric-result";
import type { DeviationResult } from "../../../../calculators/src/standard-deviation";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { DotPlot, niceScale } from "../math-everyday-viz";
import { adapter } from "./adapter";

const DIGITS = 2;

const isDeviation = (r: NumericResult): r is DeviationResult =>
  "points" in r.visual && "low" in r.visual;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, show, messages, locale }) => {
        if (!isDeviation(result)) return null;
        const v = result.visual;
        const text = (key: string) => messageText(messages, key);
        const points = v.points.map(Number);
        const scale = niceScale(
          [...points, Number(v.low), Number(v.high)],
          locale,
        );
        const vars = {
          count: formatDecimal(String(points.length), locale),
          min: formatDecimal(v.points[0] ?? "0", locale),
          max: formatDecimal(v.points.at(-1) ?? "0", locale),
          mean: show(v.mean),
          low: show(v.low),
          high: show(v.high),
          inside: formatDecimal(v.within, locale),
        };
        return (
          <VizFigure
            caption={text("standard-deviation.visual.caption")}
            summary={fillMessage(
              text("standard-deviation.visual.summary"),
              vars,
            )}
          >
            <DotPlot
              min={scale.min}
              max={scale.max}
              ticks={scale.ticks}
              points={points}
              markers={[
                {
                  value: Number(v.low),
                  label: text("standard-deviation.visual.low"),
                  display: vars.low,
                  emphasis: true,
                },
                {
                  value: Number(v.mean),
                  label: text("standard-deviation.visual.mean"),
                  display: vars.mean,
                },
                {
                  value: Number(v.high),
                  label: text("standard-deviation.visual.high"),
                  display: vars.high,
                  emphasis: true,
                },
              ]}
              band={{
                from: Number(v.low),
                to: Number(v.high),
                label: fillMessage(
                  text("standard-deviation.visual.band"),
                  vars,
                ),
              }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
