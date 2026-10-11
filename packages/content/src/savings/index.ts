import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "savings",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.savings.intro.title",
      bodyKey: "lesson.savings.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.savings.method.title",
      bodyKey: "lesson.savings.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.savings.formula",
      variables: [
        {
          symbol: "P",
          nameKey: "savings.field.principal",
          unitKey: "unit.usd",
        },
        {
          symbol: "D",
          nameKey: "savings.field.deposit",
          unitKey: "unit.usd",
        },
        {
          symbol: "R",
          nameKey: "savings.field.annualRate",
        },
        {
          symbol: "n",
          nameKey: "savings.field.months",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.savings.example.1",
      operation: "save",
      inputs: {
        principal: "1000",
        deposit: "100",
        annualRate: "0",
        months: "12",
      },
      expected: "2200",
      workingKey: "savings.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.savings.example.2",
      operation: "save",
      inputs: {
        principal: "100",
        deposit: "10",
        annualRate: "12",
        months: "1",
      },
      expected: "111",
      workingKey: "savings.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.savings.example.3",
      operation: "save",
      inputs: {
        principal: "100",
        deposit: "10",
        annualRate: "12",
        months: "2",
      },
      expected: "122.11",
      workingKey: "savings.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "savings.visual.description",
      alternativeKey: "savings.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.savings.mistakes.title",
      bodyKey: "lesson.savings.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.savings.limits.title",
      bodyKey: "lesson.savings.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.savings.faq.q",
      answerKey: "lesson.savings.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.savings.sources.title",
      bodyKey: "lesson.savings.sources.body",
    },
  ],
};
