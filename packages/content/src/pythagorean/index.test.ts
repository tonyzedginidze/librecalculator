import { describe, expect, test } from "bun:test";
import {
  calculate,
  type PythagoreanInput,
} from "../../../calculators/src/pythagorean/index";
import { lesson } from "./index";

describe("Pythagorean authored examples", () => {
  test("each worked triangle agrees with independent exact arithmetic", () => {
    const expected = new Map([
      ["example-classic", "5"],
      ["example-missing-leg", "4"],
      ["example-scaled", "13"],
      ["example-decimal", "2.5"],
    ]);
    const examples = lesson.blocks.filter((block) => block.kind === "example");
    expect(examples).toHaveLength(4);
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
      } as PythagoreanInput);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.result.answer.value).toBe(expectedAnswer);
    }
  });
});
