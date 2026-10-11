import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { calculatorCatalog } from "../../../calculators/src/catalog.generated";
import { engineImports } from "../../../calculators/src/engine-imports.generated";
import {
  CalculatorArt,
  calculatorArtIds,
  OperationIcon,
  operationIconIds,
} from "./art";

const operationsById = async () => {
  const out: { calculator: string; operation: string }[] = [];
  for (const item of calculatorCatalog) {
    const load = engineImports[item.id as keyof typeof engineImports];
    const engine = (await load()) as { operations?: readonly { id: string }[] };
    for (const op of engine.operations ?? [])
      out.push({ calculator: item.id, operation: op.id });
  }
  return out;
};

test("every calculator has tile art", () => {
  const missing = calculatorCatalog
    .map((item) => item.id)
    .filter((id) => !calculatorArtIds.has(id));
  expect(missing).toEqual([]);
});

test("every operation of a multi-operation calculator has an icon", async () => {
  const ops = await operationsById();
  const counts = new Map<string, number>();
  for (const op of ops)
    counts.set(op.calculator, (counts.get(op.calculator) ?? 0) + 1);
  const missing = ops
    .filter((op) => (counts.get(op.calculator) ?? 0) > 1)
    .filter((op) => !operationIconIds.has(op.operation))
    .map((op) => `${op.calculator}:${op.operation}`);
  expect(missing).toEqual([]);
});

test("operation icons are distinct drawings", () => {
  const byMarkup = new Map<string, string[]>();
  for (const id of operationIconIds) {
    const markup = renderToStaticMarkup(<OperationIcon id={id} />);
    byMarkup.set(markup, [...(byMarkup.get(markup) ?? []), id]);
  }
  const shared = [...byMarkup.values()].filter((ids) => ids.length > 1);
  expect(shared).toEqual([]);
});

test("tile art follows the house style", () => {
  // docs/tile-illustrations.md: theme tokens only, flat fills, one label at most.
  const problems: string[] = [];
  for (const id of calculatorArtIds) {
    const markup = renderToStaticMarkup(<CalculatorArt id={id} />);
    if (/Gradient|<filter|<image|<foreignObject/.test(markup))
      problems.push(`${id}: gradient, filter or embedded image`);
    if (/(fill|stroke|stop-color)="(#|rgb|hsl)/.test(markup))
      problems.push(`${id}: raw colour instead of a --oc token`);
    const thin = [...markup.matchAll(/stroke-width="([\d.]+)"/g)]
      .map((m) => Number(m[1]))
      .filter((w) => w > 0 && w < 1.5);
    if (thin.length) problems.push(`${id}: stroke thinner than 1.5`);
    const labels = (markup.match(/<text/g) ?? []).length;
    if (labels > 1) problems.push(`${id}: ${labels} text labels`);
  }
  expect(problems).toEqual([]);
});
