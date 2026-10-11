import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "triangle",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "triangle.intro.title",
      bodyKey: "triangle.intro.body",
    },
    {
      id: "triangle-area-formula",
      kind: "formula",
      bodyKey: "triangle.formula.triangle-area",
      variables: [
        {
          symbol: "b",
          nameKey: "triangle.field.base",
          unitKey: "triangle.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "triangle.field.height",
          unitKey: "triangle.unit.metre",
        },
      ],
    },
    {
      id: "triangle-area-example",
      kind: "example",
      titleKey: "triangle.example.triangle-area",
      operation: "triangle-area",
      inputs: {
        base: "3",
        height: "4",
      },
      expected: "6",
      workingKey: "triangle.working.triangle-area",
    },
    {
      id: "triangle-perimeter-formula",
      kind: "formula",
      bodyKey: "triangle.formula.triangle-perimeter",
      variables: [
        {
          symbol: "a",
          nameKey: "triangle.field.sideA",
          unitKey: "triangle.unit.metre",
        },
        {
          symbol: "b",
          nameKey: "triangle.field.sideB",
          unitKey: "triangle.unit.metre",
        },
        {
          symbol: "c",
          nameKey: "triangle.field.sideC",
          unitKey: "triangle.unit.metre",
        },
      ],
    },
    {
      id: "triangle-perimeter-example",
      kind: "example",
      titleKey: "triangle.example.triangle-perimeter",
      operation: "triangle-perimeter",
      inputs: {
        sideA: "3",
        sideB: "4",
        sideC: "5",
      },
      expected: "12",
      workingKey: "triangle.working.triangle-perimeter",
    },
    {
      id: "triangle-altitude-formula",
      kind: "formula",
      bodyKey: "triangle.formula.triangle-altitude",
      variables: [
        {
          symbol: "A",
          nameKey: "triangle.field.area",
          unitKey: "triangle.unit.square-metre",
        },
        {
          symbol: "b",
          nameKey: "triangle.field.base",
          unitKey: "triangle.unit.metre",
        },
      ],
    },
    {
      id: "triangle-altitude-example",
      kind: "example",
      titleKey: "triangle.example.triangle-altitude",
      operation: "triangle-altitude",
      inputs: {
        area: "6",
        base: "3",
      },
      expected: "4",
      workingKey: "triangle.working.triangle-altitude",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "triangle.visual",
      alternativeKey: "triangle.visual",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "triangle.mistakes.title",
      bodyKey: "triangle.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "triangle.limits.title",
      bodyKey: "triangle.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "triangle.faq.q",
      answerKey: "triangle.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "triangle.sources.title",
      bodyKey: "triangle.sources.body",
    },
  ],
};
