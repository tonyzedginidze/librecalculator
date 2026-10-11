import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "pressure",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.pressure.intro.title",
      bodyKey: "lesson.pressure.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.pressure.meaning.title",
      bodyKey: "lesson.pressure.meaning.body",
    },
    {
      id: "formula-pressure-si",
      kind: "formula",
      bodyKey: "lesson.pressure.formula.pressure-si",
      variables: [
        {
          symbol: "p",
          nameKey: "lesson.pressure.variable.item0",
        },
        {
          symbol: "F",
          nameKey: "lesson.pressure.variable.item1",
        },
        {
          symbol: "A",
          nameKey: "lesson.pressure.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.pressure.example.0",
      operation: "pressure-si",
      inputs: {
        force: "100",
        area: "2",
      },
      expected: "50",
      workingKey: "pressure.working.pressure-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.pressure.example.1",
      operation: "pressure-si",
      inputs: {
        force: "1000",
        area: "0.5",
      },
      expected: "2000",
      workingKey: "pressure.working.pressure-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.pressure.example.2",
      operation: "pressure-si",
      inputs: {
        force: "0",
        area: "3",
      },
      expected: "0",
      workingKey: "pressure.working.pressure-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "pressure.visual.description",
      alternativeKey: "pressure.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.pressure.mistakes.title",
      bodyKey: "lesson.pressure.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.pressure.limits.title",
      bodyKey: "lesson.pressure.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.pressure.sources.title",
      bodyKey: "lesson.pressure.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.pressure.faq.q",
      answerKey: "lesson.pressure.faq.a",
    },
  ],
};
