import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "countdown",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.countdown.intro.title",
      bodyKey: "lesson.countdown.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.countdown.meaning.title",
      bodyKey: "lesson.countdown.meaning.body",
    },
    {
      id: "formula-days-until",
      kind: "formula",
      bodyKey: "lesson.countdown.formula.days-until",
      variables: [
        {
          symbol: "D",
          nameKey: "lesson.countdown.variable.item0",
        },
        {
          symbol: "N",
          nameKey: "lesson.countdown.variable.item1",
        },
        {
          symbol: "T",
          nameKey: "lesson.countdown.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.countdown.example.0",
      operation: "days-until",
      inputs: {
        reference: "2024-12-20",
        target: "2025-01-01",
      },
      expected: "12",
      workingKey: "countdown.working.days-until",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.countdown.example.1",
      operation: "days-until",
      inputs: {
        reference: "2024-01-01",
        target: "2024-01-01",
      },
      expected: "0",
      workingKey: "countdown.working.days-until",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.countdown.example.2",
      operation: "days-until",
      inputs: {
        reference: "2024-03-01",
        target: "2024-02-28",
      },
      expected: "-2",
      workingKey: "countdown.working.days-until",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "countdown.visual.description",
      alternativeKey: "countdown.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.countdown.mistakes.title",
      bodyKey: "lesson.countdown.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.countdown.limits.title",
      bodyKey: "lesson.countdown.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.countdown.sources.title",
      bodyKey: "lesson.countdown.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.countdown.faq.q",
      answerKey: "lesson.countdown.faq.a",
    },
  ],
};
