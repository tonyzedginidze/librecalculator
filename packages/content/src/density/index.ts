import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "density",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.density.intro.title",
      bodyKey: "lesson.density.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.density.meaning.title",
      bodyKey: "lesson.density.meaning.body",
    },
    {
      id: "formula-density-si",
      kind: "formula",
      bodyKey: "lesson.density.formula.density-si",
      variables: [
        {
          symbol: "ρ",
          nameKey: "lesson.density.variable.item0",
        },
        {
          symbol: "m",
          nameKey: "lesson.density.variable.item1",
        },
        {
          symbol: "V",
          nameKey: "lesson.density.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.density.example.0",
      operation: "density-si",
      inputs: {
        mass: "10",
        volume: "2",
      },
      expected: "5",
      workingKey: "density.working.density-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.density.example.1",
      operation: "density-si",
      inputs: {
        mass: "1000",
        volume: "1",
      },
      expected: "1000",
      workingKey: "density.working.density-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.density.example.2",
      operation: "density-si",
      inputs: {
        mass: "0",
        volume: "3",
      },
      expected: "0",
      workingKey: "density.working.density-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "density.visual.description",
      alternativeKey: "density.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.density.mistakes.title",
      bodyKey: "lesson.density.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.density.limits.title",
      bodyKey: "lesson.density.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.density.sources.title",
      bodyKey: "lesson.density.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.density.faq.q",
      answerKey: "lesson.density.faq.a",
    },
  ],
};
