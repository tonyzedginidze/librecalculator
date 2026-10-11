import { Timeline, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import {
  calendarMarkers,
  countKey,
  type DateTimeContext,
  DateTimeTopic,
  formatCivilDate,
} from "../date-time-topic";
import { adapter } from "./adapter";

export const dateDifferenceAnswer = ({ result, show, text }: DateTimeContext) =>
  text(
    countKey(
      result.answer.value,
      "date-difference.answer.one",
      "date-difference.answer.other",
    ),
    { days: show(result.answer.value) },
  );

export default function View(props: TopicViewProps) {
  return (
    <DateTimeTopic
      {...props}
      adapter={adapter}
      answer={dateDifferenceAnswer}
      visual={({ result, inputs, operationId, locale, show, text }) => {
        const start = inputs.start ?? "",
          end = inputs.end ?? "";
        const reversed = result.answer.value.startsWith("-");
        const [first, last] = reversed ? [end, start] : [start, end];
        const values = {
          start: formatCivilDate(start, locale),
          end: formatCivilDate(end, locale),
          days: show(result.answer.value),
        };
        const prefix = `date-difference.visual.${operationId}`;
        const span = reversed
          ? text("date-difference.visual.reversed", values)
          : text(`${prefix}.span`, values);
        return (
          <VizFigure
            caption={text(`${prefix}.caption`)}
            summary={text(`${prefix}.summary`, values)}
          >
            <Timeline
              start={{
                label: text(
                  reversed
                    ? "date-difference.visual.end"
                    : "date-difference.visual.start",
                ),
                display: formatCivilDate(first, locale),
              }}
              end={{
                label: text(
                  reversed
                    ? "date-difference.visual.start"
                    : "date-difference.visual.end",
                ),
                display: formatCivilDate(last, locale),
              }}
              span={span}
              markers={calendarMarkers(first, last, locale)}
            />
          </VizFigure>
        );
      }}
    />
  );
}
