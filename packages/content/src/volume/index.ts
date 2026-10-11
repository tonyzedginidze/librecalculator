import type { Lesson } from "../schema";

export const lesson: Lesson = {
  calculatorId: "volume",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "lesson.volume.intro.title",
      bodyKey: "lesson.volume.intro.body",
    },
    {
      id: "prism-formula",
      kind: "formula",
      bodyKey: "lesson.volume.formula.prism",
      variables: [
        {
          symbol: "V",
          nameKey: "lesson.volume.variable.volume",
          unitKey: "volume.unit.cubic-metre",
        },
        {
          symbol: "w",
          nameKey: "lesson.volume.variable.width",
          unitKey: "volume.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "lesson.volume.variable.height",
          unitKey: "volume.unit.metre",
        },
        {
          symbol: "d",
          nameKey: "lesson.volume.variable.depth",
          unitKey: "volume.unit.metre",
        },
      ],
    },
    {
      id: "cylinder-formula",
      kind: "formula",
      bodyKey: "lesson.volume.formula.cylinder",
      variables: [
        {
          symbol: "V",
          nameKey: "lesson.volume.variable.volume",
          unitKey: "volume.unit.cubic-metre",
        },
        {
          symbol: "r",
          nameKey: "lesson.volume.variable.radius",
          unitKey: "volume.unit.metre",
        },
        {
          symbol: "h",
          nameKey: "lesson.volume.variable.height",
          unitKey: "volume.unit.metre",
        },
      ],
    },
    {
      id: "sphere-formula",
      kind: "formula",
      bodyKey: "lesson.volume.formula.sphere",
      variables: [
        {
          symbol: "V",
          nameKey: "lesson.volume.variable.volume",
          unitKey: "volume.unit.cubic-metre",
        },
        {
          symbol: "r",
          nameKey: "lesson.volume.variable.radius",
          unitKey: "volume.unit.metre",
        },
      ],
    },
    {
      id: "example-prism",
      kind: "example",
      titleKey: "lesson.volume.example.prism",
      operation: "prism",
      inputs: { width: "2", height: "3", depth: "4" },
      expected: "24",
      workingKey: "volume.working.prism",
    },
    {
      id: "example-cylinder",
      kind: "example",
      titleKey: "lesson.volume.example.cylinder",
      operation: "cylinder",
      inputs: { radius: "2", height: "3" },
      expected: "37.699111843078",
      workingKey: "volume.working.cylinder",
    },
    {
      id: "example-sphere",
      kind: "example",
      titleKey: "lesson.volume.example.sphere",
      operation: "sphere",
      inputs: { radius: "3" },
      expected: "113.097335529233",
      workingKey: "volume.working.sphere",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "volume.visual.description",
      alternativeKey: "volume.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "lesson.volume.mistakes.title",
      bodyKey: "lesson.volume.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "lesson.volume.limits.title",
      bodyKey: "lesson.volume.limits.body",
    },
    {
      id: "faq-units",
      kind: "faq",
      questionKey: "lesson.volume.faq.units.q",
      answerKey: "lesson.volume.faq.units.a",
    },
    {
      id: "faq-radius",
      kind: "faq",
      questionKey: "lesson.volume.faq.radius.q",
      answerKey: "lesson.volume.faq.radius.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "lesson.volume.sources.title",
      bodyKey: "lesson.volume.sources.body",
    },
  ],
};
