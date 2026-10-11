import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Two compared with four", () => {
  const result = calculate({ operation: "quotient", first: "2", second: "4" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0.5");
});
test("Scale a two to three mixture", () => {
  const result = calculate({
    operation: "scale-ratio",
    first: "2",
    second: "3",
    target: "10",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("15");
});
test("A zero first quantity", () => {
  const result = calculate({ operation: "quotient", first: "0", second: "5" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "quotient", first: "abc", second: "3" }).ok,
  ).toBe(false);
});
test("zero divisors and negative quantities fail", () => {
  for (const i of [
    { operation: "quotient", first: "1", second: "0" },
    { operation: "quotient", first: "-1", second: "2" },
    { operation: "scale-ratio", first: "0", second: "2", target: "10" },
  ])
    expect(calculate(i).ok).toBe(false);
});
