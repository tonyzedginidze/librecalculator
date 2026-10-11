import { expect, test } from "bun:test";
import type { Lesson } from "../../../content/src/schema";
import { en } from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import type { ExamplePresenter } from "../example-presentation";
import { financeFormat, renderFinanceWorking } from "./finance-format";

const ids = [
  "mortgage",
  "savings",
  "roi",
  "salary",
  "margin-markup",
  "inflation",
  "retirement",
] as const;

test("money shows two cent digits or none; negatives use a minus sign", () => {
  const messages = {
    "finance.money": "\u0024{amount}",
    "finance.money.negative": "\u2212\u0024{amount}",
    "finance.percent": "{value}%",
  };
  const f = financeFormat(messages, "en-US");
  expect(f.usd("1896.2")).toBe("$1,896.20");
  expect(f.usd("300000")).toBe("$300,000");
  expect(f.usd("0.5")).toBe("$0.50");
  expect(f.usd("-60")).toBe("−$60");
  expect(f.usd("12.345")).toBe("$12.35");
  expect(f.percent("23.5")).toBe("23.5%");
  expect(f.percent("66.666666")).toBe("66.67%");
  expect(
    renderFinanceWorking(
      {
        id: "s",
        messageKey: "k",
        args: {
          a: { kind: "decimal", value: "1896.2" },
          r: { kind: "decimal", value: "6.5" },
        },
      },
      ["a"],
      { k: "{a} at {r}" },
      "en-US",
    ),
  ).toBe("1,896.20 at 6.5");
});

test("every finance pack lesson example presents through its engine", async () => {
  for (const id of ids) {
    const { lesson } = (await import(
      `../../../content/src/${id}/index.ts`
    )) as {
      lesson: Lesson;
    };
    const { messages } = await import(`../../../i18n/src/topics/${id}.ts`);
    const { presentExample } = (await import(`./${id}/examples.ts`)) as {
      presentExample: ExamplePresenter;
    };
    const all = { ...en, ...ui, ...messages };
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      const shown = presentExample(
        { operation: block.operation, inputs: block.inputs },
        "en-US",
        all,
      );
      expect(shown.ok).toBe(true);
      if (shown.ok) {
        expect(shown.answer).not.toContain("[");
        for (const line of shown.working) expect(line).not.toContain("{");
      }
    }
  }
});
