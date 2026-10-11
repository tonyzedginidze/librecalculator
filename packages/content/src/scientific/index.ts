import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "scientific",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.scientific.intro.title",
      bodyKey: "lesson.scientific.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.scientific.meaning.title",
      bodyKey: "lesson.scientific.meaning.body",
    },
    {
      id: "formula-square-root",
      kind: "formula",
      bodyKey: "lesson.scientific.formula.square-root",
      variables: [
        {
          symbol: "y",
          nameKey: "lesson.scientific.variable.result",
        },
        {
          symbol: "x",
          nameKey: "lesson.scientific.variable.number",
        },
      ],
    },
    {
      id: "formula-integer-power",
      kind: "formula",
      bodyKey: "lesson.scientific.formula.integer-power",
      variables: [
        {
          symbol: "y",
          nameKey: "lesson.scientific.variable.result",
        },
        {
          symbol: "x",
          nameKey: "lesson.scientific.variable.number",
        },
        {
          symbol: "k",
          nameKey: "lesson.scientific.variable.exponent",
        },
      ],
    },
    {
      id: "formula-natural-log",
      kind: "formula",
      bodyKey: "lesson.scientific.formula.natural-log",
      variables: [
        {
          symbol: "y",
          nameKey: "lesson.scientific.variable.result",
        },
        {
          symbol: "x",
          nameKey: "lesson.scientific.variable.number",
        },
      ],
    },
    {
      id: "formula-sine-degrees",
      kind: "formula",
      bodyKey: "lesson.scientific.formula.sine-degrees",
      variables: [
        {
          symbol: "y",
          nameKey: "lesson.scientific.variable.result",
        },
        {
          symbol: "θ",
          nameKey: "lesson.scientific.variable.angle",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.scientific.example.0",
      operation: "square-root",
      inputs: {
        value: "9",
      },
      expected: "3",
      workingKey: "scientific.working.square-root",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.scientific.example.1",
      operation: "integer-power",
      inputs: {
        value: "2",
        exponent: "-3",
      },
      expected: "0.125",
      workingKey: "scientific.working.integer-power",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.scientific.example.2",
      operation: "natural-log",
      inputs: {
        value: "1",
      },
      expected: "0",
      workingKey: "scientific.working.natural-log",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.scientific.example.3",
      operation: "sine-degrees",
      inputs: {
        value: "90",
      },
      expected: "1",
      workingKey: "scientific.working.sine-degrees",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "scientific.visual.description",
      alternativeKey: "scientific.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.scientific.mistakes.title",
      bodyKey: "lesson.scientific.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.scientific.limits.title",
      bodyKey: "lesson.scientific.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.scientific.sources.title",
      bodyKey: "lesson.scientific.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.scientific.faq.q",
      answerKey: "lesson.scientific.faq.a",
    },
  ],
};
