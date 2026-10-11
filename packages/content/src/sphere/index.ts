import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "sphere",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "sphere.intro.title",
      bodyKey: "sphere.intro.body",
    },
    {
      id: "sphere-volume-formula",
      kind: "formula",
      bodyKey: "sphere.formula.sphere-volume",
      variables: [
        {
          symbol: "r",
          nameKey: "sphere.field.radius",
          unitKey: "sphere.unit.metre",
        },
      ],
    },
    {
      id: "sphere-volume-example",
      kind: "example",
      titleKey: "sphere.example.sphere-volume",
      operation: "sphere-volume",
      inputs: {
        radius: "3",
      },
      expected: "113.0973355292325565846551617980621038310980983775",
      workingKey: "sphere.working.sphere-volume",
    },
    {
      id: "sphere-surface-formula",
      kind: "formula",
      bodyKey: "sphere.formula.sphere-surface",
      variables: [
        {
          symbol: "r",
          nameKey: "sphere.field.radius",
          unitKey: "sphere.unit.metre",
        },
      ],
    },
    {
      id: "sphere-surface-example",
      kind: "example",
      titleKey: "sphere.example.sphere-surface",
      operation: "sphere-surface",
      inputs: {
        radius: "3",
      },
      expected: "113.0973355292325565846551617980621038310980983775",
      workingKey: "sphere.working.sphere-surface",
    },
    {
      id: "sphere-diameter-formula",
      kind: "formula",
      bodyKey: "sphere.formula.sphere-diameter",
      variables: [
        {
          symbol: "r",
          nameKey: "sphere.field.radius",
          unitKey: "sphere.unit.metre",
        },
      ],
    },
    {
      id: "sphere-diameter-example",
      kind: "example",
      titleKey: "sphere.example.sphere-diameter",
      operation: "sphere-diameter",
      inputs: {
        radius: "3",
      },
      expected: "6",
      workingKey: "sphere.working.sphere-diameter",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "sphere.visual",
      alternativeKey: "sphere.visual",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "sphere.mistakes.title",
      bodyKey: "sphere.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "sphere.limits.title",
      bodyKey: "sphere.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "sphere.faq.q",
      answerKey: "sphere.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "sphere.sources.title",
      bodyKey: "sphere.sources.body",
    },
  ],
};
