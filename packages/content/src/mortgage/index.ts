import type { Lesson } from "../schema";

const loan = {
  homePrice: "400000",
  downPayment: "80000",
  annualRate: "6.5",
  years: "30",
  propertyTax: "0",
  homeInsurance: "0",
  hoa: "0",
};

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
      id: "total-payment",
      kind: "prose",
      titleKey: "lesson.mortgage.formula.total.title",
      bodyKey: "lesson.mortgage.formula.total.body",
    },
    {
      id: "example-typical",
      kind: "example",
      titleKey: "lesson.mortgage.example.typical",
      operation: "amortize",
      inputs: loan,
      expected: "2022.62",
      workingKey: "mortgage.working.payment",
    },
    {
      id: "example-typical-note",
      kind: "prose",
      bodyKey: "lesson.mortgage.example.typical.body",
    },
    {
      id: "example-costs",
      kind: "example",
      titleKey: "lesson.mortgage.example.costs",
      operation: "amortize",
      inputs: {
        ...loan,
        propertyTax: "4800",
        homeInsurance: "1500",
        hoa: "50",
      },
      expected: "2597.62",
      workingKey: "mortgage.working.total-monthly",
    },
    {
      id: "example-costs-note",
      kind: "prose",
      bodyKey: "lesson.mortgage.example.costs.body",
    },
    {
      id: "example-fifteen",
      kind: "example",
      titleKey: "lesson.mortgage.example.fifteen",
      operation: "amortize",
      inputs: { ...loan, years: "15" },
      expected: "2787.54",
      workingKey: "mortgage.working.payment",
    },
    {
      id: "example-fifteen-note",
      kind: "prose",
      bodyKey: "lesson.mortgage.example.fifteen.body",
    },
    {
      id: "example-one-year",
      kind: "example",
      titleKey: "lesson.mortgage.example.one-year",
      operation: "amortize",
      inputs: {
        homePrice: "1000",
        downPayment: "0",
        annualRate: "12",
        years: "1",
        propertyTax: "0",
        homeInsurance: "0",
        hoa: "0",
      },
      expected: "88.85",
      workingKey: "mortgage.working.final-payment",
    },
    {
      id: "example-one-year-note",
      kind: "prose",
      bodyKey: "lesson.mortgage.example.one-year.body",
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
      id: "faq-term",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.term.q",
      answerKey: "lesson.mortgage.faq.term.a",
    },
    {
      id: "faq-down",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.down.q",
      answerKey: "lesson.mortgage.faq.down.a",
    },
    {
      id: "faq-zero",
      kind: "faq",
      questionKey: "lesson.mortgage.faq.zero.q",
      answerKey: "lesson.mortgage.faq.zero.a",
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
