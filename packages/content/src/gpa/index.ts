import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "gpa",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "gpa.intro.title",
      bodyKey: "gpa.intro.body",
    },
    {
      id: "gpa-average-formula",
      kind: "formula",
      bodyKey: "gpa.formula.gpa-average",
      variables: [
        {
          symbol: "Q",
          nameKey: "gpa.field.qualityPoints",
        },
        {
          symbol: "C",
          nameKey: "gpa.field.credits",
        },
      ],
    },
    {
      id: "gpa-average-example",
      kind: "example",
      titleKey: "gpa.example.gpa-average",
      operation: "gpa-average",
      inputs: {
        qualityPoints: "42",
        credits: "12",
      },
      expected: "3.5",
      workingKey: "gpa.working.gpa-average",
    },
    {
      id: "gpa-combined-formula",
      kind: "formula",
      bodyKey: "gpa.formula.gpa-combined",
      variables: [
        {
          symbol: "G₁",
          nameKey: "gpa.field.previousGpa",
        },
        {
          symbol: "C₁",
          nameKey: "gpa.field.previousCredits",
        },
        {
          symbol: "G₂",
          nameKey: "gpa.field.newGpa",
        },
        {
          symbol: "C₂",
          nameKey: "gpa.field.newCredits",
        },
      ],
    },
    {
      id: "gpa-combined-example",
      kind: "example",
      titleKey: "gpa.example.gpa-combined",
      operation: "gpa-combined",
      inputs: {
        previousGpa: "3",
        previousCredits: "12",
        newGpa: "3.5",
        newCredits: "12",
      },
      expected: "3.25",
      workingKey: "gpa.working.gpa-combined",
    },
    {
      id: "gpa-target-formula",
      kind: "formula",
      bodyKey: "gpa.formula.gpa-target",
      variables: [
        {
          symbol: "G",
          nameKey: "gpa.field.targetGpa",
        },
        {
          symbol: "C",
          nameKey: "gpa.field.totalCredits",
        },
        {
          symbol: "Q",
          nameKey: "gpa.field.qualityPoints",
        },
      ],
    },
    {
      id: "gpa-target-example",
      kind: "example",
      titleKey: "gpa.example.gpa-target",
      operation: "gpa-target",
      inputs: {
        targetGpa: "4",
        totalCredits: "12",
      },
      expected: "48",
      workingKey: "gpa.working.gpa-target",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "gpa.visual.lesson",
      alternativeKey: "gpa.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "gpa.mistakes.title",
      bodyKey: "gpa.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "gpa.limits.title",
      bodyKey: "gpa.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "gpa.faq.q",
      answerKey: "gpa.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "gpa.sources.title",
      bodyKey: "gpa.sources.body",
    },
  ],
};
