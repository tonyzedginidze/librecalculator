import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "cup-gram-conversion",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "cup-gram-conversion.intro.title",
      bodyKey: "cup-gram-conversion.intro.body",
    },
    {
      id: "cups-to-grams-formula",
      kind: "formula",
      bodyKey: "cup-gram-conversion.formula.cups-to-grams",
      variables: [
        {
          symbol: "m",
          nameKey: "cup-gram-conversion.variable.grams",
          unitKey: "cup-gram-conversion.answer.gram",
        },
        {
          symbol: "c",
          nameKey: "cup-gram-conversion.field.cups",
          unitKey: "cup-gram-conversion.answer.cups",
        },
        {
          symbol: "k",
          nameKey: "cup-gram-conversion.field.gramsPerCup",
          unitKey: "cup-gram-conversion.answer.grams-per-cup",
        },
      ],
    },
    {
      id: "cups-to-grams-example",
      kind: "example",
      titleKey: "cup-gram-conversion.example.cups-to-grams",
      operation: "cups-to-grams",
      inputs: {
        cups: "2",
        gramsPerCup: "120",
      },
      expected: "240",
      workingKey: "cup-gram-conversion.working.cups-to-grams",
    },
    {
      id: "grams-to-cups-formula",
      kind: "formula",
      bodyKey: "cup-gram-conversion.formula.grams-to-cups",
      variables: [
        {
          symbol: "c",
          nameKey: "cup-gram-conversion.variable.cups",
          unitKey: "cup-gram-conversion.answer.cups",
        },
        {
          symbol: "m",
          nameKey: "cup-gram-conversion.field.grams",
          unitKey: "cup-gram-conversion.answer.gram",
        },
        {
          symbol: "k",
          nameKey: "cup-gram-conversion.field.gramsPerCup",
          unitKey: "cup-gram-conversion.answer.grams-per-cup",
        },
      ],
    },
    {
      id: "grams-to-cups-example",
      kind: "example",
      titleKey: "cup-gram-conversion.example.grams-to-cups",
      operation: "grams-to-cups",
      inputs: {
        grams: "240",
        gramsPerCup: "120",
      },
      expected: "2",
      workingKey: "cup-gram-conversion.working.grams-to-cups",
    },
    {
      id: "half-cup-grams-formula",
      kind: "formula",
      bodyKey: "cup-gram-conversion.formula.half-cup-grams",
      variables: [
        {
          symbol: "h",
          nameKey: "cup-gram-conversion.variable.half",
          unitKey: "cup-gram-conversion.answer.gram",
        },
        {
          symbol: "k",
          nameKey: "cup-gram-conversion.field.gramsPerCup",
          unitKey: "cup-gram-conversion.answer.grams-per-cup",
        },
      ],
    },
    {
      id: "half-cup-grams-example",
      kind: "example",
      titleKey: "cup-gram-conversion.example.half-cup-grams",
      operation: "half-cup-grams",
      inputs: {
        gramsPerCup: "120",
      },
      expected: "60",
      workingKey: "cup-gram-conversion.working.half-cup-grams",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "cup-gram-conversion.visual.description",
      alternativeKey: "cup-gram-conversion.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "cup-gram-conversion.mistakes.title",
      bodyKey: "cup-gram-conversion.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "cup-gram-conversion.limits.title",
      bodyKey: "cup-gram-conversion.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "cup-gram-conversion.faq.q",
      answerKey: "cup-gram-conversion.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "cup-gram-conversion.sources.title",
      bodyKey: "cup-gram-conversion.sources.body",
    },
  ],
};
