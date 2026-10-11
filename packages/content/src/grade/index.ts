import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "grade",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "grade.intro.title",
      bodyKey: "grade.intro.body",
    },
    {
      id: "grade-percent-formula",
      kind: "formula",
      bodyKey: "grade.formula.grade-percent",
      variables: [
        {
          symbol: "p",
          nameKey: "grade.symbol.p",
          unitKey: "grade.answer.percent",
        },
        {
          symbol: "e",
          nameKey: "grade.symbol.e",
        },
        {
          symbol: "t",
          nameKey: "grade.symbol.t",
        },
      ],
    },
    {
      id: "grade-percent-example",
      kind: "example",
      titleKey: "grade.example.grade-percent",
      operation: "grade-percent",
      inputs: {
        earned: "40",
        possible: "50",
      },
      expected: "80",
      workingKey: "grade.working.grade-percent",
    },
    {
      id: "grade-contribution-formula",
      kind: "formula",
      bodyKey: "grade.formula.grade-contribution",
      variables: [
        {
          symbol: "c",
          nameKey: "grade.symbol.c",
        },
        {
          symbol: "p",
          nameKey: "grade.symbol.p",
          unitKey: "grade.answer.percent",
        },
        {
          symbol: "w",
          nameKey: "grade.field.weight",
          unitKey: "grade.answer.percent",
        },
      ],
    },
    {
      id: "grade-contribution-example",
      kind: "example",
      titleKey: "grade.example.grade-contribution",
      operation: "grade-contribution",
      inputs: {
        percentage: "80",
        weight: "30",
      },
      expected: "24",
      workingKey: "grade.working.grade-contribution",
    },
    {
      id: "grade-required-points-formula",
      kind: "formula",
      bodyKey: "grade.formula.grade-required-points",
      variables: [
        {
          symbol: "e",
          nameKey: "grade.symbol.e",
        },
        {
          symbol: "T",
          nameKey: "grade.symbol.T",
          unitKey: "grade.answer.percent",
        },
        {
          symbol: "t",
          nameKey: "grade.symbol.t",
        },
      ],
    },
    {
      id: "grade-required-points-example",
      kind: "example",
      titleKey: "grade.example.grade-required-points",
      operation: "grade-required-points",
      inputs: {
        target: "80",
        possible: "50",
      },
      expected: "40",
      workingKey: "grade.working.grade-required-points",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "grade.visual.lesson",
      alternativeKey: "grade.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "grade.mistakes.title",
      bodyKey: "grade.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "grade.limits.title",
      bodyKey: "grade.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "grade.faq.q",
      answerKey: "grade.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "grade.sources.title",
      bodyKey: "grade.sources.body",
    },
  ],
};
