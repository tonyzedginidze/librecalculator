import type { FuelEconomyResult } from "../../../../calculators/src/fuel-economy";
import type { NumericResult } from "../../../../calculators/src/runtime/numeric-result";
import { NumericTopic } from "../../components/numeric-topic";
import { Equation, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 2;

const isFuel = (r: NumericResult): r is FuelEconomyResult =>
  "litresPer100km" in r.visual;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, operationId, show, messages }) => {
        if (!isFuel(result)) return null;
        const text = (key: string) => messageText(messages, key);
        const vars = {
          consumption: show(result.visual.litresPer100km),
          efficiency: show(result.visual.kilometresPerLitre),
        };
        const consumption = {
          label: text("fuel-economy.visual.consumption"),
          display: `${vars.consumption} ${text("fuel-economy.unit.litres-per-100km")}`,
          emphasis: operationId === "litres-per-100km",
        };
        const efficiency = {
          label: text("fuel-economy.visual.efficiency"),
          display: `${vars.efficiency} ${text("fuel-economy.unit.kilometres-per-litre")}`,
          emphasis: operationId === "kilometres-per-litre",
        };
        const same = { op: text("fuel-economy.visual.same") };
        return (
          <VizFigure
            caption={text("fuel-economy.visual.caption")}
            summary={fillMessage(text("fuel-economy.visual.summary"), vars)}
            note={text("fuel-economy.visual.description")}
          >
            <Equation
              items={
                operationId === "litres-per-100km"
                  ? [consumption, same, efficiency]
                  : [efficiency, same, consumption]
              }
            />
          </VizFigure>
        );
      }}
    />
  );
}
