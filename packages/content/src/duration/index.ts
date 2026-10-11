import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "duration",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "duration.intro.title",
      bodyKey: "duration.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "duration.formula",
      variables: [
        {
          symbol: "x",
          nameKey: "duration.variable.x",
        },
        {
          symbol: "k",
          nameKey: "duration.variable.k",
        },
        {
          symbol: "y",
          nameKey: "duration.variable.y",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "duration.example.0",
      operation: "convert",
      inputs: {
        value: "1",
        source: "h",
        target: "min",
      },
      expected: "60",
      workingKey: "duration.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "duration.example.1",
      operation: "convert",
      inputs: {
        value: "2",
        source: "day",
        target: "h",
      },
      expected: "48",
      workingKey: "duration.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "duration.example.2",
      operation: "convert",
      inputs: {
        value: "1500",
        source: "ms",
        target: "s",
      },
      expected: "1.5",
      workingKey: "duration.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "duration.visual.description",
      alternativeKey: "duration.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "duration.limits.title",
      bodyKey: "duration.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "duration.mistakes.title",
      bodyKey: "duration.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "duration.faq.q",
      answerKey: "duration.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "duration.sources.title",
      bodyKey: "duration.sources.body",
    },
  ],
};
