import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "average",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.average.intro.title",
      bodyKey: "lesson.average.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.average.meaning.title",
      bodyKey: "lesson.average.meaning.body",
    },
    {
      id: "formula-mean",
      kind: "formula",
      bodyKey: "lesson.average.formula.mean",
      variables: [
        {
          symbol: "x̄",
          nameKey: "lesson.average.variable.mean",
        },
        {
          symbol: "xᵢ",
          nameKey: "lesson.average.variable.value",
        },
        {
          symbol: "n",
          nameKey: "lesson.average.variable.count",
        },
      ],
    },
    {
      id: "formula-median",
      kind: "formula",
      bodyKey: "lesson.average.formula.median",
      variables: [
        {
          symbol: "M",
          nameKey: "lesson.average.variable.median",
        },
        {
          symbol: "x₍₁₎ … x₍ₙ₎",
          nameKey: "lesson.average.variable.sorted",
        },
        {
          symbol: "n",
          nameKey: "lesson.average.variable.count",
        },
      ],
    },
    {
      id: "formula-mode",
      kind: "formula",
      bodyKey: "lesson.average.formula.mode",
      variables: [
        {
          symbol: "Mo",
          nameKey: "lesson.average.variable.mode",
        },
        {
          symbol: "xᵢ",
          nameKey: "lesson.average.variable.value",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.average.example.0",
      operation: "mean",
      inputs: {
        values: "2;4;6",
      },
      expected: "4",
      workingKey: "average.working.mean",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.average.example.1",
      operation: "median",
      inputs: {
        values: "1;2;8;9",
      },
      expected: "5",
      workingKey: "average.working.median",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.average.example.2",
      operation: "mode",
      inputs: {
        values: "2;4;4;6",
      },
      expected: "4",
      workingKey: "average.working.mode",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "average.visual.description",
      alternativeKey: "average.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.average.mistakes.title",
      bodyKey: "lesson.average.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.average.limits.title",
      bodyKey: "lesson.average.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.average.sources.title",
      bodyKey: "lesson.average.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.average.faq.q",
      answerKey: "lesson.average.faq.a",
    },
  ],
};
