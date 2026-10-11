import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "mortgage",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.mortgage.intro.title",
      bodyKey: "lesson.mortgage.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.mortgage.formula.payment",
      variables: [
        {
          symbol: "P",
          nameKey: "lesson.mortgage.variable.principal",
          unitKey: "unit.usd",
        },
        {
          symbol: "i",
          nameKey: "lesson.mortgage.variable.monthly-rate",
        },
        {
          symbol: "N",
          nameKey: "lesson.mortgage.variable.months",
          unitKey: "lesson.mortgage.unit.months",
        },
        {
          symbol: "M",
          nameKey: "lesson.mortgage.variable.regular-payment",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-zero-rate",
      kind: "example",
      titleKey: "lesson.mortgage.example.zero-rate",
      operation: "amortize",
      inputs: { principal: "10.00", annualRate: "0", months: "3" },
      expected: "10",
      workingKey: "mortgage.working.summary",
    },
    {
      id: "example-one-month",
      kind: "example",
      titleKey: "lesson.mortgage.example.one-month",
      operation: "amortize",
      inputs: { principal: "100.00", annualRate: "12", months: "1" },
      expected: "101",
      workingKey: "mortgage.working.summary",
    },
    {
      id: "example-amortization",
      kind: "example",
      titleKey: "lesson.mortgage.example.amortization",
      operation: "amortize",
      inputs: { principal: "1000.00", annualRate: "12", months: "12" },
      expected: "1066.19",
      workingKey: "mortgage.working.summary",
    },
    {
      id: "visual-schedule",
      kind: "visual",
      visualKey: "mortgage.visual.description",
      alternativeKey: "mortgage.visual.alternative",
    },
    {
      id: "schedule-method",
      kind: "prose",
      titleKey: "lesson.mortgage.schedule.title",
      bodyKey: "lesson.mortgage.schedule.body",
    },
    {
      id: "settlement",
      kind: "prose",
      titleKey: "lesson.mortgage.settlement.title",
      bodyKey: "lesson.mortgage.settlement.body",
    },
    {
      id: "assumptions",
      kind: "prose",
      titleKey: "lesson.mortgage.assumptions.title",
      bodyKey: "lesson.mortgage.assumptions.body",
    },
    {
      id: "faq-zero",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.zero.q",
      answerKey: "lesson.mortgage.faq.zero.a",
    },
    {
      id: "faq-final",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.final.q",
      answerKey: "lesson.mortgage.faq.final.a",
    },
    {
      id: "faq-apr",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.apr.q",
      answerKey: "lesson.mortgage.faq.apr.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.mortgage.sources.title",
      bodyKey: "lesson.mortgage.sources.body",
    },
    { id: "related-percentage", kind: "related", calculatorId: "percentage" },
  ],
};
