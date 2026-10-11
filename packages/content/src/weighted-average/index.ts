import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "weighted-average",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.weighted-average.intro.title",
      bodyKey: "lesson.weighted-average.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.weighted-average.meaning.title",
      bodyKey: "lesson.weighted-average.meaning.body",
    },
    {
      id: "formula-weighted-mean",
      kind: "formula",
      bodyKey: "lesson.weighted-average.formula.weighted-mean",
      variables: [
        {
          symbol: "x̄w",
          nameKey: "lesson.weighted-average.variable.item0",
        },
        {
          symbol: "xᵢ",
          nameKey: "lesson.weighted-average.variable.item1",
        },
        {
          symbol: "wᵢ",
          nameKey: "lesson.weighted-average.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.weighted-average.example.0",
      operation: "weighted-mean",
      inputs: {
        values: "10;20;30",
        weights: "1;2;1",
      },
      expected: "20",
      workingKey: "weighted-average.working.weighted-mean",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.weighted-average.example.1",
      operation: "weighted-mean",
      inputs: {
        values: "80;100",
        weights: "3;1",
      },
      expected: "85",
      workingKey: "weighted-average.working.weighted-mean",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.weighted-average.example.2",
      operation: "weighted-mean",
      inputs: {
        values: "5;100",
        weights: "1;0",
      },
      expected: "5",
      workingKey: "weighted-average.working.weighted-mean",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "weighted-average.visual.description",
      alternativeKey: "weighted-average.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.weighted-average.mistakes.title",
      bodyKey: "lesson.weighted-average.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.weighted-average.limits.title",
      bodyKey: "lesson.weighted-average.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.weighted-average.sources.title",
      bodyKey: "lesson.weighted-average.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.weighted-average.faq.q",
      answerKey: "lesson.weighted-average.faq.a",
    },
  ],
};
