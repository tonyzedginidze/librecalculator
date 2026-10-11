import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "calories-per-serving",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "calories-per-serving.intro.title",
      bodyKey: "calories-per-serving.intro.body",
    },
    {
      id: "portion-calories-formula",
      kind: "formula",
      bodyKey: "calories-per-serving.formula.portion-calories",
      variables: [
        {
          symbol: "e",
          nameKey: "calories-per-serving.variable.portion",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "E",
          nameKey: "calories-per-serving.field.totalCalories",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "n",
          nameKey: "calories-per-serving.field.servings",
          unitKey: "calories-per-serving.answer.servings",
        },
      ],
    },
    {
      id: "portion-calories-example",
      kind: "example",
      titleKey: "calories-per-serving.example.portion-calories",
      operation: "portion-calories",
      inputs: {
        totalCalories: "1000",
        servings: "4",
      },
      expected: "250",
      workingKey: "calories-per-serving.working.portion-calories",
    },
    {
      id: "recipe-calories-formula",
      kind: "formula",
      bodyKey: "calories-per-serving.formula.recipe-calories",
      variables: [
        {
          symbol: "E",
          nameKey: "calories-per-serving.variable.total",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "e",
          nameKey: "calories-per-serving.field.portionCalories",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "n",
          nameKey: "calories-per-serving.field.servings",
          unitKey: "calories-per-serving.answer.servings",
        },
      ],
    },
    {
      id: "recipe-calories-example",
      kind: "example",
      titleKey: "calories-per-serving.example.recipe-calories",
      operation: "recipe-calories",
      inputs: {
        portionCalories: "250",
        servings: "4",
      },
      expected: "1000",
      workingKey: "calories-per-serving.working.recipe-calories",
    },
    {
      id: "portion-weight-formula",
      kind: "formula",
      bodyKey: "calories-per-serving.formula.portion-weight",
      variables: [
        {
          symbol: "e",
          nameKey: "calories-per-serving.variable.portion",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "E",
          nameKey: "calories-per-serving.field.totalCalories",
          unitKey: "calories-per-serving.answer.kcal",
        },
        {
          symbol: "M",
          nameKey: "calories-per-serving.field.totalGrams",
          unitKey: "calories-per-serving.answer.gram",
        },
        {
          symbol: "m",
          nameKey: "calories-per-serving.field.portionGrams",
          unitKey: "calories-per-serving.answer.gram",
        },
      ],
    },
    {
      id: "portion-weight-example",
      kind: "example",
      titleKey: "calories-per-serving.example.portion-weight",
      operation: "portion-weight",
      inputs: {
        totalCalories: "1000",
        totalGrams: "800",
        portionGrams: "200",
      },
      expected: "250",
      workingKey: "calories-per-serving.working.portion-weight",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "calories-per-serving.visual.description",
      alternativeKey: "calories-per-serving.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "calories-per-serving.mistakes.title",
      bodyKey: "calories-per-serving.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "calories-per-serving.limits.title",
      bodyKey: "calories-per-serving.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "calories-per-serving.faq.q",
      answerKey: "calories-per-serving.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "calories-per-serving.sources.title",
      bodyKey: "calories-per-serving.sources.body",
    },
  ],
};
