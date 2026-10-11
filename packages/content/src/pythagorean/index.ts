import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "pythagorean",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.pythagorean.intro.title",
      bodyKey: "lesson.pythagorean.intro.body",
    },
    {
      id: "hypotenuse-formula",
      kind: "formula",
      bodyKey: "lesson.pythagorean.formula.hypotenuse",
      variables: [
        {
          symbol: "a",
          nameKey: "lesson.pythagorean.variable.a",
          unitKey: "pythagorean.unit.metre",
        },
        {
          symbol: "b",
          nameKey: "lesson.pythagorean.variable.b",
          unitKey: "pythagorean.unit.metre",
        },
        {
          symbol: "c",
          nameKey: "lesson.pythagorean.variable.c",
          unitKey: "pythagorean.unit.metre",
        },
      ],
    },
    {
      id: "leg-formula",
      kind: "formula",
      bodyKey: "lesson.pythagorean.formula.leg",
      variables: [
        {
          symbol: "a",
          nameKey: "lesson.pythagorean.variable.a",
          unitKey: "pythagorean.unit.metre",
        },
        {
          symbol: "b",
          nameKey: "lesson.pythagorean.variable.b",
          unitKey: "pythagorean.unit.metre",
        },
        {
          symbol: "c",
          nameKey: "lesson.pythagorean.variable.c",
          unitKey: "pythagorean.unit.metre",
        },
      ],
    },
    {
      id: "example-classic",
      kind: "example",
      titleKey: "lesson.pythagorean.example.classic",
      operation: "missing-hypotenuse",
      inputs: { a: "3", b: "4" },
      expected: "5",
      workingKey: "pythagorean.working.missing-hypotenuse",
    },
    {
      id: "example-missing-leg",
      kind: "example",
      titleKey: "lesson.pythagorean.example.missing-leg",
      operation: "missing-leg",
      inputs: { hypotenuse: "5", leg: "3" },
      expected: "4",
      workingKey: "pythagorean.working.missing-leg",
    },
    {
      id: "example-scaled",
      kind: "example",
      titleKey: "lesson.pythagorean.example.scaled",
      operation: "missing-hypotenuse",
      inputs: { a: "5", b: "12" },
      expected: "13",
      workingKey: "pythagorean.working.missing-hypotenuse",
    },
    {
      id: "example-decimal",
      kind: "example",
      titleKey: "lesson.pythagorean.example.decimal",
      operation: "missing-hypotenuse",
      inputs: { a: "1.5", b: "2" },
      expected: "2.5",
      workingKey: "pythagorean.working.missing-hypotenuse",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "pythagorean.visual.description",
      alternativeKey: "pythagorean.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.pythagorean.mistakes.title",
      bodyKey: "lesson.pythagorean.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.pythagorean.limits.title",
      bodyKey: "lesson.pythagorean.limits.body",
    },
    {
      id: "faq-hypotenuse",
      kind: "faq",
      questionKey: "lesson.pythagorean.faq.hypotenuse.q",
      answerKey: "lesson.pythagorean.faq.hypotenuse.a",
    },
    {
      id: "faq-impossible",
      kind: "faq",
      questionKey: "lesson.pythagorean.faq.impossible.q",
      answerKey: "lesson.pythagorean.faq.impossible.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.pythagorean.sources.title",
      bodyKey: "lesson.pythagorean.sources.body",
    },
  ],
};
