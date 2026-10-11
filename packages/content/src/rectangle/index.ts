import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "rectangle",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "rectangle.intro.title",
      bodyKey: "rectangle.intro.body",
    },
    {
      id: "rectangle-area-formula",
      kind: "formula",
      bodyKey: "rectangle.formula.rectangle-area",
      variables: [
        {
          symbol: "w",
          nameKey: "rectangle.field.width",
          unitKey: "rectangle.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "rectangle.field.height",
          unitKey: "rectangle.unit.metre",
        },
      ],
    },
    {
      id: "rectangle-area-example",
      kind: "example",
      titleKey: "rectangle.example.rectangle-area",
      operation: "rectangle-area",
      inputs: {
        width: "3",
        height: "4",
      },
      expected: "12",
      workingKey: "rectangle.working.rectangle-area",
    },
    {
      id: "rectangle-perimeter-formula",
      kind: "formula",
      bodyKey: "rectangle.formula.rectangle-perimeter",
      variables: [
        {
          symbol: "w",
          nameKey: "rectangle.field.width",
          unitKey: "rectangle.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "rectangle.field.height",
          unitKey: "rectangle.unit.metre",
        },
      ],
    },
    {
      id: "rectangle-perimeter-example",
      kind: "example",
      titleKey: "rectangle.example.rectangle-perimeter",
      operation: "rectangle-perimeter",
      inputs: {
        width: "3",
        height: "4",
      },
      expected: "14",
      workingKey: "rectangle.working.rectangle-perimeter",
    },
    {
      id: "rectangle-diagonal-formula",
      kind: "formula",
      bodyKey: "rectangle.formula.rectangle-diagonal",
      variables: [
        {
          symbol: "w",
          nameKey: "rectangle.field.width",
          unitKey: "rectangle.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "rectangle.field.height",
          unitKey: "rectangle.unit.metre",
        },
      ],
    },
    {
      id: "rectangle-diagonal-example",
      kind: "example",
      titleKey: "rectangle.example.rectangle-diagonal",
      operation: "rectangle-diagonal",
      inputs: {
        width: "3",
        height: "4",
      },
      expected: "5",
      workingKey: "rectangle.working.rectangle-diagonal",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "rectangle.visual",
      alternativeKey: "rectangle.visual",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "rectangle.mistakes.title",
      bodyKey: "rectangle.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "rectangle.limits.title",
      bodyKey: "rectangle.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "rectangle.faq.q",
      answerKey: "rectangle.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "rectangle.sources.title",
      bodyKey: "rectangle.sources.body",
    },
  ],
};
