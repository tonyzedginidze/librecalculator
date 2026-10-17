import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

const base = {
  operation: "meeting-cost",
  attendees: "6x90000",
  minutes: "60",
  frequency: "weekly",
  refocus: "0",
  overhead: "1.3",
  hours: "2080",
} as Input;

test.each([
  // 6 × 90,000 × 1.3 ÷ 2,080 = $337.50 an hour; one hour, 48 times a year.
  [base, "337.5"],
  // (144,000 + 4 × 120,000) × 1.25 ÷ 2,080 = $375 an hour; 40 minutes = $250.
  [
    {
      ...base,
      attendees: "1x144000;4x120000",
      minutes: "30",
      refocus: "10",
      overhead: "1.25",
      frequency: "daily",
    },
    "250",
  ],
  // 2 × 52,000 ÷ 2,080 = $50 an hour; a quarter hour = $12.50.
  [
    {
      ...base,
      attendees: "2x52000",
      minutes: "15",
      overhead: "1",
      frequency: "once",
    },
    "12.5",
  ],
  // 8 × 104,000 × 1.4 ÷ 2,080 = $560 an hour; $1,000 buys 107.14 minutes.
  [
    {
      operation: "budget-minutes",
      attendees: "8x104000",
      budget: "1000",
      overhead: "1.4",
      hours: "2080",
    },
    "107",
  ],
])("independent fixture %j", (input, expected) => {
  const output = calculate(input as Input);
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe(expected);
    expect(output.result.visual.answer).toBe(expected);
  }
});

test("yearly figures, savings and time share come from the same meeting", () => {
  const output = calculate(base);
  expect(output.ok && output.result.visual).toMatchObject({
    kind: "meeting-cost",
    roomHour: "337.5",
    roomMinute: "5.63",
    yearly: "16200",
    monthly: "1350",
    meetingsPerYear: "48",
    personHours: "288",
    fteShare: "13.85",
    minuteSaving: "270",
    fiveMinuteSaving: "1350",
    personSaving: "2700",
  });
  expect(output.ok && output.result.working.map((s) => s.id)).toEqual([
    "room",
    "meeting",
    "year",
  ]);
});

test("refocus time and groups split the answer", () => {
  const output = calculate({
    ...base,
    attendees: "1x144000;4x120000",
    minutes: "30",
    refocus: "10",
    overhead: "1.25",
    frequency: "daily",
  });
  expect(output.ok && output.result.visual).toMatchObject({
    meetingPart: "187.5",
    refocusPart: "62.5",
    yearly: "60000",
    monthly: "5000",
    groups: [
      { people: "1", salary: "144000", cost: "57.69" },
      { people: "4", salary: "120000", cost: "192.31" },
    ],
  });
  expect(output.ok && output.result.working[1]?.messageKey).toBe(
    "meeting-cost.working.meeting-refocus",
  );
});

test("one-off meetings have no yearly step", () => {
  const output = calculate({ ...base, frequency: "once" });
  expect(output.ok && output.result.working.map((s) => s.id)).toEqual([
    "room",
    "meeting",
  ]);
});

test("budget mode reports exact minutes and what the whole minutes cost", () => {
  const output = calculate({
    operation: "budget-minutes",
    attendees: "8x104000",
    budget: "1000",
    overhead: "1.4",
    hours: "2080",
  } as Input);
  expect(output.ok && output.result.visual).toMatchObject({
    kind: "budget-minutes",
    roomHour: "560",
    exactMinutes: "107.14",
    spent: "998.67",
  });
});

test("rejects malformed attendees and out-of-range fields", () => {
  for (const attendees of [
    "",
    "6",
    "x90000",
    "6x",
    "6x90,000",
    "6x1e5",
    "-1x5",
    "6x0.001",
  ])
    expect(calculate({ ...base, attendees })).toMatchObject({
      ok: false,
      error: { field: "attendees" },
    });
  expect(calculate({ ...base, attendees: "0x90000" })).toMatchObject({
    ok: false,
    error: { code: "no-attendees" },
  });
  expect(calculate({ ...base, attendees: "3x0" })).toMatchObject({
    ok: false,
    error: { code: "zero-cost" },
  });
  expect(
    calculate({ ...base, attendees: Array(13).fill("1x1").join(";") }),
  ).toMatchObject({ ok: false, error: { code: "out-of-range" } });
  for (const [field, value] of [
    ["minutes", "0"],
    ["minutes", "1441"],
    ["refocus", "241"],
    ["overhead", "0.9"],
    ["overhead", "5.1"],
    ["hours", "0"],
    ["frequency", "hourly"],
  ] as const)
    expect(calculate({ ...base, [field]: value }).ok).toBe(false);
  expect(
    calculate({
      operation: "budget-minutes",
      attendees: "1x1",
      budget: "0",
      overhead: "1",
      hours: "2080",
    } as Input).ok,
  ).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(calculate({ ...base, operation: "nope" } as unknown as Input)).toEqual(
    { ok: false, error: { code: "invalid-field" } },
  );
});
