import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "loan-payments",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.loan-payments.intro.title",
      bodyKey: "lesson.loan-payments.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.loan-payments.formula.payment",
      variables: [
        {
          symbol: "P",
          nameKey: "lesson.loan-payments.variable.principal",
          unitKey: "unit.usd",
        },
        {
          symbol: "i",
          nameKey: "lesson.loan-payments.variable.monthly-rate",
          unitKey: "unit.percent",
        },
        {
          symbol: "N",
          nameKey: "lesson.loan-payments.variable.months",
          unitKey: "lesson.loan-payments.unit.months",
        },
        {
          symbol: "M",
          nameKey: "lesson.loan-payments.variable.regular-payment",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-zero-rate",
      kind: "example",
      titleKey: "lesson.loan-payments.example.zero-rate",
      operation: "amortize",
      inputs: { principal: "10.00", annualRate: "0", months: "3" },
      expected: "10",
      workingKey: "loan-payments.working.summary",
    },
    {
      id: "example-one-month",
      kind: "example",
      titleKey: "lesson.loan-payments.example.one-month",
      operation: "amortize",
      inputs: { principal: "100.00", annualRate: "12", months: "1" },
      expected: "101",
      workingKey: "loan-payments.working.summary",
    },
    {
      id: "example-amortization",
      kind: "example",
      titleKey: "lesson.loan-payments.example.amortization",
      operation: "amortize",
      inputs: { principal: "1000.00", annualRate: "12", months: "12" },
      expected: "1066.19",
      workingKey: "loan-payments.working.summary",
    },
    {
      id: "visual-schedule",
      kind: "visual",
      visualKey: "loan-payments.visual.description",
      alternativeKey: "loan-payments.visual.alternative",
    },
    {
      id: "schedule-method",
      kind: "prose",
      titleKey: "lesson.loan-payments.schedule.title",
      bodyKey: "lesson.loan-payments.schedule.body",
    },
    {
      id: "settlement",
      kind: "prose",
      titleKey: "lesson.loan-payments.settlement.title",
      bodyKey: "lesson.loan-payments.settlement.body",
    },
    {
      id: "assumptions",
      kind: "prose",
      titleKey: "lesson.loan-payments.assumptions.title",
      bodyKey: "lesson.loan-payments.assumptions.body",
    },
    {
      id: "faq-zero",
      kind: "faq",
      questionKey: "lesson.loan-payments.faq.zero.q",
      answerKey: "lesson.loan-payments.faq.zero.a",
    },
    {
      id: "faq-final",
      kind: "faq",
      questionKey: "lesson.loan-payments.faq.final.q",
      answerKey: "lesson.loan-payments.faq.final.a",
    },
    {
      id: "faq-apr",
      kind: "faq",
      questionKey: "lesson.loan-payments.faq.apr.q",
      answerKey: "lesson.loan-payments.faq.apr.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.loan-payments.sources.title",
      bodyKey: "lesson.loan-payments.sources.body",
    },
    { id: "related-percentage", kind: "related", calculatorId: "percentage" },
  ],
};
