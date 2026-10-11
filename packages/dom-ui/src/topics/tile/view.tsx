import type { ErrorCode, Result } from "../../../../calculators/src/tile";
import { plural } from "../../../../i18n/src/en";
import { VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import { ConstructionTopic, PurchaseCount } from "../construction-view";
import { adapter } from "./adapter";

const DIGITS = 0;

export default function View(props: TopicViewProps) {
  const unit = (value: string, msg: (key: string) => string) =>
    plural(props.locale, Number(value), {
      one: msg("tile.answer.one"),
      other: msg("tile.answer.other"),
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
          exact: show(v.exactTiles, 2),
          reference: show(v.reference, 2),
          waste: show(v.waste, 2),
          area: show(v.reference, 2),
          tileArea: show(v.tileArea, 2),
        };
        return (
          <VizFigure
            caption={msg("tile.visual.caption")}
            summary={msg("tile.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <PurchaseCount
              exact={v.exactTiles}
              answer={v.answer}
              exactDisplay={vars.exact}
              answerDisplay={`${vars.answer} ${unit(v.answer, msg)}`}
              countText={msg("tile.visual.count", vars)}
              label={msg("tile.visual.label")}
              neededLabel={msg("tile.visual.needed")}
              buyLabel={msg("tile.visual.buy")}
            />
          </VizFigure>
        );
      }}
    />
  );
}
