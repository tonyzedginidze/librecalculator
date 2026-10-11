import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "baking-ratios",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "baking-ratios.intro.title",
      bodyKey: "baking-ratios.intro.body",
    },
    {
      id: "baker-percent-formula",
      kind: "formula",
      bodyKey: "baking-ratios.formula.baker-percent",
      variables: [
        {
          symbol: "p",
          nameKey: "baking-ratios.variable.percentage",
          unitKey: "baking-ratios.answer.percent",
        },
        {
          symbol: "m",
          nameKey: "baking-ratios.field.ingredient",
          unitKey: "baking-ratios.answer.gram",
        },
        {
          symbol: "F",
          nameKey: "baking-ratios.field.flour",
          unitKey: "baking-ratios.answer.gram",
        },
      ],
    },
    {
      id: "baker-percent-example",
      kind: "example",
      titleKey: "baking-ratios.example.baker-percent",
      operation: "baker-percent",
      inputs: {
        ingredient: "325",
        flour: "500",
      },
      expected: "65",
      workingKey: "baking-ratios.working.baker-percent",
    },
    {
      id: "ingredient-mass-formula",
      kind: "formula",
      bodyKey: "baking-ratios.formula.ingredient-mass",
      variables: [
        {
          symbol: "m",
          nameKey: "baking-ratios.variable.ingredient",
          unitKey: "baking-ratios.answer.gram",
        },
        {
          symbol: "F",
          nameKey: "baking-ratios.field.flour",
          unitKey: "baking-ratios.answer.gram",
        },
        {
          symbol: "p",
          nameKey: "baking-ratios.field.percentage",
          unitKey: "baking-ratios.answer.percent",
        },
      ],
    },
    {
      id: "ingredient-mass-example",
      kind: "example",
      titleKey: "baking-ratios.example.ingredient-mass",
      operation: "ingredient-mass",
      inputs: {
        flour: "500",
        percentage: "65",
      },
      expected: "325",
      workingKey: "baking-ratios.working.ingredient-mass",
    },
    {
      id: "flour-mass-formula",
      kind: "formula",
      bodyKey: "baking-ratios.formula.flour-mass",
      variables: [
        {
          symbol: "F",
          nameKey: "baking-ratios.variable.flour",
          unitKey: "baking-ratios.answer.gram",
        },
        {
          symbol: "m",
          nameKey: "baking-ratios.field.ingredient",
          unitKey: "baking-ratios.answer.gram",
        },
        {
          symbol: "p",
          nameKey: "baking-ratios.field.percentage",
          unitKey: "baking-ratios.answer.percent",
        },
      ],
    },
    {
      id: "flour-mass-example",
      kind: "example",
      titleKey: "baking-ratios.example.flour-mass",
      operation: "flour-mass",
      inputs: {
        ingredient: "325",
        percentage: "65",
      },
      expected: "500",
      workingKey: "baking-ratios.working.flour-mass",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "baking-ratios.visual.description",
      alternativeKey: "baking-ratios.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "baking-ratios.mistakes.title",
      bodyKey: "baking-ratios.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "baking-ratios.limits.title",
      bodyKey: "baking-ratios.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "baking-ratios.faq.q",
      answerKey: "baking-ratios.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "baking-ratios.sources.title",
      bodyKey: "baking-ratios.sources.body",
    },
  ],
};
