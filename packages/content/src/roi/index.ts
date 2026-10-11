import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "roi",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.roi.intro.title",
      bodyKey: "lesson.roi.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.roi.method.title",
      bodyKey: "lesson.roi.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.roi.formula",
      variables: [
        {
          symbol: "I",
          nameKey: "roi.field.investment",
          unitKey: "unit.usd",
        },
        {
          symbol: "G",
          nameKey: "roi.field.proceeds",
          unitKey: "unit.usd",
        },
        {
          symbol: "F",
          nameKey: "roi.field.fees",
          unitKey: "unit.usd",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.roi.example.1",
      operation: "return",
      inputs: {
        investment: "1000",
        proceeds: "1250",
        fees: "50",
      },
      expected: "20",
      workingKey: "roi.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.roi.example.2",
      operation: "return",
      inputs: {
        investment: "200",
        proceeds: "150",
        fees: "10",
      },
      expected: "-30",
      workingKey: "roi.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.roi.example.3",
      operation: "return",
      inputs: {
        investment: "500",
        proceeds: "510",
        fees: "10",
      },
      expected: "0",
      workingKey: "roi.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "roi.visual.description",
      alternativeKey: "roi.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.roi.mistakes.title",
      bodyKey: "lesson.roi.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.roi.limits.title",
      bodyKey: "lesson.roi.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.roi.faq.q",
      answerKey: "lesson.roi.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.roi.sources.title",
      bodyKey: "lesson.roi.sources.body",
    },
  ],
};
