import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "z-score",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.z-score.intro.title",
      bodyKey: "lesson.z-score.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.z-score.meaning.title",
      bodyKey: "lesson.z-score.meaning.body",
    },
    {
      id: "formula-standard-score",
      kind: "formula",
      bodyKey: "lesson.z-score.formula.standard-score",
      variables: [
        {
          symbol: "z",
          nameKey: "lesson.z-score.variable.item0",
        },
        {
          symbol: "x",
          nameKey: "lesson.z-score.variable.item1",
        },
        {
          symbol: "μ",
          nameKey: "lesson.z-score.variable.item2",
        },
        {
          symbol: "σ",
          nameKey: "lesson.z-score.variable.item3",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.z-score.example.0",
      operation: "standard-score",
      inputs: {
        value: "85",
        mean: "70",
        deviation: "10",
      },
      expected: "1.5",
      workingKey: "z-score.working.standard-score",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.z-score.example.1",
      operation: "standard-score",
      inputs: {
        value: "40",
        mean: "50",
        deviation: "5",
      },
      expected: "-2",
      workingKey: "z-score.working.standard-score",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.z-score.example.2",
      operation: "standard-score",
      inputs: {
        value: "10",
        mean: "10",
        deviation: "2",
      },
      expected: "0",
      workingKey: "z-score.working.standard-score",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "z-score.visual.description",
      alternativeKey: "z-score.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.z-score.mistakes.title",
      bodyKey: "lesson.z-score.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.z-score.limits.title",
      bodyKey: "lesson.z-score.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.z-score.sources.title",
      bodyKey: "lesson.z-score.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.z-score.faq.q",
      answerKey: "lesson.z-score.faq.a",
    },
  ],
};
