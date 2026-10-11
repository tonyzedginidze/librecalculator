import type { TopicAdapter } from "../../topic";

type IndependentResult = {
  summary: string;
  product: string;
};

export const adapter: TopicAdapter<IndependentResult> = {
  id: "percentage",
  schemaVersion: 1,
  descriptors: [
    {
      id: "scale",
      labelKey: "fixture.scale.label",
      fields: [
        {
          id: "amount",
          labelKey: "fixture.amount.label",
          defaultValue: "3",
          input: "decimal",
        },
        {
          id: "factor",
          labelKey: "fixture.factor.label",
          defaultValue: "4",
          input: "decimal",
        },
      ],
      working: [],
    },
  ],
  parseField(raw) {
    return { state: "valid", canonical: raw };
  },
  calculate(operationId, fields) {
    if (
      operationId !== "scale" ||
      fields.amount === undefined ||
      fields.factor === undefined
    ) {
      return { ok: false, error: { code: "invalid-fixture-input" } };
    }
    const product = String(Number(fields.amount) * Number(fields.factor));
    return {
      ok: true,
      result: {
        summary: `${fields.amount} scaled by ${fields.factor}`,
        product,
      },
    };
  },
};
