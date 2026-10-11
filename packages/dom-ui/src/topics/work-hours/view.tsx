import { formatDecimal } from "../../../../i18n/src/en";
import { SplitBar, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import {
  countKey,
  type DateTimeContext,
  DateTimeTopic,
} from "../date-time-topic";
import { adapter } from "./adapter";

const DIGITS = 2;

export const workHoursAnswer = ({ result, show, text }: DateTimeContext) =>
  text(
    countKey(
      result.answer.value,
      "work-hours.answer.one",
      "work-hours.answer.other",
    ),
    { hours: show(result.answer.value) },
  );

/** Whole minutes as "8 h 30 min", "8 h" or "30 min". */
function duration(
  minutes: string,
  { locale, text }: Pick<DateTimeContext, "locale" | "text">,
) {
  const total = Number(minutes);
  const values = {
    hours: formatDecimal(String(Math.floor(total / 60)), locale),
    minutes: formatDecimal(String(total % 60), locale),
  };
  if (total % 60 === 0) return text("work-hours.visual.hours", values);
  if (total < 60) return text("work-hours.visual.minutes", values);
  return text("work-hours.visual.hours-minutes", values);
}

export default function View(props: TopicViewProps) {
  return (
    <DateTimeTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      answer={workHoursAnswer}
      visual={(ctx) => {
        const { result, inputs, text } = ctx;
        const [elapsed = "0", pause = "0", paid = "0"] = result.visual.rows.map(
          (r) => r.value,
        );
        const values = {
          start: inputs.start ?? "",
          end: inputs.end ?? "",
          shift: duration(elapsed, ctx),
          paid: duration(paid, ctx),
          break: duration(pause, ctx),
        };
        return (
          <VizFigure
            caption={text("work-hours.visual.caption")}
            summary={text("work-hours.visual.summary", values)}
          >
            <SplitBar
              total={{
                label: text("work-hours.visual.total", values),
                display: values.shift,
              }}
              parts={[
                {
                  label: text("work-hours.visual.paid"),
                  value: Number(paid),
                  display: values.paid,
                  tone: "accent",
                },
                {
                  label: text("work-hours.visual.break"),
                  value: Number(pause),
                  display: values.break,
                  tone: "muted",
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
