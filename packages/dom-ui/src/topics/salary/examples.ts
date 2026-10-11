import { fillMessage } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { financeExamplePresenter } from "../finance-format";
import { adapter, moneyArgs } from "./adapter";

export const presentExample = financeExamplePresenter(
  adapter,
  (r, operation, f, messages) =>
    fillMessage(messageText(messages, `salary.answer.value.${operation}`), {
      amount: f.usd(r.answer.value),
    }),
  moneyArgs,
);
