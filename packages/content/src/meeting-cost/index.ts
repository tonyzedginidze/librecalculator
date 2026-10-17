import type { Lesson } from "../schema";

const meeting = {
  overhead: "1.3",
  hours: "2080",
  refocus: "0",
};

export const lesson: Lesson = {
  calculatorId: "meeting-cost",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.meeting-cost.intro.title",
      bodyKey: "lesson.meeting-cost.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.meeting-cost.method.title",
      bodyKey: "lesson.meeting-cost.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.meeting-cost.formula",
      variables: [
        {
          symbol: "R",
          nameKey: "lesson.meeting-cost.var.room",
          unitKey: "unit.usd",
        },
        { symbol: "n", nameKey: "meeting-cost.field.people" },
        {
          symbol: "S",
          nameKey: "meeting-cost.field.salary",
          unitKey: "unit.usd",
        },
        { symbol: "k", nameKey: "meeting-cost.field.overhead" },
        {
          symbol: "H",
          nameKey: "meeting-cost.field.hours",
          unitKey: "meeting-cost.unit.hours",
        },
        {
          symbol: "m",
          nameKey: "meeting-cost.field.minutes",
          unitKey: "meeting-cost.unit.minutes",
        },
        {
          symbol: "f",
          nameKey: "meeting-cost.field.refocus",
          unitKey: "meeting-cost.unit.minutes",
        },
        { symbol: "N", nameKey: "lesson.meeting-cost.var.count" },
        {
          symbol: "B",
          nameKey: "meeting-cost.field.budget",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.meeting-cost.example.1",
      operation: "meeting-cost",
      inputs: {
        ...meeting,
        attendees: "6x90000",
        minutes: "60",
        frequency: "weekly",
      },
      expected: "337.5",
      workingKey: "meeting-cost.working.meeting",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.meeting-cost.example.2",
      operation: "meeting-cost",
      inputs: {
        ...meeting,
        attendees: "1x144000;4x120000",
        minutes: "30",
        frequency: "daily",
        refocus: "10",
        overhead: "1.25",
      },
      expected: "250",
      workingKey: "meeting-cost.working.meeting-refocus",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.meeting-cost.example.3",
      operation: "meeting-cost",
      inputs: {
        ...meeting,
        attendees: "2x52000",
        minutes: "15",
        frequency: "once",
        overhead: "1",
      },
      expected: "12.5",
      workingKey: "meeting-cost.working.meeting",
    },
    {
      id: "example-4",
      kind: "example",
      titleKey: "lesson.meeting-cost.example.4",
      operation: "budget-minutes",
      inputs: {
        attendees: "8x104000",
        budget: "1000",
        overhead: "1.4",
        hours: "2080",
      },
      expected: "107",
      workingKey: "meeting-cost.working.budget",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "meeting-cost.visual.description",
      alternativeKey: "meeting-cost.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.meeting-cost.mistakes.title",
      bodyKey: "lesson.meeting-cost.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.meeting-cost.limits.title",
      bodyKey: "lesson.meeting-cost.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.meeting-cost.faq.q",
      answerKey: "lesson.meeting-cost.faq.a",
    },
    {
      id: "faq-2",
      kind: "faq",
      questionKey: "lesson.meeting-cost.faq2.q",
      answerKey: "lesson.meeting-cost.faq2.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.meeting-cost.sources.title",
      bodyKey: "lesson.meeting-cost.sources.body",
    },
    { id: "related-salary", kind: "related", calculatorId: "salary" },
  ],
};
