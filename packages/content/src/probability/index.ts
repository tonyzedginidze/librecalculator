import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "probability",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.probability.intro.title",
      bodyKey: "lesson.probability.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.probability.meaning.title",
      bodyKey: "lesson.probability.meaning.body",
    },
    {
      id: "formula-complement",
      kind: "formula",
      bodyKey: "lesson.probability.formula.complement",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.probability.variable.item1",
        },
      ],
    },
    {
      id: "formula-independent-both",
      kind: "formula",
      bodyKey: "lesson.probability.formula.independent-both",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.probability.variable.item1",
        },
        {
          symbol: "B",
          nameKey: "lesson.probability.variable.item2",
        },
      ],
    },
    {
      id: "formula-event-union",
      kind: "formula",
      bodyKey: "lesson.probability.formula.event-union",
      variables: [
        {
          symbol: "A",
          nameKey: "lesson.probability.variable.item1",
        },
        {
          symbol: "B",
          nameKey: "lesson.probability.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.probability.example.0",
      operation: "complement",
      inputs: {
        first: "0.2",
      },
      expected: "0.8",
      workingKey: "probability.working.complement",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.probability.example.1",
      operation: "independent-both",
      inputs: {
        first: "0.5",
        second: "0.4",
      },
      expected: "0.2",
      workingKey: "probability.working.independent-both",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.probability.example.2",
      operation: "event-union",
      inputs: {
        first: "0.5",
        second: "0.4",
        intersection: "0.2",
      },
      expected: "0.7",
      workingKey: "probability.working.event-union",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "probability.visual.description",
      alternativeKey: "probability.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.probability.mistakes.title",
      bodyKey: "lesson.probability.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.probability.limits.title",
      bodyKey: "lesson.probability.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.probability.sources.title",
      bodyKey: "lesson.probability.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.probability.faq.q",
      answerKey: "lesson.probability.faq.a",
    },
  ],
};
