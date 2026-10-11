import type { CalculatorId } from "../../calculators/src/catalog.generated";

export type {
  ExamplePresentation,
  ExamplePresentationFailure,
  ExamplePresentationField,
  ExamplePresentationSuccess,
  ExamplePresenter,
} from "./example-presentation";

export type TopicViewProps = {
  id: CalculatorId;
  title: string;
  description: string;
  messages: Readonly<Record<string, string>>;
  locale: string;
};
