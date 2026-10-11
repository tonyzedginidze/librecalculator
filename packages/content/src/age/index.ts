import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "age",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.age.intro.title",
      bodyKey: "lesson.age.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.age.meaning.title",
      bodyKey: "lesson.age.meaning.body",
    },
    {
      id: "formula-completed-years",
      kind: "formula",
      bodyKey: "lesson.age.formula.completed-years",
      variables: [
        { symbol: "A", nameKey: "lesson.age.variable.item0" },
        { symbol: "b", nameKey: "lesson.age.variable.item1" },
        { symbol: "y", nameKey: "lesson.age.variable.item2" },
        { symbol: "k", nameKey: "lesson.age.variable.item3" },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.age.example.0",
      operation: "completed-years",
      inputs: {
        birth: "2000-02-29",
        asof: "2024-02-29",
      },
      expected: "24",
      workingKey: "age.working.completed-years",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.age.example.1",
      operation: "completed-years",
      inputs: {
        birth: "2000-10-20",
        asof: "2024-10-19",
      },
      expected: "23",
      workingKey: "age.working.completed-years",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.age.example.2",
      operation: "completed-years",
      inputs: {
        birth: "2020-01-01",
        asof: "2020-01-01",
      },
      expected: "0",
      workingKey: "age.working.completed-years",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "age.visual.description",
      alternativeKey: "age.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.age.mistakes.title",
      bodyKey: "lesson.age.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.age.limits.title",
      bodyKey: "lesson.age.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.age.sources.title",
      bodyKey: "lesson.age.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.age.faq.q",
      answerKey: "lesson.age.faq.a",
    },
  ],
};
