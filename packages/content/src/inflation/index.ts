import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "inflation",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.inflation.intro.title",
      bodyKey: "lesson.inflation.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.inflation.method.title",
      bodyKey: "lesson.inflation.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.inflation.formula",
      variables: [
        {
          symbol: "A",
          nameKey: "inflation.field.amount",
          unitKey: "unit.usd",
        },
        {
          symbol: "R",
          nameKey: "inflation.field.annualRate",
        },
        {
          symbol: "t",
          nameKey: "inflation.field.years",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.inflation.example.1",
      operation: "future-cost",
      inputs: {
        amount: "100",
        annualRate: "10",
        years: "2",
      },
      expected: "121",
      workingKey: "inflation.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.inflation.example.2",
      operation: "purchasing-power",
      inputs: {
        amount: "121",
        annualRate: "10",
        years: "2",
      },
      expected: "100",
      workingKey: "inflation.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.inflation.example.3",
      operation: "future-cost",
      inputs: {
        amount: "250",
        annualRate: "0",
        years: "20",
      },
      expected: "250",
      workingKey: "inflation.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "inflation.visual.description",
      alternativeKey: "inflation.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.inflation.mistakes.title",
      bodyKey: "lesson.inflation.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.inflation.limits.title",
      bodyKey: "lesson.inflation.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.inflation.faq.q",
      answerKey: "lesson.inflation.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.inflation.sources.title",
      bodyKey: "lesson.inflation.sources.body",
    },
  ],
};
