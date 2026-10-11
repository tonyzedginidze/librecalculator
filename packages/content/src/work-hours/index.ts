import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "work-hours",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.work-hours.intro.title",
      bodyKey: "lesson.work-hours.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.work-hours.meaning.title",
      bodyKey: "lesson.work-hours.meaning.body",
    },
    {
      id: "formula-paid-hours",
      kind: "formula",
      bodyKey: "lesson.work-hours.formula.paid-hours",
      variables: [
        {
          symbol: "H",
          nameKey: "lesson.work-hours.variable.item0",
        },
        {
          symbol: "s",
          nameKey: "lesson.work-hours.variable.item1",
        },
        {
          symbol: "e",
          nameKey: "lesson.work-hours.variable.item2",
        },
        {
          symbol: "n",
          nameKey: "lesson.work-hours.variable.item3",
        },
        {
          symbol: "b",
          nameKey: "lesson.work-hours.variable.item4",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.work-hours.example.0",
      operation: "paid-hours",
      inputs: {
        start: "09:00",
        end: "17:00",
        break: "30",
        overnight: "same-day",
      },
      expected: "7.5",
      workingKey: "work-hours.working.paid-hours",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.work-hours.example.1",
      operation: "paid-hours",
      inputs: {
        start: "22:00",
        end: "06:00",
        break: "0",
        overnight: "next-day",
      },
      expected: "8",
      workingKey: "work-hours.working.paid-hours",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.work-hours.example.2",
      operation: "paid-hours",
      inputs: {
        start: "10:00",
        end: "12:15",
        break: "15",
        overnight: "same-day",
      },
      expected: "2",
      workingKey: "work-hours.working.paid-hours",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "work-hours.visual.description",
      alternativeKey: "work-hours.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.work-hours.mistakes.title",
      bodyKey: "lesson.work-hours.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.work-hours.limits.title",
      bodyKey: "lesson.work-hours.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.work-hours.sources.title",
      bodyKey: "lesson.work-hours.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.work-hours.faq.q",
      answerKey: "lesson.work-hours.faq.a",
    },
  ],
};
