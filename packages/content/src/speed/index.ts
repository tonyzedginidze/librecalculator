import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "speed",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.speed.intro.title",
      bodyKey: "lesson.speed.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.speed.meaning.title",
      bodyKey: "lesson.speed.meaning.body",
    },
    {
      id: "formula-speed-si",
      kind: "formula",
      bodyKey: "lesson.speed.formula.speed-si",
      variables: [
        {
          symbol: "v",
          nameKey: "lesson.speed.variable.item0",
        },
        {
          symbol: "d",
          nameKey: "lesson.speed.variable.item1",
        },
        {
          symbol: "t",
          nameKey: "lesson.speed.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.speed.example.0",
      operation: "speed-si",
      inputs: {
        distance: "120",
        time: "10",
      },
      expected: "12",
      workingKey: "speed.working.speed-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.speed.example.1",
      operation: "speed-si",
      inputs: {
        distance: "0",
        time: "5",
      },
      expected: "0",
      workingKey: "speed.working.speed-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.speed.example.2",
      operation: "speed-si",
      inputs: {
        distance: "1500",
        time: "300",
      },
      expected: "5",
      workingKey: "speed.working.speed-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "speed.visual.description",
      alternativeKey: "speed.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.speed.mistakes.title",
      bodyKey: "lesson.speed.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.speed.limits.title",
      bodyKey: "lesson.speed.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.speed.sources.title",
      bodyKey: "lesson.speed.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.speed.faq.q",
      answerKey: "lesson.speed.faq.a",
    },
  ],
};
