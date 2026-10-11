import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "area",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.area.intro.title",
      bodyKey: "lesson.area.intro.body",
    },
    {
      id: "rectangle-formula",
      kind: "formula",
      bodyKey: "lesson.area.formula.rectangle",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.area.variable.area",
          unitKey: "area.unit.square-metre",
        },
        {
          symbol: "w",
          nameKey: "lesson.area.variable.width",
          unitKey: "area.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "lesson.area.variable.height",
          unitKey: "area.unit.metre",
        },
      ],
    },
    {
      id: "triangle-formula",
      kind: "formula",
      bodyKey: "lesson.area.formula.triangle",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.area.variable.area",
          unitKey: "area.unit.square-metre",
        },
        {
          symbol: "b",
          nameKey: "lesson.area.variable.base",
          unitKey: "area.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "lesson.area.variable.height",
          unitKey: "area.unit.metre",
        },
      ],
    },
    {
      id: "circle-formula",
      kind: "formula",
      bodyKey: "lesson.area.formula.circle",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.area.variable.area",
          unitKey: "area.unit.square-metre",
        },
        {
          symbol: "r",
          nameKey: "lesson.area.variable.radius",
          unitKey: "area.unit.metre",
        },
      ],
    },
    {
      id: "example-rectangle",
      kind: "example",
      titleKey: "lesson.area.example.rectangle",
      operation: "rectangle",
      inputs: { width: "3", height: "4" },
      expected: "12",
      workingKey: "area.working.rectangle",
    },
    {
      id: "example-triangle",
      kind: "example",
      titleKey: "lesson.area.example.triangle",
      operation: "triangle",
      inputs: { base: "3", height: "4" },
      expected: "6",
      workingKey: "area.working.triangle",
    },
    {
      id: "example-circle",
      kind: "example",
      titleKey: "lesson.area.example.circle",
      operation: "circle",
      inputs: { radius: "1" },
      expected: "3.1415926535897932384626433832795028841971693993751",
      workingKey: "area.working.circle",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "area.visual.description",
      alternativeKey: "area.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.area.mistakes.title",
      bodyKey: "lesson.area.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.area.limits.title",
      bodyKey: "lesson.area.limits.body",
    },
    {
      id: "faq-triangle",
      kind: "faq",
      questionKey: "lesson.area.faq.triangle.q",
      answerKey: "lesson.area.faq.triangle.a",
    },
    {
      id: "faq-circle",
      kind: "faq",
      questionKey: "lesson.area.faq.circle.q",
      answerKey: "lesson.area.faq.circle.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.area.sources.title",
      bodyKey: "lesson.area.sources.body",
    },
  ],
};
