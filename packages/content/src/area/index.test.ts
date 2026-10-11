import { describe, expect, test } from "bun:test";
import { type AreaInput, calculate } from "../../../calculators/src/area/index";
import { lesson } from "./index";

describe("area authored examples", () => {
  test("all three shape examples match independent expected answers", () => {
    const expected = new Map([
      ["example-rectangle", "12"],
      ["example-triangle", "6"],
      ["example-circle", "3.1415926535897932384626433832795028841971693993751"],
    ]);
    const examples = lesson.blocks.filter((block) => block.kind === "example");
    expect(examples).toHaveLength(3);
    for (const block of examples) {
      if (block.kind !== "example") continue;
      const expectedAnswer = expected.get(block.id);
      expect(expectedAnswer).toBeDefined();
      if (expectedAnswer === undefined)
        throw new Error(`Missing reference for ${block.id}`);
      expect(block.expected).toBe(expectedAnswer);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as AreaInput);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.result.answer.value).toBe(expectedAnswer);
    }
  });
});
