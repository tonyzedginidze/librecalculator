import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "water-intake",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.water-intake.intro.title",
      bodyKey: "lesson.water-intake.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.water-intake.method.title",
      bodyKey: "lesson.water-intake.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.water-intake.formula",
      variables: [
        {
          symbol: "w",
          nameKey: "water-intake.field.weight",
        },
        {
          symbol: "r",
          nameKey: "water-intake.field.rate",
        },
        {
          symbol: "A",
          nameKey: "water-intake.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.water-intake.example.1",
      operation: "water-volume",
      inputs: {
        weight: "70",
        rate: "30",
        age: "30",
      },
      expected: "2.1",
      workingKey: "water-intake.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.water-intake.example.2",
      operation: "water-volume",
      inputs: {
        weight: "80",
        rate: "25",
        age: "40",
      },
      expected: "2",
      workingKey: "water-intake.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.water-intake.example.3",
      operation: "water-volume",
      inputs: {
        weight: "60",
        rate: "40",
        age: "50",
      },
      expected: "2.4",
      workingKey: "water-intake.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "water-intake.visual.description",
      alternativeKey: "water-intake.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.water-intake.mistakes.title",
      bodyKey: "lesson.water-intake.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.water-intake.limits.title",
      bodyKey: "lesson.water-intake.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.water-intake.faq.q",
      answerKey: "lesson.water-intake.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.water-intake.sources.title",
      bodyKey: "lesson.water-intake.sources.body",
    },
  ],
};
