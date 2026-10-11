import { expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { numericResult } from "./numeric-result";

test("scalar diagram shares the signed answer and exact bounded position", () => {
  for (const [answer, min, max, fraction] of [
    ["-2", "-2", "2", "0"],
    ["0", "-1", "1", "0.5"],
    ["0.5", "-1", "1", "0.75"],
    ["3", "-3", "3", "1"],
  ] as const) {
    const r = numericResult(
      "example",
      "calculate",
      new DecimalValue(answer),
      {},
    );
    if (!r.ok) throw Error("failed");
    expect(r.result.visual.numberLine).toEqual({
      minimum: min,
      maximum: max,
      value: answer,
      fraction,
    });
    expect(r.result.visual.rows[0]?.value).toBe(r.result.answer.value);
  }
});
