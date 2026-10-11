import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "salary",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.salary.intro.title",
      bodyKey: "lesson.salary.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.salary.method.title",
      bodyKey: "lesson.salary.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.salary.formula",
      variables: [
        {
          symbol: "A",
          nameKey: "salary.field.annual",
          unitKey: "unit.usd",
        },
        {
          symbol: "H",
          nameKey: "salary.field.hourly",
          unitKey: "unit.usd",
        },
        {
          symbol: "h",
          nameKey: "salary.field.hours",
        },
        {
          symbol: "w",
          nameKey: "salary.field.weeks",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.salary.example.1",
      operation: "annual-to-hourly",
      inputs: {
        pay: "52000",
        hours: "40",
        weeks: "52",
      },
      expected: "25",
      workingKey: "salary.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.salary.example.2",
      operation: "hourly-to-annual",
      inputs: {
        pay: "20",
        hours: "40",
        weeks: "52",
      },
      expected: "41600",
      workingKey: "salary.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.salary.example.3",
      operation: "annual-to-hourly",
      inputs: {
        pay: "12000",
        hours: "20",
        weeks: "50",
      },
      expected: "12",
      workingKey: "salary.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "salary.visual.description",
      alternativeKey: "salary.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.salary.mistakes.title",
      bodyKey: "lesson.salary.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.salary.limits.title",
      bodyKey: "lesson.salary.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.salary.faq.q",
      answerKey: "lesson.salary.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.salary.sources.title",
      bodyKey: "lesson.salary.sources.body",
    },
  ],
};
