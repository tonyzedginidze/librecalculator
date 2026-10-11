import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "fuel-economy",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.fuel-economy.intro.title",
      bodyKey: "lesson.fuel-economy.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.fuel-economy.meaning.title",
      bodyKey: "lesson.fuel-economy.meaning.body",
    },
    {
      id: "formula-litres-per-100km",
      kind: "formula",
      bodyKey: "lesson.fuel-economy.formula.litres-per-100km",
      variables: [
        {
          symbol: "C",
          nameKey: "lesson.fuel-economy.variable.consumption",
        },
        {
          symbol: "F",
          nameKey: "lesson.fuel-economy.variable.fuel",
        },
        {
          symbol: "D",
          nameKey: "lesson.fuel-economy.variable.distance",
        },
      ],
    },
    {
      id: "formula-kilometres-per-litre",
      kind: "formula",
      bodyKey: "lesson.fuel-economy.formula.kilometres-per-litre",
      variables: [
        {
          symbol: "E",
          nameKey: "lesson.fuel-economy.variable.efficiency",
        },
        {
          symbol: "D",
          nameKey: "lesson.fuel-economy.variable.distance",
        },
        {
          symbol: "F",
          nameKey: "lesson.fuel-economy.variable.fuel",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.fuel-economy.example.0",
      operation: "litres-per-100km",
      inputs: {
        distance: "500",
        fuel: "40",
      },
      expected: "8",
      workingKey: "fuel-economy.working.litres-per-100km",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.fuel-economy.example.1",
      operation: "kilometres-per-litre",
      inputs: {
        distance: "600",
        fuel: "40",
      },
      expected: "15",
      workingKey: "fuel-economy.working.kilometres-per-litre",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.fuel-economy.example.2",
      operation: "litres-per-100km",
      inputs: {
        distance: "200",
        fuel: "10",
      },
      expected: "5",
      workingKey: "fuel-economy.working.litres-per-100km",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "fuel-economy.visual.description",
      alternativeKey: "fuel-economy.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.fuel-economy.mistakes.title",
      bodyKey: "lesson.fuel-economy.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.fuel-economy.limits.title",
      bodyKey: "lesson.fuel-economy.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.fuel-economy.sources.title",
      bodyKey: "lesson.fuel-economy.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.fuel-economy.faq.q",
      answerKey: "lesson.fuel-economy.faq.a",
    },
  ],
};
