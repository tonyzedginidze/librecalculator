import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "speed-conversion",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "speed-conversion.intro.title",
      bodyKey: "speed-conversion.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "speed-conversion.formula",
      variables: [
        {
          symbol: "x",
          nameKey: "speed-conversion.variable.x",
        },
        {
          symbol: "k",
          nameKey: "speed-conversion.variable.k",
        },
        {
          symbol: "y",
          nameKey: "speed-conversion.variable.y",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "speed-conversion.example.0",
      operation: "convert",
      inputs: {
        value: "36",
        source: "km-per-h",
        target: "m-per-s",
      },
      expected: "10",
      workingKey: "speed-conversion.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "speed-conversion.example.1",
      operation: "convert",
      inputs: {
        value: "60",
        source: "mi-per-h",
        target: "km-per-h",
      },
      expected: "96.56064",
      workingKey: "speed-conversion.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "speed-conversion.example.2",
      operation: "convert",
      inputs: {
        value: "1",
        source: "knot",
        target: "km-per-h",
      },
      expected: "1.852",
      workingKey: "speed-conversion.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "speed-conversion.visual.description",
      alternativeKey: "speed-conversion.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "speed-conversion.limits.title",
      bodyKey: "speed-conversion.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "speed-conversion.mistakes.title",
      bodyKey: "speed-conversion.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "speed-conversion.faq.q",
      answerKey: "speed-conversion.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "speed-conversion.sources.title",
      bodyKey: "speed-conversion.sources.body",
    },
  ],
};
