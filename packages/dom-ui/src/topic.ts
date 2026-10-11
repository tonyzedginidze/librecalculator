import type { CalculatorId } from "../../calculators/src/catalog.generated";
import type {
  CalculationResult,
  FieldDescriptor,
  OperationDescriptor,
} from "../../calculators/src/contracts";

export type TopicFieldParse =
  | { state: "valid"; canonical: string }
  | { state: "incomplete" }
  | { state: "invalid"; reason: string };

export type TopicAdapter<R, Code extends string = string> = {
  id: CalculatorId;
  schemaVersion: number;
  descriptors: readonly OperationDescriptor[];
  parseField: (
    raw: string,
    locale: string,
    field: FieldDescriptor,
  ) => TopicFieldParse;
  calculate: (
    operationId: string,
    fields: Record<string, string>,
  ) => CalculationResult<R, Code>;
};
