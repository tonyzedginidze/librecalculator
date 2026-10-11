import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "final-grade",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "final-grade.intro.title",
      bodyKey: "final-grade.intro.body",
    },
    {
      id: "final-required-formula",
      kind: "formula",
      bodyKey: "final-grade.formula.final-required",
      variables: [
        {
          symbol: "f",
          nameKey: "final-grade.field.finalScore",
        },
        {
          symbol: "T",
          nameKey: "final-grade.field.target",
        },
        {
          symbol: "c",
          nameKey: "final-grade.field.current",
        },
        {
          symbol: "w",
          nameKey: "final-grade.symbol.w",
        },
      ],
    },
    {
      id: "final-required-example",
      kind: "example",
      titleKey: "final-grade.example.final-required",
      operation: "final-required",
      inputs: {
        current: "80",
        target: "83",
        finalWeight: "30",
      },
      expected: "90",
      workingKey: "final-grade.working.final-required",
    },
    {
      id: "final-projected-formula",
      kind: "formula",
      bodyKey: "final-grade.formula.final-projected",
      variables: [
        {
          symbol: "G",
          nameKey: "final-grade.symbol.G",
        },
        {
          symbol: "c",
          nameKey: "final-grade.field.current",
        },
        {
          symbol: "f",
          nameKey: "final-grade.field.finalScore",
        },
        {
          symbol: "w",
          nameKey: "final-grade.symbol.w",
        },
      ],
    },
    {
      id: "final-projected-example",
      kind: "example",
      titleKey: "final-grade.example.final-projected",
      operation: "final-projected",
      inputs: {
        current: "80",
        finalScore: "90",
        finalWeight: "30",
      },
      expected: "83",
      workingKey: "final-grade.working.final-projected",
    },
    {
      id: "final-current-needed-formula",
      kind: "formula",
      bodyKey: "final-grade.formula.final-current-needed",
      variables: [
        {
          symbol: "c",
          nameKey: "final-grade.field.current",
        },
        {
          symbol: "T",
          nameKey: "final-grade.field.target",
        },
        {
          symbol: "f",
          nameKey: "final-grade.field.finalScore",
        },
        {
          symbol: "w",
          nameKey: "final-grade.symbol.w",
        },
      ],
    },
    {
      id: "final-current-needed-example",
      kind: "example",
      titleKey: "final-grade.example.final-current-needed",
      operation: "final-current-needed",
      inputs: {
        target: "83",
        finalScore: "90",
        finalWeight: "30",
      },
      expected: "80",
      workingKey: "final-grade.working.final-current-needed",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "final-grade.visual.lesson",
      alternativeKey: "final-grade.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "final-grade.mistakes.title",
      bodyKey: "final-grade.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "final-grade.limits.title",
      bodyKey: "final-grade.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "final-grade.faq.q",
      answerKey: "final-grade.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "final-grade.sources.title",
      bodyKey: "final-grade.sources.body",
    },
  ],
};
