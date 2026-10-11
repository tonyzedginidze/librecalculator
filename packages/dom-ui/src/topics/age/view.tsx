import { birthdayOrdinal } from "../../../../calculators/src/age";
import { civilDate } from "../../../../calculators/src/runtime/civil-date";
import { formatDecimal } from "../../../../i18n/src/en";
import { Timeline, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import {
  countKey,
  type DateTimeContext,
  DateTimeTopic,
  formatCivilDate,
} from "../date-time-topic";
import { adapter } from "./adapter";

export const ageAnswer = ({ result, show, text }: DateTimeContext) =>
  text(countKey(result.answer.value, "age.answer.one", "age.answer.other"), {
    years: show(result.answer.value),
  });

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 250, 500, 1000];

function birthdayMarkers({ inputs, result, text, locale }: DateTimeContext) {
  const birth = civilDate(inputs.birth);
  const years = Number(result.answer.value);
  const days = Number(result.visual.rows[0]?.value ?? "0");
  if (!birth || years < 1 || days <= 0) return [];
  const step = STEPS.find((s) => years / s <= 4) ?? years;
  const markers = [];
  for (let n = step; n <= years; n += step) {
    const ordinal = birthdayOrdinal(birth, birth.year + n);
    if (ordinal === null) continue;
    const at = (ordinal - birth.ordinal) / days;
    if (at < 0.08 || at > 0.92) continue;
    markers.push({
      at,
      label: text("age.visual.marker", {
        years: formatDecimal(String(n), locale),
      }),
    });
  }
  return markers;
}

export default function View(props: TopicViewProps) {
  return (
    <DateTimeTopic
      {...props}
      adapter={adapter}
      answer={ageAnswer}
      visual={(ctx) => {
        const { result, inputs, locale, show, text } = ctx;
        const values = {
          birth: formatCivilDate(inputs.birth ?? "", locale),
          asof: formatCivilDate(inputs.asof ?? "", locale),
          years: show(result.answer.value),
          days: show(result.visual.rows[0]?.value ?? "0"),
        };
        return (
          <VizFigure
            caption={text("age.visual.caption")}
            summary={text("age.visual.summary", values)}
          >
            <Timeline
              start={{ label: text("age.visual.start"), display: values.birth }}
              end={{ label: text("age.visual.end"), display: values.asof }}
              span={text("age.visual.span", values)}
              markers={birthdayMarkers(ctx)}
            />
          </VizFigure>
        );
      }}
    />
  );
}
