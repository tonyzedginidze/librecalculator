import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "bmi",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.bmi.intro.title",
      bodyKey: "lesson.bmi.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.bmi.method.title",
      bodyKey: "lesson.bmi.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.bmi.formula",
      variables: [
        {
          symbol: "w",
          nameKey: "bmi.field.weight",
        },
        {
          symbol: "h",
          nameKey: "bmi.field.height",
        },
        {
          symbol: "A",
          nameKey: "bmi.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.bmi.example.1",
      operation: "bmi",
      inputs: {
        weight: "70",
        height: "200",
        age: "30",
      },
      expected: "17.5",
      workingKey: "bmi.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.bmi.example.2",
      operation: "bmi",
      inputs: {
        weight: "64",
        height: "160",
        age: "40",
      },
      expected: "25",
      workingKey: "bmi.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.bmi.example.3",
      operation: "bmi",
      inputs: {
        weight: "81",
        height: "180",
        age: "50",
      },
      expected: "25",
      workingKey: "bmi.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "bmi.visual.description",
      alternativeKey: "bmi.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.bmi.mistakes.title",
      bodyKey: "lesson.bmi.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.bmi.limits.title",
      bodyKey: "lesson.bmi.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.bmi.faq.q",
      answerKey: "lesson.bmi.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.bmi.sources.title",
      bodyKey: "lesson.bmi.sources.body",
    },
  ],
};
