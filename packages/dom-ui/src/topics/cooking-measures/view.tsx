import { UnitPresetTopic } from "../../components/unit-preset-topic";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";
export default function View(props: TopicViewProps) {
  return <UnitPresetTopic {...props} adapter={adapter} />;
}
