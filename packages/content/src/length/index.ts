import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "length",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "length.intro.title",
      bodyKey: "length.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "length.formula",
      variables: [
        {
          symbol: "x",
          nameKey: "length.variable.x",
        },
        {
          symbol: "k",
          nameKey: "length.variable.k",
        },
        {
          symbol: "y",
          nameKey: "length.variable.y",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "length.example.0",
      operation: "convert",
      inputs: {
        value: "1",
        source: "in",
        target: "m",
      },
      expected: "0.0254",
      workingKey: "length.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "length.example.1",
      operation: "convert",
      inputs: {
        value: "3",
        source: "ft",
        target: "m",
      },
      expected: "0.9144",
      workingKey: "length.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "length.example.2",
      operation: "convert",
      inputs: {
        value: "1",
        source: "mi",
        target: "km",
      },
      expected: "1.609344",
      workingKey: "length.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "length.visual.description",
      alternativeKey: "length.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "length.limits.title",
      bodyKey: "length.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "length.mistakes.title",
      bodyKey: "length.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "length.faq.q",
      answerKey: "length.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "length.sources.title",
      bodyKey: "length.sources.body",
    },
  ],
};
