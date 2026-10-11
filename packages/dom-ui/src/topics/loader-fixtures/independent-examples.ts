import type { ExamplePresenter } from "../../example-presentation";

export const presentExample: ExamplePresenter = (example) => ({
  ok: true,
  fields: Object.entries(example.inputs).map(([id, value]) => ({
    id,
    label: `Input ${id}`,
    value,
  })),
  answer: "fixture-result:12",
  working: ["fixture multiplication: 3 × 4 = 12"],
});
