import { financeExamplePresenter } from "../finance-format";
import { adapter, moneyArgs } from "./adapter";

export const presentExample = financeExamplePresenter(
  adapter,
  (r, _op, f) => f.usd(r.answer.value),
  moneyArgs,
);
