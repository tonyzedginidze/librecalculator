import { describe, expect, test } from "bun:test";
import {
  calculate,
  type VolumeInput,
} from "../../../calculators/src/volume/index";
import { lesson } from "./index";

describe("volume authored examples", () => {
  test("all three solid examples agree with independent geometry references", () => {
    const expected = new Map([
      ["example-prism", 24],
      ["example-cylinder", 12 * Math.PI],
      ["example-sphere", 36 * Math.PI],
    ]);
    const examples = lesson.blocks.filter((block) => block.kind === "example");
    expect(examples).toHaveLength(3);
    for (const block of examples) {
      if (block.kind !== "example") continue;
      const reference = expected.get(block.id);
      expect(reference).toBeDefined();
      if (reference === undefined)
        throw new Error(`Missing reference for ${block.id}`);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as VolumeInput);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Number(block.expected)).toBeCloseTo(reference, 11);
        expect(
          Math.abs(Number(result.result.answer.value) - reference),
        ).toBeLessThanOrEqual(1e-12 + 1e-12 * Math.abs(reference));
      }
    }
  });
});
