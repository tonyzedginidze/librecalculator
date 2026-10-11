import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "macros",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.macros.intro.title",
      bodyKey: "lesson.macros.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.macros.method.title",
      bodyKey: "lesson.macros.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.macros.formula",
      variables: [
        {
          symbol: "E",
          nameKey: "macros.field.calories",
        },
        {
          symbol: "p",
          nameKey: "macros.field.protein",
        },
        {
          symbol: "c",
          nameKey: "macros.field.carbohydrate",
        },
        {
          symbol: "f",
          nameKey: "macros.field.fat",
        },
        {
          symbol: "A",
          nameKey: "macros.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.macros.example.1",
      operation: "protein-grams",
      inputs: {
        calories: "1800",
        protein: "20",
        carbohydrate: "50",
        fat: "30",
        age: "30",
      },
      expected: "90",
      workingKey: "macros.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.macros.example.2",
      operation: "carbohydrate-grams",
      inputs: {
        calories: "1800",
        protein: "20",
        carbohydrate: "50",
        fat: "30",
        age: "30",
      },
      expected: "225",
      workingKey: "macros.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.macros.example.3",
      operation: "fat-grams",
      inputs: {
        calories: "1800",
        protein: "20",
        carbohydrate: "50",
        fat: "30",
        age: "30",
      },
      expected: "60",
      workingKey: "macros.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "macros.visual.description",
      alternativeKey: "macros.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.macros.mistakes.title",
      bodyKey: "lesson.macros.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.macros.limits.title",
      bodyKey: "lesson.macros.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.macros.faq.q",
      answerKey: "lesson.macros.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.macros.sources.title",
      bodyKey: "lesson.macros.sources.body",
    },
  ],
};
