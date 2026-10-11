import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "compound-interest",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.compound-interest.intro.title",
      bodyKey: "lesson.compound-interest.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.compound-interest.formula.balance",
      variables: [
        {
          symbol: "P",
          nameKey: "lesson.compound-interest.variable.principal",
          unitKey: "unit.usd",
        },
        {
          symbol: "r",
          nameKey: "lesson.compound-interest.variable.rate",
          unitKey: "unit.percent",
        },
        {
          symbol: "n",
          nameKey: "lesson.compound-interest.variable.frequency",
          unitKey: "lesson.compound-interest.unit.periods-per-year",
        },
        {
          symbol: "t",
          nameKey: "lesson.compound-interest.variable.years",
          unitKey: "lesson.compound-interest.unit.years",
        },
        {
          symbol: "A",
          nameKey: "lesson.compound-interest.variable.balance",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-annual-growth",
      kind: "example",
      titleKey: "lesson.compound-interest.example.annual",
      operation: "compound",
      inputs: {
        principal: "1000.00",
        annualRate: "10",
        years: "2",
        frequency: "1",
      },
      expected: "1210",
      workingKey: "compound-interest.working.summary",
    },
    {
      id: "example-zero-rate",
      kind: "example",
      titleKey: "lesson.compound-interest.example.zero-rate",
      operation: "compound",
      inputs: {
        principal: "100.00",
        annualRate: "0",
        years: "2",
        frequency: "12",
      },
      expected: "100",
      workingKey: "compound-interest.working.summary",
    },
    {
      id: "example-quarterly-rounding",
      kind: "example",
      titleKey: "lesson.compound-interest.example.quarterly",
      operation: "compound",
      inputs: {
        principal: "250.00",
        annualRate: "4",
        years: "1",
        frequency: "4",
      },
      expected: "260.15",
      workingKey: "compound-interest.working.summary",
    },
    {
      id: "visual-growth",
      kind: "visual",
      visualKey: "compound-interest.visual.description",
      alternativeKey: "compound-interest.visual.alternative",
    },
    {
      id: "how-to-read",
      kind: "prose",
      titleKey: "lesson.compound-interest.method.title",
      bodyKey: "lesson.compound-interest.method.body",
    },
    {
      id: "rounding",
      kind: "prose",
      titleKey: "lesson.compound-interest.rounding.title",
      bodyKey: "lesson.compound-interest.rounding.body",
    },
    {
      id: "assumptions",
      kind: "prose",
      titleKey: "lesson.compound-interest.assumptions.title",
      bodyKey: "lesson.compound-interest.assumptions.body",
    },
    {
      id: "faq-frequency",
      kind: "faq",
      questionKey: "lesson.compound-interest.faq.frequency.q",
      answerKey: "lesson.compound-interest.faq.frequency.a",
    },
    {
      id: "faq-estimate",
      kind: "faq",
      questionKey: "lesson.compound-interest.faq.estimate.q",
      answerKey: "lesson.compound-interest.faq.estimate.a",
    },
    {
      id: "faq-deposits",
      kind: "faq",
      questionKey: "lesson.compound-interest.faq.deposits.q",
      answerKey: "lesson.compound-interest.faq.deposits.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.compound-interest.sources.title",
      bodyKey: "lesson.compound-interest.sources.body",
    },
    { id: "related-percentage", kind: "related", calculatorId: "percentage" },
  ],
};
