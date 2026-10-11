import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "random-number",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.random-number.intro.title",
      bodyKey: "lesson.random-number.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.random-number.meaning.title",
      bodyKey: "lesson.random-number.meaning.body",
    },
    {
      id: "formula-seeded-integer",
      kind: "formula",
      bodyKey: "lesson.random-number.formula.seeded-integer",
      variables: [
        {
          symbol: "r",
          nameKey: "lesson.random-number.variable.result",
        },
        {
          symbol: "s",
          nameKey: "lesson.random-number.variable.seed",
        },
        {
          symbol: "s′",
          nameKey: "lesson.random-number.variable.nextSeed",
        },
        {
          symbol: "a",
          nameKey: "lesson.random-number.variable.min",
        },
        {
          symbol: "b",
          nameKey: "lesson.random-number.variable.max",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.random-number.example.0",
      operation: "seeded-integer",
      inputs: {
        minimum: "1",
        maximum: "6",
        seed: "1",
      },
      expected: "2",
      workingKey: "random-number.working.seeded-integer",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.random-number.example.1",
      operation: "seeded-integer",
      inputs: {
        minimum: "10",
        maximum: "10",
        seed: "5",
      },
      expected: "10",
      workingKey: "random-number.working.seeded-integer",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.random-number.example.2",
      operation: "seeded-integer",
      inputs: {
        minimum: "0",
        maximum: "9",
        seed: "2",
      },
      expected: "4",
      workingKey: "random-number.working.seeded-integer",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "random-number.visual.description",
      alternativeKey: "random-number.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.random-number.mistakes.title",
      bodyKey: "lesson.random-number.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.random-number.limits.title",
      bodyKey: "lesson.random-number.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.random-number.sources.title",
      bodyKey: "lesson.random-number.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.random-number.faq.q",
      answerKey: "lesson.random-number.faq.a",
    },
  ],
};
