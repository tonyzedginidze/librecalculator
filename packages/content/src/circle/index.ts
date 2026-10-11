import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "circle",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "circle.intro.title",
      bodyKey: "circle.intro.body",
    },
    {
      id: "circle-area-formula",
      kind: "formula",
      bodyKey: "circle.formula.circle-area",
      variables: [
        {
          symbol: "r",
          nameKey: "circle.field.radius",
          unitKey: "circle.unit.metre",
        },
      ],
    },
    {
      id: "circle-area-example",
      kind: "example",
      titleKey: "circle.example.circle-area",
      operation: "circle-area",
      inputs: {
        radius: "1",
      },
      expected: "3.1415926535897932384626433832795028841971693993751",
      workingKey: "circle.working.circle-area",
    },
    {
      id: "circle-circumference-formula",
      kind: "formula",
      bodyKey: "circle.formula.circle-circumference",
      variables: [
        {
          symbol: "r",
          nameKey: "circle.field.radius",
          unitKey: "circle.unit.metre",
        },
      ],
    },
    {
      id: "circle-circumference-example",
      kind: "example",
      titleKey: "circle.example.circle-circumference",
      operation: "circle-circumference",
      inputs: {
        radius: "1",
      },
      expected: "6.2831853071795864769252867665590057683943387987502",
      workingKey: "circle.working.circle-circumference",
    },
    {
      id: "circle-diameter-formula",
      kind: "formula",
      bodyKey: "circle.formula.circle-diameter",
      variables: [
        {
          symbol: "r",
          nameKey: "circle.field.radius",
          unitKey: "circle.unit.metre",
        },
      ],
    },
    {
      id: "circle-diameter-example",
      kind: "example",
      titleKey: "circle.example.circle-diameter",
      operation: "circle-diameter",
      inputs: {
        radius: "1",
      },
      expected: "2",
      workingKey: "circle.working.circle-diameter",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "circle.visual",
      alternativeKey: "circle.visual",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "circle.mistakes.title",
      bodyKey: "circle.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "circle.limits.title",
      bodyKey: "circle.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "circle.faq.q",
      answerKey: "circle.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "circle.sources.title",
      bodyKey: "circle.sources.body",
    },
  ],
};
