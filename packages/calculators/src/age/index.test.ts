import { expect, test } from "bun:test";
import { civilDate } from "../runtime/civil-date";
import { birthdayOrdinal, calculate } from "./index";

test("A leap-day birthday", () => {
  const result = calculate({
    operation: "completed-years",
    birth: "2000-02-29",
    asof: "2024-02-29",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("24");
});
test("The day before a birthday", () => {
  const result = calculate({
    operation: "completed-years",
    birth: "2000-10-20",
    asof: "2024-10-19",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("23");
});
test("On the day of birth", () => {
  const result = calculate({
    operation: "completed-years",
    birth: "2020-01-01",
    asof: "2020-01-01",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "completed-years",
      birth: "abc",
      asof: "2024-02-29",
    }).ok,
  ).toBe(false);
});
test("non-leap birthdays and invalid civil dates", () => {
  for (const asof of ["2023-02-28", "2023-03-01"]) {
    const r = calculate({
      operation: "completed-years",
      birth: "2000-02-29",
      asof,
    });
    if (!r.ok) throw Error("failed");
    expect(r.result.answer.value).toBe(asof.endsWith("02-28") ? "22" : "23");
  }
  for (const birth of ["0000-01-01", "1900-02-29", "2024-13-01"])
    expect(
      calculate({ operation: "completed-years", birth, asof: "2025-01-01" }).ok,
    ).toBe(false);
  expect(
    calculate({
      operation: "completed-years",
      birth: "2025-01-01",
      asof: "2024-01-01",
    }).ok,
  ).toBe(false);
});
test("birthday ordinals follow the March 1 leap-day convention", () => {
  const leap = civilDate("2000-02-29");
  if (!leap) throw Error("bad date");
  expect(birthdayOrdinal(leap, 2023)).toBe(
    civilDate("2023-03-01")?.ordinal ?? -1,
  );
  expect(birthdayOrdinal(leap, 2024)).toBe(
    civilDate("2024-02-29")?.ordinal ?? -1,
  );
  const r = calculate({
    operation: "completed-years",
    birth: "1990-06-15",
    asof: "2026-10-11",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("36");
  expect(r.result.working[0]?.args.birth).toEqual({
    kind: "text",
    value: "1990-06-15",
  });
});
