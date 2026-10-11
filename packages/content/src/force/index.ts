import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "force",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.force.intro.title",
      bodyKey: "lesson.force.intro.body",
    },
    {
      id: "meaning",
      kind: "prose",
      titleKey: "lesson.force.meaning.title",
      bodyKey: "lesson.force.meaning.body",
    },
    {
      id: "formula-force-si",
      kind: "formula",
      bodyKey: "lesson.force.formula.force-si",
      variables: [
        {
          symbol: "F",
          nameKey: "lesson.force.variable.item0",
        },
        {
          symbol: "m",
          nameKey: "lesson.force.variable.item1",
        },
        {
          symbol: "a",
          nameKey: "lesson.force.variable.item2",
        },
      ],
    },
    {
      id: "example-0",
      kind: "example",
      titleKey: "lesson.force.example.0",
      operation: "force-si",
      inputs: {
        mass: "10",
        acceleration: "2",
      },
      expected: "20",
      workingKey: "force.working.force-si",
    },
    {
      id: "example-1",
      kind: "example",
      titleKey: "lesson.force.example.1",
      operation: "force-si",
      inputs: {
        mass: "3",
        acceleration: "-4",
      },
      expected: "-12",
      workingKey: "force.working.force-si",
    },
    {
      id: "example-2",
      kind: "example",
      titleKey: "lesson.force.example.2",
      operation: "force-si",
      inputs: {
        mass: "5",
        acceleration: "0",
      },
      expected: "0",
      workingKey: "force.working.force-si",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "force.visual.description",
      alternativeKey: "force.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.force.mistakes.title",
      bodyKey: "lesson.force.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.force.limits.title",
      bodyKey: "lesson.force.limits.body",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.force.sources.title",
      bodyKey: "lesson.force.sources.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "lesson.force.faq.q",
      answerKey: "lesson.force.faq.a",
    },
  ],
};
