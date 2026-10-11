import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "ideal-weight",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.ideal-weight.intro.title",
      bodyKey: "lesson.ideal-weight.intro.body",
    },
    {
      id: "method",
      kind: "prose",
      titleKey: "lesson.ideal-weight.method.title",
      bodyKey: "lesson.ideal-weight.method.body",
    },
    {
      id: "formula",
      kind: "formula",
      bodyKey: "lesson.ideal-weight.formula",
      variables: [
        {
          symbol: "h",
          nameKey: "ideal-weight.field.height",
        },
        {
          symbol: "B",
          nameKey: "ideal-weight.field.targetBmi",
        },
        {
          symbol: "A",
          nameKey: "ideal-weight.field.age",
        },
      ],
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.ideal-weight.example.1",
      operation: "bmi-weight",
      inputs: {
        height: "200",
        targetBmi: "20",
        age: "30",
      },
      expected: "80",
      workingKey: "ideal-weight.working.summary",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.ideal-weight.example.2",
      operation: "bmi-weight",
      inputs: {
        height: "160",
        targetBmi: "25",
        age: "40",
      },
      expected: "64",
      workingKey: "ideal-weight.working.summary",
    },
    {
      id: "example-3",
      kind: "example",
      titleKey: "lesson.ideal-weight.example.3",
      operation: "bmi-weight",
      inputs: {
        height: "180",
        targetBmi: "25",
        age: "50",
      },
      expected: "81",
      workingKey: "ideal-weight.working.summary",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "ideal-weight.visual.description",
      alternativeKey: "ideal-weight.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.ideal-weight.mistakes.title",
      bodyKey: "lesson.ideal-weight.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.ideal-weight.limits.title",
      bodyKey: "lesson.ideal-weight.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.ideal-weight.faq.q",
      answerKey: "lesson.ideal-weight.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.ideal-weight.sources.title",
      bodyKey: "lesson.ideal-weight.sources.body",
    },
  ],
};
