import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Signed energy transferred 1000, elapsed seconds 10", () => {
  const result = calculate({
    operation: "power-si",
    energy: "1000",
    time: "10",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("100");
});
test("Signed energy transferred -60, elapsed seconds 3", () => {
  const result = calculate({ operation: "power-si", energy: "-60", time: "3" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-20");
});
test("Signed energy transferred 0, elapsed seconds 5", () => {
  const result = calculate({ operation: "power-si", energy: "0", time: "5" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "power-si", energy: "abc", time: "10" }).ok,
  ).toBe(false);
});

test("undefined domain is rejected exactly", () => {
  expect(calculate({ operation: "power-si", energy: "1", time: "0" }).ok).toBe(
    false,
  );
});
