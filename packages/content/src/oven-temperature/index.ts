import type { Lesson } from "../schema";
export const lesson: Lesson = {
  calculatorId: "oven-temperature",
  blocks: [
    {
      id: "intro",
      kind: "prose",
      titleKey: "oven-temperature.intro.title",
      bodyKey: "oven-temperature.intro.body",
    },
    {
      id: "celsius-to-fahrenheit-formula",
      kind: "formula",
      bodyKey: "oven-temperature.formula.celsius-to-fahrenheit",
      variables: [
        {
          symbol: "C",
          nameKey: "oven-temperature.variable.celsius",
          unitKey: "oven-temperature.answer.celsius",
        },
        {
          symbol: "F",
          nameKey: "oven-temperature.variable.fahrenheit",
          unitKey: "oven-temperature.answer.fahrenheit",
        },
      ],
    },
    {
      id: "celsius-to-fahrenheit-example",
      kind: "example",
      titleKey: "oven-temperature.example.celsius-to-fahrenheit",
      operation: "celsius-to-fahrenheit",
      inputs: {
        temperature: "180",
      },
      expected: "356",
      workingKey: "oven-temperature.working.celsius-to-fahrenheit",
    },
    {
      id: "fahrenheit-to-celsius-formula",
      kind: "formula",
      bodyKey: "oven-temperature.formula.fahrenheit-to-celsius",
      variables: [
        {
          symbol: "F",
          nameKey: "oven-temperature.variable.fahrenheit",
          unitKey: "oven-temperature.answer.fahrenheit",
        },
        {
          symbol: "C",
          nameKey: "oven-temperature.variable.celsius",
          unitKey: "oven-temperature.answer.celsius",
        },
      ],
    },
    {
      id: "fahrenheit-to-celsius-example",
      kind: "example",
      titleKey: "oven-temperature.example.fahrenheit-to-celsius",
      operation: "fahrenheit-to-celsius",
      inputs: {
        temperature: "356",
      },
      expected: "180",
      workingKey: "oven-temperature.working.fahrenheit-to-celsius",
    },
    {
      id: "fan-adjustment-formula",
      kind: "formula",
      bodyKey: "oven-temperature.formula.fan-adjustment",
      variables: [
        {
          symbol: "T",
          nameKey: "oven-temperature.field.conventional",
          unitKey: "oven-temperature.answer.celsius",
        },
        {
          symbol: "T\u2032",
          nameKey: "oven-temperature.variable.fan",
          unitKey: "oven-temperature.answer.celsius",
        },
        {
          symbol: "r",
          nameKey: "oven-temperature.field.reduction",
          unitKey: "oven-temperature.answer.celsius",
        },
      ],
    },
    {
      id: "fan-adjustment-example",
      kind: "example",
      titleKey: "oven-temperature.example.fan-adjustment",
      operation: "fan-adjustment",
      inputs: {
        temperature: "180",
        reduction: "20",
      },
      expected: "160",
      workingKey: "oven-temperature.working.fan-adjustment",
    },
    {
      id: "visual",
      kind: "visual",
      visualKey: "oven-temperature.visual.description",
      alternativeKey: "oven-temperature.visual.alternative",
    },
    {
      id: "mistakes",
      kind: "prose",
      titleKey: "oven-temperature.mistakes.title",
      bodyKey: "oven-temperature.mistakes.body",
    },
    {
      id: "limits",
      kind: "prose",
      titleKey: "oven-temperature.limits.title",
      bodyKey: "oven-temperature.limits.body",
    },
    {
      id: "faq",
      kind: "faq",
      questionKey: "oven-temperature.faq.q",
      answerKey: "oven-temperature.faq.a",
    },
    {
      id: "sources",
      kind: "prose",
      titleKey: "oven-temperature.sources.title",
      bodyKey: "oven-temperature.sources.body",
    },
  ],
};
