export type LessonBlock =
  | { id: string; kind: "prose"; titleKey?: string; bodyKey: string }
  | {
      id: string;
      kind: "formula";
      bodyKey: string;
      variables: readonly {
        symbol: string;
        nameKey: string;
        unitKey?: string;
      }[];
    }
  | {
      id: string;
      kind: "example";
      titleKey: string;
      operation: string;
      inputs: Readonly<Record<string, string>>;
      expected: string;
      workingKey: string;
    }
  | { id: string; kind: "faq"; questionKey: string; answerKey: string }
  | { id: string; kind: "visual"; visualKey: string; alternativeKey: string }
  | { id: string; kind: "related"; calculatorId: string };

export type Lesson = { calculatorId: string; blocks: readonly LessonBlock[] };
