import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "cooking-measures",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "cooking-measures.intro.title",
      bodyKey: "cooking-measures.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "cooking-measures.formula",
      variables: [
        {
          symbol: "x",
          nameKey: "cooking-measures.variable.x",
        },
        {
          symbol: "k",
          nameKey: "cooking-measures.variable.k",
        },
        {
          symbol: "y",
          nameKey: "cooking-measures.variable.y",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "cooking-measures.example.0",
      operation: "convert",
      inputs: {
        value: "1",
        source: "us-cup",
        target: "ml",
      },
      expected: "236.5882365",
      workingKey: "cooking-measures.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "cooking-measures.example.1",
      operation: "convert",
      inputs: {
        value: "1",
        source: "metric-cup",
        target: "ml",
      },
      expected: "250",
      workingKey: "cooking-measures.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "cooking-measures.example.2",
      operation: "convert",
      inputs: {
        value: "1",
        source: "australian-tablespoon",
        target: "ml",
      },
      expected: "20",
      workingKey: "cooking-measures.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "cooking-measures.visual.description",
      alternativeKey: "cooking-measures.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "cooking-measures.limits.title",
      bodyKey: "cooking-measures.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "cooking-measures.mistakes.title",
      bodyKey: "cooking-measures.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "cooking-measures.faq.q",
      answerKey: "cooking-measures.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "cooking-measures.sources.title",
      bodyKey: "cooking-measures.sources.body",
    },
  ],
};
