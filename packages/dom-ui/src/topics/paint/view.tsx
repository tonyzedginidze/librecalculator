import type { ErrorCode, Result } from "../../../../calculators/src/paint";
import { Equation, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import { ConstructionTopic } from "../construction-view";
import { adapter } from "./adapter";

const DIGITS = 2;

export default function View(props: TopicViewProps) {
  return (
    <ConstructionTopic<Result, ErrorCode>
      {...props}
      adapter={adapter}
      digits={DIGITS}
      unit={(_, msg) => msg("paint.answer.unit")}
      visual={({ result, show, msg }) => {
        const v = result.visual;
        const litres = msg("paint.answer.unit");
        const vars = {
          area: show(v.area),
          coats: show(v.coats, 0),
          painted: show(v.paintedArea),
          coverage: show(v.coverage),
          factor: show(v.factor, 4),
          waste: show(v.waste),
          reference: show(v.reference),
          answer: show(v.answer),
        };
        return (
          <VizFigure
            caption={msg("paint.visual.caption")}
            summary={msg("paint.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <Equation
              items={[
                {
                  label: msg("paint.visual.painted", vars),
                  display: msg("paint.visual.area-value", {
                    value: vars.painted,
                  }),
                },
                { op: "÷" },
                {
                  label: msg("paint.visual.coverage"),
                  display: msg("paint.visual.coverage-value", {
                    value: vars.coverage,
                  }),
                },
                { op: "×" },
                {
                  label: msg("paint.visual.factor", vars),
                  display: vars.factor,
                },
                { op: "=" },
                {
                  label: msg("paint.visual.result"),
                  display: `${vars.answer} ${litres}`,
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
