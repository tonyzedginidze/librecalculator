import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "body-fat",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.body-fat.intro.title",
      bodyKey: "lesson.body-fat.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.body-fat.method.title",
      bodyKey: "lesson.body-fat.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.body-fat.formula",
      variables: [
        {
          symbol: "w",
          nameKey: "body-fat.field.weight",
        },
        {
          symbol: "h",
          nameKey: "body-fat.field.height",
        },
        {
          symbol: "A",
          nameKey: "body-fat.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.body-fat.example.1",
      operation: "male-regression",
      inputs: {
        weight: "80",
        height: "200",
        age: "30",
      },
      expected: "14.7",
      workingKey: "body-fat.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.body-fat.example.2",
      operation: "female-regression",
      inputs: {
        weight: "80",
        height: "200",
        age: "30",
      },
      expected: "25.5",
      workingKey: "body-fat.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.body-fat.example.3",
      operation: "male-regression",
      inputs: {
        weight: "100",
        height: "200",
        age: "40",
      },
      expected: "23",
      workingKey: "body-fat.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "body-fat.visual.description",
      alternativeKey: "body-fat.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.body-fat.mistakes.title",
      bodyKey: "lesson.body-fat.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.body-fat.limits.title",
      bodyKey: "lesson.body-fat.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.body-fat.faq.q",
      answerKey: "lesson.body-fat.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.body-fat.sources.title",
      bodyKey: "lesson.body-fat.sources.body",
    },
  ],
};
