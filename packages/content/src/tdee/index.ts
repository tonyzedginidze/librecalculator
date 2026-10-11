import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "tdee",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.tdee.intro.title",
      bodyKey: "lesson.tdee.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.tdee.method.title",
      bodyKey: "lesson.tdee.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.tdee.formula",
      variables: [
        {
          symbol: "R",
          nameKey: "tdee.field.resting",
        },
        {
          symbol: "f",
          nameKey: "tdee.field.factor",
        },
        {
          symbol: "A",
          nameKey: "tdee.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.tdee.example.1",
      operation: "daily-energy",
      inputs: {
        resting: "1600",
        factor: "1.5",
        age: "30",
      },
      expected: "2400",
      workingKey: "tdee.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.tdee.example.2",
      operation: "daily-energy",
      inputs: {
        resting: "1500",
        factor: "1",
        age: "40",
      },
      expected: "1500",
      workingKey: "tdee.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.tdee.example.3",
      operation: "daily-energy",
      inputs: {
        resting: "1800",
        factor: "2",
        age: "50",
      },
      expected: "3600",
      workingKey: "tdee.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "tdee.visual.description",
      alternativeKey: "tdee.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.tdee.mistakes.title",
      bodyKey: "lesson.tdee.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.tdee.limits.title",
      bodyKey: "lesson.tdee.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.tdee.faq.q",
      answerKey: "lesson.tdee.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.tdee.sources.title",
      bodyKey: "lesson.tdee.sources.body",
    },
  ],
};
