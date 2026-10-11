import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "date-difference",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.date-difference.intro.title",
      bodyKey: "lesson.date-difference.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.date-difference.meaning.title",
      bodyKey: "lesson.date-difference.meaning.body",
    },
    {
      id: "formula-elapsed-days",
      kind: "formula",
      bodyKey: "lesson.date-difference.formula.elapsed-days",
      variables: [
        {
          symbol: "D",
          nameKey: "lesson.date-difference.variable.item0",
        },
        {
          symbol: "S",
          nameKey: "lesson.date-difference.variable.item1",
        },
        {
          symbol: "E",
          nameKey: "lesson.date-difference.variable.item2",
        },
      ],
    },
    {
      id: "formula-inclusive-days",
      kind: "formula",
      bodyKey: "lesson.date-difference.formula.inclusive-days",
      variables: [
        {
          symbol: "D",
          nameKey: "lesson.date-difference.variable.item0",
        },
        {
          symbol: "S",
          nameKey: "lesson.date-difference.variable.item1",
        },
        {
          symbol: "E",
          nameKey: "lesson.date-difference.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.date-difference.example.0",
      operation: "elapsed-days",
      inputs: {
        start: "2024-02-28",
        end: "2024-03-01",
      },
      expected: "2",
      workingKey: "date-difference.working.elapsed-days",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.date-difference.example.1",
      operation: "elapsed-days",
      inputs: {
        start: "2024-03-01",
        end: "2024-02-28",
      },
      expected: "-2",
      workingKey: "date-difference.working.elapsed-days",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.date-difference.example.2",
      operation: "inclusive-days",
      inputs: {
        start: "2024-02-28",
        end: "2024-03-01",
      },
      expected: "3",
      workingKey: "date-difference.working.inclusive-days",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "date-difference.visual.description",
      alternativeKey: "date-difference.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.date-difference.mistakes.title",
      bodyKey: "lesson.date-difference.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.date-difference.limits.title",
      bodyKey: "lesson.date-difference.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.date-difference.sources.title",
      bodyKey: "lesson.date-difference.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.date-difference.faq.q",
      answerKey: "lesson.date-difference.faq.a",
    },
  ],
};
