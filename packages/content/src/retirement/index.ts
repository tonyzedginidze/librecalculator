import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "retirement",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.retirement.intro.title",
      bodyKey: "lesson.retirement.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.retirement.method.title",
      bodyKey: "lesson.retirement.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.retirement.formula",
      variables: [
        {
          symbol: "B",
          nameKey: "retirement.field.balance",
          unitKey: "unit.usd",
        },
        {
          symbol: "C",
          nameKey: "retirement.field.contribution",
          unitKey: "unit.usd",
        },
        {
          symbol: "R",
          nameKey: "retirement.field.annualRate",
        },
        {
          symbol: "t",
          nameKey: "retirement.field.years",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.retirement.example.1",
      operation: "project",
      inputs: {
        balance: "10000",
        contribution: "5000",
        annualRate: "0",
        years: "10",
      },
      expected: "60000",
      workingKey: "retirement.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.retirement.example.2",
      operation: "project",
      inputs: {
        balance: "1000",
        contribution: "100",
        annualRate: "10",
        years: "1",
      },
      expected: "1200",
      workingKey: "retirement.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.retirement.example.3",
      operation: "project",
      inputs: {
        balance: "1000",
        contribution: "100",
        annualRate: "10",
        years: "2",
      },
      expected: "1420",
      workingKey: "retirement.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "retirement.visual.description",
      alternativeKey: "retirement.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.retirement.mistakes.title",
      bodyKey: "lesson.retirement.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.retirement.limits.title",
      bodyKey: "lesson.retirement.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.retirement.faq.q",
      answerKey: "lesson.retirement.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.retirement.sources.title",
      bodyKey: "lesson.retirement.sources.body",
    },
  ],
};
