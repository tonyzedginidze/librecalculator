import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "temperature",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "temperature.intro.title",
      bodyKey: "temperature.intro.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "temperature.formula",
      variables: [
        {
          symbol: "C",
          nameKey: "temperature.variable.c",
        },
        {
          symbol: "F",
          nameKey: "temperature.variable.f",
        },
        {
          symbol: "K",
          nameKey: "temperature.variable.k",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "temperature.example.0",
      operation: "convert",
      inputs: {
        value: "0",
        source: "c",
        target: "f",
      },
      expected: "32",
      workingKey: "temperature.working.convert",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "temperature.example.1",
      operation: "convert",
      inputs: {
        value: "100",
        source: "c",
        target: "k",
      },
      expected: "373.15",
      workingKey: "temperature.working.convert",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "temperature.example.2",
      operation: "convert",
      inputs: {
        value: "-459.67",
        source: "f",
        target: "k",
      },
      expected: "0",
      workingKey: "temperature.working.convert",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "temperature.visual.description",
      alternativeKey: "temperature.visual.alternative",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "temperature.limits.title",
      bodyKey: "temperature.limits.body",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "temperature.mistakes.title",
      bodyKey: "temperature.mistakes.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "temperature.faq.q",
      answerKey: "temperature.faq.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "temperature.sources.title",
      bodyKey: "temperature.sources.body",
    },
  ],
};
