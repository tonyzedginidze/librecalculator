import type { AverageResult } from "../../../../calculators/src/average";
import type { NumericResult } from "../../../../calculators/src/runtime/numeric-result";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { type DotMarker, DotPlot, niceScale } from "../math-everyday-viz";
import { adapter } from "./adapter";

const DIGITS = 2;

const isAverage = (r: NumericResult): r is AverageResult =>
  "points" in r.visual && "median" in r.visual;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, operationId, show, messages, locale }) => {
        if (!isAverage(result)) return null;
        const v = result.visual;
        const text = (key: string) => messageText(messages, key);
        const points = v.points.map(Number);
        const scale = niceScale(points, locale);
        // One marker per distinct value; centres that coincide share a label.
        const centres = [
          { id: "mean", value: v.mean },
          { id: "median", value: v.median },
          ...(v.mode === null ? [] : [{ id: "mode", value: v.mode }]),
        ];
        const merged = new Map<string, DotMarker>();
        for (const c of centres) {
          const existing = merged.get(c.value);
          const label = text(`average.visual.${c.id}`);
          merged.set(c.value, {
            value: Number(c.value),
            label: existing
              ? fillMessage(text("average.visual.join"), {
                  first: existing.label,
                  second: label,
                })
              : label,
            display: show(c.value),
            emphasis: existing?.emphasis || c.id === operationId,
          });
        }
        const vars = {
          count: formatDecimal(String(points.length), locale),
          min: formatDecimal(v.points[0] ?? "0", locale),
          max: formatDecimal(v.points.at(-1) ?? "0", locale),
          mean: show(v.mean),
          median: show(v.median),
          modeText:
            v.mode === null
              ? ""
              : fillMessage(text("average.visual.summaryMode"), {
                  mode: show(v.mode),
                }),
        };
        return (
          <VizFigure
            caption={text("average.visual.caption")}
            summary={fillMessage(text("average.visual.summary"), vars)}
            note={v.mode === null ? text("average.visual.noMode") : undefined}
          >
            <DotPlot
              min={scale.min}
              max={scale.max}
              ticks={scale.ticks}
              points={points}
              markers={[...merged.values()]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
