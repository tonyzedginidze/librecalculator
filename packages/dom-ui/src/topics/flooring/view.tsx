import type { ErrorCode, Result } from "../../../../calculators/src/flooring";
import { plural } from "../../../../i18n/src/en";
import { VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import { ConstructionTopic, PurchaseCount } from "../construction-view";
import { adapter } from "./adapter";

const DIGITS = 0;

export default function View(props: TopicViewProps) {
  const unit = (value: string, msg: (key: string) => string) =>
    plural(props.locale, Number(value), {
      one: msg("flooring.answer.one"),
      other: msg("flooring.answer.other"),
    });
  return (
    <ConstructionTopic<Result, ErrorCode>
      {...props}
      adapter={adapter}
      digits={DIGITS}
      unit={unit}
      visual={({ result, show, msg }) => {
        const v = result.visual;
        const vars = {
          answer: show(v.answer),
          exact: show(v.exactPacks, 2),
          reference: show(v.reference, 2),
          waste: show(v.waste, 2),
          needed: show(v.neededArea, 2),
          packArea: show(v.packArea, 2),
        };
        return (
          <VizFigure
            caption={msg("flooring.visual.caption")}
            summary={msg("flooring.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <PurchaseCount
              exact={v.exactPacks}
              answer={v.answer}
              exactDisplay={vars.exact}
              answerDisplay={`${vars.answer} ${unit(v.answer, msg)}`}
              countText={msg("flooring.visual.count", vars)}
              label={msg("flooring.visual.label")}
              neededLabel={msg("flooring.visual.needed")}
              buyLabel={msg("flooring.visual.buy")}
            />
          </VizFigure>
        );
      }}
    />
  );
}
