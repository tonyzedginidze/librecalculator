import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "mass",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "mass.intro.title",
      bodyKey: "mass.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "mass.formula",
      variables: [
        {
          symbol: "x",
          nameKey: "mass.variable.x",
        },
        {
          symbol: "k",
          nameKey: "mass.variable.k",
        },
        {
          symbol: "y",
          nameKey: "mass.variable.y",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "mass.example.0",
      operation: "convert",
      inputs: {
        value: "1",
        source: "lb",
        target: "kg",
      },
      expected: "0.45359237",
      workingKey: "mass.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "mass.example.1",
      operation: "convert",
      inputs: {
        value: "1",
        source: "kg",
        target: "g",
      },
      expected: "1000",
      workingKey: "mass.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "mass.example.2",
      operation: "convert",
      inputs: {
        value: "16",
        source: "oz",
        target: "lb",
      },
      expected: "1",
      workingKey: "mass.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "mass.visual.description",
      alternativeKey: "mass.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "mass.limits.title",
      bodyKey: "mass.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "mass.mistakes.title",
      bodyKey: "mass.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "mass.faq.q",
      answerKey: "mass.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "mass.sources.title",
      bodyKey: "mass.sources.body",
    },
  ],
};
