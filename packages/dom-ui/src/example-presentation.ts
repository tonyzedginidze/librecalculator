export type ExamplePresentationField = {
  id: string;
  label: string;
  value: string;
};

export type ExamplePresentationSuccess = {
  ok: true;
  fields: readonly ExamplePresentationField[];
  answer: string;
  working: readonly string[];
};

export type ExamplePresentationFailure = {
  ok: false;
  reason?: string;
};

export type ExamplePresentation =
  | ExamplePresentationSuccess
  | ExamplePresentationFailure;

export type ExamplePresenter = (
  example: { operation: string; inputs: Readonly<Record<string, string>> },
  locale: string,
  messages: Readonly<Record<string, string>>,
) => ExamplePresentation;
