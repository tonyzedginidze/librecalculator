import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "test-score",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "test-score.intro.title",
      bodyKey: "test-score.intro.body",
    },
    {
      id: "test-percentage-formula",
      kind: "formula",
      bodyKey: "test-score.formula.test-percentage",
      variables: [
        {
          symbol: "s",
          nameKey: "test-score.symbol.s",
          unitKey: "test-score.answer.percent",
        },
        {
          symbol: "k",
          nameKey: "test-score.field.correct",
        },
        {
          symbol: "n",
          nameKey: "test-score.field.questions",
        },
      ],
    },
    {
      id: "test-percentage-example",
      kind: "example",
      titleKey: "test-score.example.test-percentage",
      operation: "test-percentage",
      inputs: {
        correct: "16",
        questions: "20",
      },
      expected: "80",
      workingKey: "test-score.working.test-percentage",
    },
    {
      id: "test-missed-formula",
      kind: "formula",
      bodyKey: "test-score.formula.test-missed",
      variables: [
        {
          symbol: "m",
          nameKey: "test-score.symbol.m",
        },
        {
          symbol: "n",
          nameKey: "test-score.field.questions",
        },
        {
          symbol: "k",
          nameKey: "test-score.field.correct",
        },
      ],
    },
    {
      id: "test-missed-example",
      kind: "example",
      titleKey: "test-score.example.test-missed",
      operation: "test-missed",
      inputs: {
        questions: "20",
        correct: "16",
      },
      expected: "4",
      workingKey: "test-score.working.test-missed",
    },
    {
      id: "test-needed-formula",
      kind: "formula",
      bodyKey: "test-score.formula.test-needed",
      variables: [
        {
          symbol: "k",
          nameKey: "test-score.symbol.k-min",
        },
        {
          symbol: "T",
          nameKey: "test-score.field.target",
          unitKey: "test-score.answer.percent",
        },
        {
          symbol: "n",
          nameKey: "test-score.field.questions",
        },
      ],
    },
    {
      id: "test-needed-example",
      kind: "example",
      titleKey: "test-score.example.test-needed",
      operation: "test-needed",
      inputs: {
        target: "80",
        questions: "20",
      },
      expected: "16",
      workingKey: "test-score.working.test-needed",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "test-score.visual.lesson",
      alternativeKey: "test-score.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "test-score.mistakes.title",
      bodyKey: "test-score.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "test-score.limits.title",
      bodyKey: "test-score.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "test-score.faq.q",
      answerKey: "test-score.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "test-score.sources.title",
      bodyKey: "test-score.sources.body",
    },
  ],
};
