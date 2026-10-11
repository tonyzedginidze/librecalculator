import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "confidence-interval",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.confidence-interval.intro.title",
      bodyKey: "lesson.confidence-interval.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.confidence-interval.meaning.title",
      bodyKey: "lesson.confidence-interval.meaning.body",
    },
    {
      id: "formula-normal-interval",
      kind: "formula",
      bodyKey: "lesson.confidence-interval.formula.normal-interval",
      variables: [
        {
          symbol: "E",
          nameKey: "lesson.confidence-interval.variable.item0",
        },
        {
          symbol: "x̄",
          nameKey: "lesson.confidence-interval.variable.item1",
        },
        {
          symbol: "σ",
          nameKey: "lesson.confidence-interval.variable.item2",
        },
        {
          symbol: "n",
          nameKey: "lesson.confidence-interval.variable.item3",
        },
        {
          symbol: "z",
          nameKey: "lesson.confidence-interval.variable.item4",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.confidence-interval.example.0",
      operation: "normal-interval",
      inputs: {
        mean: "100",
        sigma: "10",
        count: "25",
        critical: "2",
      },
      expected: "4",
      workingKey: "confidence-interval.working.normal-interval",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.confidence-interval.example.1",
      operation: "normal-interval",
      inputs: {
        mean: "20",
        sigma: "6",
        count: "9",
        critical: "2",
      },
      expected: "4",
      workingKey: "confidence-interval.working.normal-interval",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.confidence-interval.example.2",
      operation: "normal-interval",
      inputs: {
        mean: "0",
        sigma: "2",
        count: "4",
        critical: "1",
      },
      expected: "1",
      workingKey: "confidence-interval.working.normal-interval",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "confidence-interval.visual.description",
      alternativeKey: "confidence-interval.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.confidence-interval.mistakes.title",
      bodyKey: "lesson.confidence-interval.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.confidence-interval.limits.title",
      bodyKey: "lesson.confidence-interval.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.confidence-interval.sources.title",
      bodyKey: "lesson.confidence-interval.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.confidence-interval.faq.q",
      answerKey: "lesson.confidence-interval.faq.a",
    },
  ],
};
