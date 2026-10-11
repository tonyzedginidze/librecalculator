import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "standard-deviation",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.standard-deviation.intro.title",
      bodyKey: "lesson.standard-deviation.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.standard-deviation.meaning.title",
      bodyKey: "lesson.standard-deviation.meaning.body",
    },
    {
      id: "formula-population",
      kind: "formula",
      bodyKey: "lesson.standard-deviation.formula.population",
      variables: [
        {
          symbol: "σ",
          nameKey: "lesson.standard-deviation.variable.sigma",
        },
        {
          symbol: "xᵢ",
          nameKey: "lesson.standard-deviation.variable.value",
        },
        {
          symbol: "μ",
          nameKey: "lesson.standard-deviation.variable.mu",
        },
        {
          symbol: "n",
          nameKey: "lesson.standard-deviation.variable.count",
        },
      ],
    },
    {
      id: "formula-sample",
      kind: "formula",
      bodyKey: "lesson.standard-deviation.formula.sample",
      variables: [
        {
          symbol: "s",
          nameKey: "lesson.standard-deviation.variable.s",
        },
        {
          symbol: "xᵢ",
          nameKey: "lesson.standard-deviation.variable.value",
        },
        {
          symbol: "x̄",
          nameKey: "lesson.standard-deviation.variable.mean",
        },
        {
          symbol: "n",
          nameKey: "lesson.standard-deviation.variable.count",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.standard-deviation.example.0",
      operation: "population",
      inputs: {
        values: "2;4;4;4;5;5;7;9",
      },
      expected: "2",
      workingKey: "standard-deviation.working.population",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.standard-deviation.example.1",
      operation: "sample",
      inputs: {
        values: "1;3;5",
      },
      expected: "2",
      workingKey: "standard-deviation.working.sample",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.standard-deviation.example.2",
      operation: "population",
      inputs: {
        values: "7;7;7",
      },
      expected: "0",
      workingKey: "standard-deviation.working.population",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "standard-deviation.visual.description",
      alternativeKey: "standard-deviation.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.standard-deviation.mistakes.title",
      bodyKey: "lesson.standard-deviation.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.standard-deviation.limits.title",
      bodyKey: "lesson.standard-deviation.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.standard-deviation.sources.title",
      bodyKey: "lesson.standard-deviation.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.standard-deviation.faq.q",
      answerKey: "lesson.standard-deviation.faq.a",
    },
  ],
};
