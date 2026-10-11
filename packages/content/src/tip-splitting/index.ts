import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "tip-splitting",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.tip-splitting.intro.title",
      bodyKey: "lesson.tip-splitting.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.tip-splitting.formula.split",
      variables: [
        {
          symbol: "S",
          nameKey: "lesson.tip-splitting.variable.subtotal",
          unitKey: "unit.usd",
        },
        {
          symbol: "p",
          nameKey: "lesson.tip-splitting.variable.rate",
          unitKey: "unit.percent",
        },
        {
          symbol: "T",
          nameKey: "lesson.tip-splitting.variable.tip",
          unitKey: "unit.usd",
        },
        {
          symbol: "N",
          nameKey: "lesson.tip-splitting.variable.people",
          unitKey: "lesson.tip-splitting.unit.people",
        },
        {
          symbol: "G",
          nameKey: "lesson.tip-splitting.variable.total",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-remainder",
      kind: "example",
      titleKey: "lesson.tip-splitting.example.remainder",
      operation: "split",
      inputs: { subtotal: "10.00", tipRate: "15", people: "3" },
      expected: "11.5",
      workingKey: "tip-splitting.working.summary",
    },
    {
      id: "example-even",
      kind: "example",
      titleKey: "lesson.tip-splitting.example.even",
      operation: "split",
      inputs: { subtotal: "100.00", tipRate: "20", people: "4" },
      expected: "120",
      workingKey: "tip-splitting.working.summary",
    },
    {
      id: "example-zero",
      kind: "example",
      titleKey: "lesson.tip-splitting.example.zero",
      operation: "split",
      inputs: { subtotal: "0.00", tipRate: "1000", people: "1" },
      expected: "0",
      workingKey: "tip-splitting.working.summary",
    },
    {
      id: "visual-allocation",
      kind: "visual",
      visualKey: "tip-splitting.visual.description",
      alternativeKey: "tip-splitting.visual.alternative",
    },
    {
      id: "allocation-rule",
      kind: "prose",
      titleKey: "lesson.tip-splitting.allocation.title",
      bodyKey: "lesson.tip-splitting.allocation.body",
    },
    {
      id: "tip-rounding",
      kind: "prose",
      titleKey: "lesson.tip-splitting.rounding.title",
      bodyKey: "lesson.tip-splitting.rounding.body",
    },
    {
      id: "assumptions",
      kind: "prose",
      titleKey: "lesson.tip-splitting.assumptions.title",
      bodyKey: "lesson.tip-splitting.assumptions.body",
    },
    {
      id: "faq-remainder",
      kind: "faq",
      questionKey: "lesson.tip-splitting.faq.remainder.q",
      answerKey: "lesson.tip-splitting.faq.remainder.a",
    },
    {
      id: "faq-tax",
      kind: "faq",
      questionKey: "lesson.tip-splitting.faq.tax.q",
      answerKey: "lesson.tip-splitting.faq.tax.a",
    },
    {
      id: "faq-included-tip",
      kind: "faq",
      questionKey: "lesson.tip-splitting.faq.included.q",
      answerKey: "lesson.tip-splitting.faq.included.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.tip-splitting.sources.title",
      bodyKey: "lesson.tip-splitting.sources.body",
    },
    { id: "related-percentage", kind: "related", calculatorId: "percentage" },
  ],
};
