import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "time-zone",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.time-zone.intro.title",
      bodyKey: "lesson.time-zone.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.time-zone.meaning.title",
      bodyKey: "lesson.time-zone.meaning.body",
    },
    {
      id: "formula-fixed-offset",
      kind: "formula",
      bodyKey: "lesson.time-zone.formula.fixed-offset",
      variables: [
        {
          symbol: "R",
          nameKey: "lesson.time-zone.variable.item0",
        },
        {
          symbol: "h",
          nameKey: "lesson.time-zone.variable.item1",
        },
        {
          symbol: "m",
          nameKey: "lesson.time-zone.variable.item2",
        },
        {
          symbol: "o₁",
          nameKey: "lesson.time-zone.variable.item3",
        },
        {
          symbol: "o₂",
          nameKey: "lesson.time-zone.variable.item4",
        },
        {
          symbol: "t",
          nameKey: "lesson.time-zone.variable.item5",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.time-zone.example.0",
      operation: "fixed-offset",
      inputs: {
        hour: "23",
        minute: "30",
        sourceOffset: "utc",
        targetOffset: "utc-plus-2",
      },
      expected: "90",
      workingKey: "time-zone.working.fixed-offset",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.time-zone.example.1",
      operation: "fixed-offset",
      inputs: {
        hour: "1",
        minute: "0",
        sourceOffset: "utc-plus-2",
        targetOffset: "utc",
      },
      expected: "1380",
      workingKey: "time-zone.working.fixed-offset",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.time-zone.example.2",
      operation: "fixed-offset",
      inputs: {
        hour: "12",
        minute: "0",
        sourceOffset: "utc",
        targetOffset: "utc-plus-5-30",
      },
      expected: "1050",
      workingKey: "time-zone.working.fixed-offset",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "time-zone.visual.description",
      alternativeKey: "time-zone.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.time-zone.mistakes.title",
      bodyKey: "lesson.time-zone.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.time-zone.limits.title",
      bodyKey: "lesson.time-zone.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.time-zone.sources.title",
      bodyKey: "lesson.time-zone.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.time-zone.faq.q",
      answerKey: "lesson.time-zone.faq.a",
    },
  ],
};
