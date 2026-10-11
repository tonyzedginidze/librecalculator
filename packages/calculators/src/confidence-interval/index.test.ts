import { expect, test } from "bun:test";
import { calculate } from "./index";

test("A two-standard-error interval", () => {
  const result = calculate({
    operation: "normal-interval",
    mean: "100",
    sigma: "10",
    count: "25",
    critical: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("4");
});
test("Three observations per standard-error scale", () => {
  const result = calculate({
    operation: "normal-interval",
    mean: "20",
    sigma: "6",
    count: "9",
    critical: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("4");
});
test("A one-standard-error margin", () => {
  const result = calculate({
    operation: "normal-interval",
    mean: "0",
    sigma: "2",
    count: "4",
    critical: "1",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "normal-interval",
      mean: "abc",
      sigma: "10",
      count: "25",
      critical: "1.959963984540054",
    }).ok,
  ).toBe(false);
});
test("known sigma domain and endpoint consistency", () => {
  expect(
    calculate({
      operation: "normal-interval",
      mean: "0",
      sigma: "0",
      count: "5",
      critical: "2",
    }).ok,
  ).toBe(false);
  expect(
    calculate({
      operation: "normal-interval",
      mean: "0",
      sigma: "1",
      count: "1.5",
      critical: "2",
    }).ok,
  ).toBe(false);
  const r = calculate({
    operation: "normal-interval",
    mean: "100",
    sigma: "10",
    count: "25",
    critical: "2",
  });
  if (!r.ok) throw Error("failed");
  expect(
    r.result.visual.rows.find((v) => v.labelKey.endsWith("lower"))?.value,
  ).toBe("96");
  expect(
    r.result.visual.rows.find((v) => v.labelKey.endsWith("upper"))?.value,
  ).toBe("104");
});
test("default inputs give a 95% interval around 100", () => {
  const r = calculate({
    operation: "normal-interval",
    mean: "100",
    sigma: "15",
    count: "36",
    critical: "1.96",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("4.9");
  expect(
    r.result.visual.rows.find((v) => v.labelKey.endsWith("lower"))?.value,
  ).toBe("95.1");
  expect(
    r.result.visual.rows.find((v) => v.labelKey.endsWith("upper"))?.value,
  ).toBe("104.9");
});
