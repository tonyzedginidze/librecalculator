import type { CSSProperties } from "react";
import { clockText, offsetId } from "../../../../calculators/src/time-zone";
import { DualScale, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import { type DateTimeContext, DateTimeTopic } from "../date-time-topic";
import { adapter } from "./adapter";

const DAY = 1440;
const TICK_MINUTES = [0, 360, 720, 1080];
/** Tick labels this close to either end would spill past the ruler. */
const inside = (t: { at: number }) => t.at > 0.06 && t.at < 0.94;

function readings({ result }: DateTimeContext) {
  const row = (key: string) =>
    Number(
      result.visual.rows.find((r) => r.labelKey === `time-zone.field.${key}`)
        ?.value ?? "0",
    );
  return {
    source: row("hour") * 60 + row("minute"),
    sourceOffset: row("sourceOffset"),
    targetOffset: row("targetOffset"),
    dayShift: row("dayShift"),
    target: Number(result.answer.value),
  };
}

const dayId = (shift: number) =>
  shift > 0 ? `plus-${shift}` : shift < 0 ? `minus-${-shift}` : "same";

export const timeZoneAnswer = (ctx: DateTimeContext) => {
  const r = readings(ctx);
  return ctx.text(`time-zone.answer.${dayId(r.dayShift)}`, {
    clock: clockText(r.target),
  });
};

export default function View(props: TopicViewProps) {
  return (
    <DateTimeTopic
      {...props}
      adapter={adapter}
      answer={timeZoneAnswer}
      visual={(ctx) => {
        const { text } = ctx;
        const r = readings(ctx);
        const zone = (minutes: number) =>
          text(`time-zone.offset.${offsetId(minutes)}`);
        const delta = r.targetOffset - r.sourceOffset;
        const values = {
          source: clockText(r.source),
          target: clockText(r.target),
          from: zone(r.sourceOffset),
          to: zone(r.targetOffset),
          day: text(`time-zone.day.${dayId(r.dayShift)}`),
        };
        return (
          <VizFigure
            caption={text("time-zone.visual.caption")}
            summary={text("time-zone.visual.summary", values)}
          >
            <div
              className="oc-dt-zone"
              style={{ "--oc-dt-f": r.source / DAY } as CSSProperties}
            >
              <DualScale
                fraction={r.source / DAY}
                top={{
                  unit: values.from,
                  display: values.source,
                  ticks: TICK_MINUTES.map((m) => ({
                    at: m / DAY,
                    label: clockText(m),
                  })).filter(inside),
                }}
                bottom={{
                  unit:
                    r.dayShift === 0
                      ? values.to
                      : text("time-zone.visual.zone-day", values),
                  display: values.target,
                  ticks: TICK_MINUTES.map((m) => ({
                    at: ((((m - delta) % DAY) + DAY) % DAY) / DAY,
                    label: clockText(m),
                  })).filter(inside),
                }}
              />
            </div>
          </VizFigure>
        );
      }}
    />
  );
}
