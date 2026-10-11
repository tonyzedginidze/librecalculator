import type { Lesson } from "../schema";

const servings = [
  {
    symbol: "s₁",
    nameKey: "recipe-scaling.field.originalServings",
    unitKey: "recipe-scaling.symbol.serving",
  },
  {
    symbol: "s₂",
    nameKey: "recipe-scaling.field.targetServings",
    unitKey: "recipe-scaling.symbol.serving",
  },
];
const amounts = [
  { symbol: "Q", nameKey: "recipe-scaling.variable.quantity" },
  { symbol: "Q′", nameKey: "recipe-scaling.variable.scaled" },
];

export const lesson: Lesson = {
  calculatorId: "recipe-scaling",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "recipe-scaling.intro.title",
      bodyKey: "recipe-scaling.intro.body",
    },
    {
      id: "recipe-scale-formula",
      kind: "formula",
      bodyKey: "recipe-scaling.formula.recipe-scale",
      variables: [...amounts, ...servings],
    },
    {
      id: "recipe-scale-example",
      kind: "example",
      titleKey: "recipe-scaling.example.recipe-scale",
      operation: "recipe-scale",
      inputs: {
        quantity: "250",
        originalServings: "4",
        targetServings: "12",
      },
      expected: "750",
      workingKey: "recipe-scaling.working.recipe-scale",
    },
    {
      id: "recipe-factor-formula",
      kind: "formula",
      bodyKey: "recipe-scaling.formula.recipe-factor",
      variables: [
        { symbol: "k", nameKey: "recipe-scaling.variable.factor" },
        ...servings,
      ],
    },
    {
      id: "recipe-factor-example",
      kind: "example",
      titleKey: "recipe-scaling.example.recipe-factor",
      operation: "recipe-factor",
      inputs: {
        originalServings: "4",
        targetServings: "12",
      },
      expected: "3",
      workingKey: "recipe-scaling.working.recipe-factor",
    },
    {
      id: "recipe-reverse-formula",
      kind: "formula",
      bodyKey: "recipe-scaling.formula.recipe-reverse",
      variables: [...amounts, ...servings],
    },
    {
      id: "recipe-reverse-example",
      kind: "example",
      titleKey: "recipe-scaling.example.recipe-reverse",
      operation: "recipe-reverse",
      inputs: {
        quantity: "750",
        originalServings: "4",
        targetServings: "12",
      },
      expected: "250",
      workingKey: "recipe-scaling.working.recipe-reverse",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "recipe-scaling.visual.description",
      alternativeKey: "recipe-scaling.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "recipe-scaling.mistakes.title",
      bodyKey: "recipe-scaling.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "recipe-scaling.limits.title",
      bodyKey: "recipe-scaling.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "recipe-scaling.faq.q",
      answerKey: "recipe-scaling.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "recipe-scaling.sources.title",
      bodyKey: "recipe-scaling.sources.body",
    },
  ],
};
