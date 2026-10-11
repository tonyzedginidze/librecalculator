import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "ratio",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.ratio.intro.title",
      bodyKey: "lesson.ratio.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.ratio.meaning.title",
      bodyKey: "lesson.ratio.meaning.body",
    },
    {
      id: "formula-quotient",
      kind: "formula",
      bodyKey: "lesson.ratio.formula.quotient",
      variables: [
        {
          symbol: "q",
          nameKey: "lesson.ratio.variable.quotient",
        },
        {
          symbol: "A",
          nameKey: "lesson.ratio.variable.first",
        },
        {
          symbol: "B",
          nameKey: "lesson.ratio.variable.second",
        },
      ],
    },
    {
      id: "formula-scale-ratio",
      kind: "formula",
      bodyKey: "lesson.ratio.formula.scale-ratio",
      variables: [
        {
          symbol: "B′",
          nameKey: "lesson.ratio.variable.newSecond",
        },
        {
          symbol: "A′",
          nameKey: "lesson.ratio.variable.newFirst",
        },
        {
          symbol: "A",
          nameKey: "lesson.ratio.variable.first",
        },
        {
          symbol: "B",
          nameKey: "lesson.ratio.variable.second",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.ratio.example.0",
      operation: "quotient",
      inputs: {
        first: "2",
        second: "4",
      },
      expected: "0.5",
      workingKey: "ratio.working.quotient",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.ratio.example.1",
      operation: "scale-ratio",
      inputs: {
        first: "2",
        second: "3",
        target: "10",
      },
      expected: "15",
      workingKey: "ratio.working.scale-ratio",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.ratio.example.2",
      operation: "quotient",
      inputs: {
        first: "0",
        second: "5",
      },
      expected: "0",
      workingKey: "ratio.working.quotient",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "ratio.visual.description",
      alternativeKey: "ratio.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.ratio.mistakes.title",
      bodyKey: "lesson.ratio.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.ratio.limits.title",
      bodyKey: "lesson.ratio.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.ratio.sources.title",
      bodyKey: "lesson.ratio.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.ratio.faq.q",
      answerKey: "lesson.ratio.faq.a",
    },
  ],
};
