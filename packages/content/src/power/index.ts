import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "power",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.power.intro.title",
      bodyKey: "lesson.power.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.power.meaning.title",
      bodyKey: "lesson.power.meaning.body",
    },
    {
      id: "formula-power-si",
      kind: "formula",
      bodyKey: "lesson.power.formula.power-si",
      variables: [
        {
          symbol: "P",
          nameKey: "lesson.power.variable.item0",
        },
        {
          symbol: "E",
          nameKey: "lesson.power.variable.item1",
        },
        {
          symbol: "t",
          nameKey: "lesson.power.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.power.example.0",
      operation: "power-si",
      inputs: {
        energy: "1000",
        time: "10",
      },
      expected: "100",
      workingKey: "power.working.power-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.power.example.1",
      operation: "power-si",
      inputs: {
        energy: "-60",
        time: "3",
      },
      expected: "-20",
      workingKey: "power.working.power-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.power.example.2",
      operation: "power-si",
      inputs: {
        energy: "0",
        time: "5",
      },
      expected: "0",
      workingKey: "power.working.power-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "power.visual.description",
      alternativeKey: "power.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.power.mistakes.title",
      bodyKey: "lesson.power.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.power.limits.title",
      bodyKey: "lesson.power.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.power.sources.title",
      bodyKey: "lesson.power.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.power.faq.q",
      answerKey: "lesson.power.faq.a",
    },
  ],
};
