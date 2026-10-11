import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "energy",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.energy.intro.title",
      bodyKey: "lesson.energy.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.energy.meaning.title",
      bodyKey: "lesson.energy.meaning.body",
    },
    {
      id: "formula-energy-si",
      kind: "formula",
      bodyKey: "lesson.energy.formula.energy-si",
      variables: [
        {
          symbol: "Eₖ",
          nameKey: "lesson.energy.variable.item0",
        },
        {
          symbol: "m",
          nameKey: "lesson.energy.variable.item1",
        },
        {
          symbol: "v",
          nameKey: "lesson.energy.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.energy.example.0",
      operation: "energy-si",
      inputs: {
        mass: "2",
        speed: "3",
      },
      expected: "9",
      workingKey: "energy.working.energy-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.energy.example.1",
      operation: "energy-si",
      inputs: {
        mass: "10",
        speed: "0",
      },
      expected: "0",
      workingKey: "energy.working.energy-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.energy.example.2",
      operation: "energy-si",
      inputs: {
        mass: "4",
        speed: "5",
      },
      expected: "50",
      workingKey: "energy.working.energy-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "energy.visual.description",
      alternativeKey: "energy.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.energy.mistakes.title",
      bodyKey: "lesson.energy.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.energy.limits.title",
      bodyKey: "lesson.energy.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.energy.sources.title",
      bodyKey: "lesson.energy.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.energy.faq.q",
      answerKey: "lesson.energy.faq.a",
    },
  ],
};
