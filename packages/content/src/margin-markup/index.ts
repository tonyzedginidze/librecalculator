import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "margin-markup",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.margin-markup.intro.title",
      bodyKey: "lesson.margin-markup.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.margin-markup.method.title",
      bodyKey: "lesson.margin-markup.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.margin-markup.formula",
      variables: [
        {
          symbol: "C",
          nameKey: "margin-markup.field.cost",
          unitKey: "unit.usd",
        },
        {
          symbol: "P",
          nameKey: "margin-markup.field.price",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.margin-markup.example.1",
      operation: "margin",
      inputs: {
        cost: "80",
        price: "100",
      },
      expected: "20",
      workingKey: "margin-markup.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.margin-markup.example.2",
      operation: "markup",
      inputs: {
        cost: "80",
        price: "100",
      },
      expected: "25",
      workingKey: "margin-markup.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.margin-markup.example.3",
      operation: "margin",
      inputs: {
        cost: "100",
        price: "80",
      },
      expected: "-25",
      workingKey: "margin-markup.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "margin-markup.visual.description",
      alternativeKey: "margin-markup.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.margin-markup.mistakes.title",
      bodyKey: "lesson.margin-markup.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.margin-markup.limits.title",
      bodyKey: "lesson.margin-markup.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.margin-markup.faq.q",
      answerKey: "lesson.margin-markup.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.margin-markup.sources.title",
      bodyKey: "lesson.margin-markup.sources.body",
    },
  ],
};
