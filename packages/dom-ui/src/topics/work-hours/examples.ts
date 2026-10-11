import { dateTimeExamples } from "../date-time-topic";
import { adapter } from "./adapter";
import { workHoursAnswer } from "./view";

export const presentExample = dateTimeExamples(adapter, workHoursAnswer, 2);
