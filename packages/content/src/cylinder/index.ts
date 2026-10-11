import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "cylinder",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "cylinder.intro.title",
      bodyKey: "cylinder.intro.body",
    },
    {
      id: "cylinder-volume-formula",
      kind: "formula",
      bodyKey: "cylinder.formula.cylinder-volume",
      variables: [
        {
          symbol: "r",
          nameKey: "cylinder.field.radius",
          unitKey: "cylinder.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "cylinder.field.height",
          unitKey: "cylinder.unit.metre",
        },
      ],
    },
    {
      id: "cylinder-volume-example",
      kind: "example",
      titleKey: "cylinder.example.cylinder-volume",
      operation: "cylinder-volume",
      inputs: {
        radius: "2",
        height: "3",
      },
      expected: "37.699111843077518861551720599354034610366032792502",
      workingKey: "cylinder.working.cylinder-volume",
    },
    {
      id: "cylinder-surface-formula",
      kind: "formula",
      bodyKey: "cylinder.formula.cylinder-surface",
      variables: [
        {
          symbol: "r",
          nameKey: "cylinder.field.radius",
          unitKey: "cylinder.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "cylinder.field.height",
          unitKey: "cylinder.unit.metre",
        },
      ],
    },
    {
      id: "cylinder-surface-example",
      kind: "example",
      titleKey: "cylinder.example.cylinder-surface",
      operation: "cylinder-surface",
      inputs: {
        radius: "2",
        height: "3",
      },
      expected: "62.831853071795864769252867665590057683943387987502",
      workingKey: "cylinder.working.cylinder-surface",
    },
    {
      id: "cylinder-lateral-formula",
      kind: "formula",
      bodyKey: "cylinder.formula.cylinder-lateral",
      variables: [
        {
          symbol: "r",
          nameKey: "cylinder.field.radius",
          unitKey: "cylinder.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "cylinder.field.height",
          unitKey: "cylinder.unit.metre",
        },
      ],
    },
    {
      id: "cylinder-lateral-example",
      kind: "example",
      titleKey: "cylinder.example.cylinder-lateral",
      operation: "cylinder-lateral",
      inputs: {
        radius: "2",
        height: "3",
      },
      expected: "37.699111843077518861551720599354034610366032792502",
      workingKey: "cylinder.working.cylinder-lateral",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "cylinder.visual",
      alternativeKey: "cylinder.visual",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "cylinder.mistakes.title",
      bodyKey: "cylinder.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "cylinder.limits.title",
      bodyKey: "cylinder.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "cylinder.faq.q",
      answerKey: "cylinder.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "cylinder.sources.title",
      bodyKey: "cylinder.sources.body",
    },
  ],
};
