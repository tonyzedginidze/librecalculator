import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "bmr",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.bmr.intro.title",
      bodyKey: "lesson.bmr.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.bmr.method.title",
      bodyKey: "lesson.bmr.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.bmr.formula",
      variables: [
        {
          symbol: "w",
          nameKey: "bmr.field.weight",
        },
        {
          symbol: "h",
          nameKey: "bmr.field.height",
        },
        {
          symbol: "A",
          nameKey: "bmr.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.bmr.example.1",
      operation: "male-equation",
      inputs: {
        weight: "70",
        height: "180",
        age: "30",
      },
      expected: "1680",
      workingKey: "bmr.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.bmr.example.2",
      operation: "female-equation",
      inputs: {
        weight: "70",
        height: "180",
        age: "30",
      },
      expected: "1514",
      workingKey: "bmr.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.bmr.example.3",
      operation: "male-equation",
      inputs: {
        weight: "80",
        height: "180",
        age: "40",
      },
      expected: "1730",
      workingKey: "bmr.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "bmr.visual.description",
      alternativeKey: "bmr.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.bmr.mistakes.title",
      bodyKey: "lesson.bmr.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.bmr.limits.title",
      bodyKey: "lesson.bmr.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.bmr.faq.q",
      answerKey: "lesson.bmr.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.bmr.sources.title",
      bodyKey: "lesson.bmr.sources.body",
    },
  ],
};
