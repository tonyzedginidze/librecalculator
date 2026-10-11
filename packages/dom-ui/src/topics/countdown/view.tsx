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

const distance = (value: string) => value.replace(/^-/, "");

export const countdownAnswer = ({ result, show, text }: DateTimeContext) => {
  const value = result.answer.value;
  if (value === "0") return text("countdown.answer.today");
  const past = value.startsWith("-");
  return text(
    countKey(
      value,
      past ? "countdown.answer.past-one" : "countdown.answer.one",
      past ? "countdown.answer.past" : "countdown.answer.other",
    ),
    { days: show(distance(value)) },
  );
};

export default function View(props: TopicViewProps) {
  return (
    <DateTimeTopic
      {...props}
      adapter={adapter}
      answer={countdownAnswer}
      visual={({ result, inputs, locale, show, text }) => {
        const reference = inputs.reference ?? "",
          target = inputs.target ?? "";
        const value = result.answer.value;
        const past = value.startsWith("-");
        const [weeks = "0", remainder = "0"] = result.visual.rows.map(
          (r) => r.value,
        );
        const values = {
          reference: formatCivilDate(reference, locale),
          target: formatCivilDate(target, locale),
          days: show(distance(value)),
          weeks: show(weeks),
          remainder: show(remainder),
        };
        const weeksText = text(
          countKey(
            weeks,
            "countdown.visual.weeks.one",
            "countdown.visual.weeks.other",
          ),
          values,
        );
        const daysText = text(
          countKey(
            remainder,
            "countdown.visual.days.one",
            "countdown.visual.days.other",
          ),
          values,
        );
        const span =
          weeks === "0"
            ? daysText
            : remainder === "0"
              ? weeksText
              : text("countdown.visual.span", { weeksText, daysText });
        const from = {
          label: text("countdown.visual.reference"),
          display: values.reference,
        };
        const to = {
          label: text("countdown.visual.target"),
          display: values.target,
        };
        return (
          <VizFigure
            caption={text(
              past
                ? "countdown.visual.caption-past"
                : "countdown.visual.caption",
            )}
            summary={text(
              past
                ? "countdown.visual.summary-past"
                : "countdown.visual.summary",
              { ...values, span },
            )}
          >
            <Timeline
              start={past ? to : from}
              end={past ? from : to}
              span={span}
              markers={
                past
                  ? calendarMarkers(target, reference, locale)
                  : calendarMarkers(reference, target, locale)
              }
            />
          </VizFigure>
        );
      }}
    />
  );
}
