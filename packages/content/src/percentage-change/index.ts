import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "percentage-change",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.percentage-change.intro.title",
      bodyKey: "lesson.percentage-change.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.percentage-change.formula.change",
      variables: [
        {
          symbol: "O",
          nameKey: "lesson.percentage-change.variable.old",
        },
        {
          symbol: "N",
          nameKey: "lesson.percentage-change.variable.new",
        },
        {
          symbol: "Δ",
          nameKey: "lesson.percentage-change.variable.delta",
        },
        {
          symbol: "c",
          nameKey: "lesson.percentage-change.variable.change",
          unitKey: "unit.percent",
        },
      ],
    },
    {
      id: "example-increase",
      kind: "example",
      titleKey: "lesson.percentage-change.example.increase",
      operation: "change",
      inputs: { oldValue: "100", newValue: "125" },
      expected: "25",
      workingKey: "percentage-change.working.change",
    },
    {
      id: "example-negative-toward-zero",
      kind: "example",
      titleKey: "lesson.percentage-change.example.negative-toward-zero",
      operation: "change",
      inputs: { oldValue: "-100", newValue: "-50" },
      expected: "-50",
      workingKey: "percentage-change.working.change",
    },
    {
      id: "example-negative-away-zero",
      kind: "example",
      titleKey: "lesson.percentage-change.example.negative-away-zero",
      operation: "change",
      inputs: { oldValue: "-100", newValue: "-150" },
      expected: "50",
      workingKey: "percentage-change.working.change",
    },
    {
      id: "example-to-zero",
      kind: "example",
      titleKey: "lesson.percentage-change.example.to-zero",
      operation: "change",
      inputs: { oldValue: "50", newValue: "0" },
      expected: "-100",
      workingKey: "percentage-change.working.change",
    },
    {
      id: "visual-comparison",
      kind: "visual",
      visualKey: "percentage-change.visual.description",
      alternativeKey: "percentage-change.visual.alternative",
    },
    {
      id: "interpretation",
      kind: "prose",
      titleKey: "lesson.percentage-change.interpretation.title",
      bodyKey: "lesson.percentage-change.interpretation.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.percentage-change.mistakes.title",
      bodyKey: "lesson.percentage-change.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.percentage-change.limits.title",
      bodyKey: "lesson.percentage-change.limits.body",
    },
    {
      id: "faq-baseline",
      kind: "faq",
      questionKey: "lesson.percentage-change.faq.baseline.q",
      answerKey: "lesson.percentage-change.faq.baseline.a",
    },
    {
      id: "faq-zero",
      kind: "faq",
      questionKey: "lesson.percentage-change.faq.zero.q",
      answerKey: "lesson.percentage-change.faq.zero.a",
    },
    {
      id: "faq-negative",
      kind: "faq",
      questionKey: "lesson.percentage-change.faq.negative.q",
      answerKey: "lesson.percentage-change.faq.negative.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.percentage-change.sources.title",
      bodyKey: "lesson.percentage-change.sources.body",
    },
    {
      id: "related-percentage",
      kind: "related",
      calculatorId: "percentage",
    },
  ],
};
