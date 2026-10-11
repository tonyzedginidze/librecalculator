import { usdExamplePresenter } from "../core-money";
import { adapter } from "./adapter";

export const presentExample = usdExamplePresenter(adapter, [
  "principal",
  "payment",
  "finalPayment",
  "interest",
]);
