import type {
  CalculationResult,
  FieldDescriptor,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
import {
  parseUsdCents,
  roundUsdToCents,
  usdCentsToString,
} from "../numeric/money";

type Dec = InstanceType<typeof DecimalValue>;

export type Input = {
  operation: "meeting-cost" | "budget-minutes";
} & Record<string, string>;

/** Meetings per year for each frequency: 48 working weeks of 5 days. */
export const meetingsPerYear = {
  once: 1,
  daily: 240,
  "twice-weekly": 96,
  weekly: 48,
  biweekly: 24,
  monthly: 12,
  quarterly: 4,
} as const;
export type Frequency = keyof typeof meetingsPerYear;

/** Attendee groups: at most this many rows of "people x annual salary". */
export const MAX_GROUPS = 12;
export const MAX_GROUP_PEOPLE = 10000;

const attendees: FieldDescriptor = {
  id: "attendees",
  labelKey: "meeting-cost.field.attendees",
  defaultValue: "1x160000;5x120000",
  input: "text",
};
const overhead: FieldDescriptor = {
  id: "overhead",
  labelKey: "meeting-cost.field.overhead",
  sign: "nonnegative",
  defaultValue: "1.3",
  input: "decimal",
};
const hours: FieldDescriptor = {
  id: "hours",
  labelKey: "meeting-cost.field.hours",
  unitKey: "meeting-cost.unit.hours",
  sign: "nonnegative",
  defaultValue: "2080",
  input: "decimal",
};
const roomArgs = {
  people: "decimal",
  salaryTotal: "decimal",
  overhead: "decimal",
  hours: "decimal",
  roomHour: "decimal",
} as const;

export const operationDescriptors = {
  "meeting-cost": {
    id: "meeting-cost",
    labelKey: "meeting-cost.operation.meeting-cost",
    fields: [
      attendees,
      {
        id: "minutes",
        labelKey: "meeting-cost.field.minutes",
        unitKey: "meeting-cost.unit.minutes",
        sign: "nonnegative",
        defaultValue: "30",
        input: "decimal",
      },
      {
        id: "frequency",
        labelKey: "meeting-cost.field.frequency",
        defaultValue: "weekly",
        input: "choice",
        choices: (Object.keys(meetingsPerYear) as Frequency[]).map((id) => ({
          id,
          labelKey: `meeting-cost.frequency.${id}`,
        })),
      },
      {
        id: "refocus",
        labelKey: "meeting-cost.field.refocus",
        unitKey: "meeting-cost.unit.minutes",
        sign: "nonnegative",
        defaultValue: "0",
        input: "decimal",
      },
      overhead,
      hours,
    ],
    working: [
      { messageKey: "meeting-cost.working.room", arguments: roomArgs },
      {
        messageKey: "meeting-cost.working.meeting",
        arguments: {
          roomHour: "decimal",
          minutes: "decimal",
          answer: "decimal",
        },
      },
      {
        messageKey: "meeting-cost.working.meeting-refocus",
        arguments: {
          roomHour: "decimal",
          minutes: "decimal",
          refocus: "decimal",
          answer: "decimal",
        },
      },
      {
        messageKey: "meeting-cost.working.year",
        arguments: {
          frequency: "message",
          count: "decimal",
          answer: "decimal",
          yearly: "decimal",
        },
      },
    ],
  },
  "budget-minutes": {
    id: "budget-minutes",
    labelKey: "meeting-cost.operation.budget-minutes",
    fields: [
      attendees,
      {
        id: "budget",
        labelKey: "meeting-cost.field.budget",
        unitKey: "unit.usd",
        sign: "nonnegative",
        defaultValue: "500",
        input: "decimal",
      },
      overhead,
      hours,
    ],
    working: [
      { messageKey: "meeting-cost.working.room", arguments: roomArgs },
      {
        messageKey: "meeting-cost.working.budget",
        arguments: {
          budget: "decimal",
          roomHour: "decimal",
          exact: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<Input["operation"], OperationDescriptor>;
export const operations = Object.values(operationDescriptors);

export const errorCodes = [
  "invalid-field",
  "out-of-range",
  "no-attendees",
  "zero-cost",
  "output-overflow",
] as const;
export type ErrorCode = (typeof errorCodes)[number];

export type Group = {
  people: string;
  /** Annual salary of one person in this group. */
  salary: string;
  /** This group's share of the answer: cost per meeting, or cost per minute. */
  cost: string;
};

type Shared = {
  people: string;
  /** Fully loaded cost of the whole room per hour and per minute, in cents. */
  roomHour: string;
  roomMinute: string;
  groups: readonly Group[];
  descriptionKey: string;
  alternativeKey: string;
};

export type MeetingVisual = Shared & {
  kind: "meeting-cost";
  answer: string;
  minutes: string;
  refocus: string;
  frequency: Frequency;
  meetingsPerYear: string;
  /** The answer split into time in the room and time to refocus afterwards. */
  meetingPart: string;
  refocusPart: string;
  /** Settled per-meeting cost × meetings per year, and one twelfth of that. */
  yearly: string;
  monthly: string;
  personHours: string;
  /** Person-hours a year as a percentage of one person's paid hours. */
  fteShare: string;
  /** Yearly saving from one minute less, or from one average attendee less. */
  minuteSaving: string;
  fiveMinuteSaving: string;
  personSaving: string;
};

export type BudgetVisual = Shared & {
  kind: "budget-minutes";
  answer: string;
  budget: string;
  exactMinutes: string;
  /** Cost of a meeting that runs exactly the answered whole minutes. */
  spent: string;
};

export type Result = {
  calculatorId: "meeting-cost";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: MeetingVisual | BudgetVisual;
};

type Outcome = CalculationResult<Result, ErrorCode>;

function failure(code: ErrorCode, field?: string): Outcome {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}

type ParsedGroup = { people: Dec; salary: Dec };

/**
 * Reads canonical attendee groups, "people x salary" joined by ";", such as
 * "1x160000;5x120000". People are whole numbers; salaries are whole cents.
 */
export function parseAttendees(
  raw: string | undefined,
): ParsedGroup[] | "invalid-field" | "out-of-range" | "no-attendees" {
  if (!raw || raw.length > 1000) return "invalid-field";
  const tokens = raw.split(";");
  if (tokens.length > MAX_GROUPS) return "out-of-range";
  const groups: ParsedGroup[] = [];
  for (const token of tokens) {
    const match = /^(\d{1,6})x([^x]+)$/.exec(token);
    if (!match?.[1] || !match[2]) return "invalid-field";
    const people = Number(match[1]);
    if (people > MAX_GROUP_PEOPLE) return "out-of-range";
    const salary = parseUsdCents(match[2]);
    if (!salary.ok)
      return salary.error === "out-of-range" ? "out-of-range" : "invalid-field";
    groups.push({ people: new DecimalValue(people), salary: salary.dollars });
  }
  if (groups.every((g) => g.people.isZero())) return "no-attendees";
  return groups;
}

function bounded(
  text: string | undefined,
  min: number,
  max: number,
): Dec | "invalid-field" | "out-of-range" {
  const parsed = parseCanonicalDecimal(text ?? "");
  if (!parsed.ok) return "invalid-field";
  if (parsed.value.lt(min) || parsed.value.gt(max)) return "out-of-range";
  return parsed.value;
}

const usd = (value: Dec) => {
  const cents = roundUsdToCents(value);
  return cents === null ? null : usdCentsToString(cents);
};
const dec = (value: string): { kind: "decimal"; value: string } => ({
  kind: "decimal",
  value,
});

export function calculate(input: Input): Outcome {
  if (!Object.hasOwn(operationDescriptors, input.operation))
    return failure("invalid-field");
  const groups = parseAttendees(input.attendees);
  if (typeof groups === "string") return failure(groups, "attendees");
  const load = bounded(input.overhead, 1, 5);
  if (typeof load === "string") return failure(load, "overhead");
  const paidHours = bounded(input.hours, 1, 8784);
  if (typeof paidHours === "string") return failure(paidHours, "hours");

  const people = groups.reduce(
    (sum, g) => sum.add(g.people),
    new DecimalValue(0),
  );
  const salaryTotal = groups.reduce(
    (sum, g) => sum.add(g.people.mul(g.salary)),
    new DecimalValue(0),
  );
  if (salaryTotal.isZero()) return failure("zero-cost", "attendees");
  // Everything below stays exact (50 digits) until it is settled once to cents.
  const perMinute = (salary: Dec) => salary.mul(load).div(paidHours).div(60);
  const roomMinuteExact = perMinute(salaryTotal);
  const roomHourExact = roomMinuteExact.mul(60);
  const roomHour = usd(roomHourExact);
  const roomMinute = usd(roomMinuteExact);
  const salaryText = decimalOutput(salaryTotal);
  if (roomHour === null || roomMinute === null || salaryText === null)
    return failure("output-overflow");
  const roomStep: WorkingStep = {
    id: "room",
    messageKey: "meeting-cost.working.room",
    args: {
      people: dec(people.toFixed()),
      salaryTotal: dec(salaryText),
      overhead: dec(load.toFixed()),
      hours: dec(paidHours.toFixed()),
      roomHour: dec(roomHour),
    },
  };
  const groupCosts = (minutes: Dec) => {
    const out: Group[] = [];
    for (const g of groups) {
      const cost = usd(perMinute(g.people.mul(g.salary)).mul(minutes));
      if (cost === null) return null;
      out.push({
        people: g.people.toFixed(),
        salary: g.salary.toFixed(),
        cost,
      });
    }
    return out;
  };
  const shared = {
    people: people.toFixed(),
    roomHour,
    roomMinute,
    descriptionKey: "meeting-cost.visual.description",
    alternativeKey: "meeting-cost.visual.alternative",
  };

  if (input.operation === "budget-minutes") {
    const budget = parseUsdCents(input.budget ?? "", { positive: true });
    if (!budget.ok)
      return failure(
        budget.error === "out-of-range" || budget.error === "zero"
          ? "out-of-range"
          : "invalid-field",
        "budget",
      );
    const exact = budget.dollars.div(roomMinuteExact);
    const answer = decimalOutput(exact.floor());
    const exactText = decimalOutput(exact.toDecimalPlaces(2));
    const spent = usd(roomMinuteExact.mul(exact.floor()));
    const split = groupCosts(new DecimalValue(1));
    if (answer === null || exactText === null || spent === null || !split)
      return failure("output-overflow");
    return {
      ok: true,
      result: {
        calculatorId: "meeting-cost",
        operation: input.operation,
        answer: dec(answer),
        working: [
          roomStep,
          {
            id: "budget",
            messageKey: "meeting-cost.working.budget",
            args: {
              budget: dec(budget.dollars.toFixed()),
              roomHour: dec(roomHour),
              exact: dec(exactText),
              answer: dec(answer),
            },
          },
        ],
        visual: {
          ...shared,
          kind: "budget-minutes",
          answer,
          budget: budget.dollars.toFixed(),
          exactMinutes: exactText,
          spent,
          groups: split,
        },
      },
    };
  }

  const minutes = bounded(input.minutes, 1, 1440);
  if (typeof minutes === "string") return failure(minutes, "minutes");
  const frequency = input.frequency as Frequency;
  if (!Object.hasOwn(meetingsPerYear, frequency))
    return failure("invalid-field", "frequency");
  const refocus = bounded(input.refocus, 0, 240);
  if (typeof refocus === "string") return failure(refocus, "refocus");

  const count = new DecimalValue(meetingsPerYear[frequency]);
  const billed = minutes.add(refocus);
  const answerCents = roundUsdToCents(roomMinuteExact.mul(billed));
  if (answerCents === null) return failure("output-overflow");
  const answer = usdCentsToString(answerCents);
  // A year is the settled meeting repeated, so the yearly figure is exact cents.
  const yearlyCents = answerCents * BigInt(meetingsPerYear[frequency]);
  const yearly = usd(new DecimalValue(yearlyCents.toString()).div(100));
  const monthly = usd(new DecimalValue(yearlyCents.toString()).div(1200));
  const meetingPart = usd(roomMinuteExact.mul(minutes));
  const refocusPart = usd(roomMinuteExact.mul(refocus));
  const minuteSaving = usd(roomMinuteExact.mul(count));
  const fiveMinuteSaving = usd(roomMinuteExact.mul(count).mul(5));
  const personSaving = usd(roomMinuteExact.div(people).mul(billed).mul(count));
  const personHours = people.mul(billed).mul(count).div(60);
  const personHoursText = decimalOutput(personHours.toDecimalPlaces(2));
  const fteShare = decimalOutput(
    personHours.div(paidHours).mul(100).toDecimalPlaces(2),
  );
  const split = groupCosts(billed);
  if (
    yearly === null ||
    monthly === null ||
    meetingPart === null ||
    refocusPart === null ||
    minuteSaving === null ||
    fiveMinuteSaving === null ||
    personSaving === null ||
    personHoursText === null ||
    fteShare === null ||
    !split
  )
    return failure("output-overflow");

  const working: WorkingStep[] = [
    roomStep,
    refocus.isZero()
      ? {
          id: "meeting",
          messageKey: "meeting-cost.working.meeting",
          args: {
            roomHour: dec(roomHour),
            minutes: dec(minutes.toFixed()),
            answer: dec(answer),
          },
        }
      : {
          id: "meeting",
          messageKey: "meeting-cost.working.meeting-refocus",
          args: {
            roomHour: dec(roomHour),
            minutes: dec(minutes.toFixed()),
            refocus: dec(refocus.toFixed()),
            answer: dec(answer),
          },
        },
  ];
  if (frequency !== "once")
    working.push({
      id: "year",
      messageKey: "meeting-cost.working.year",
      args: {
        frequency: {
          kind: "message",
          key: `meeting-cost.frequency.${frequency}`,
        },
        count: dec(count.toFixed()),
        answer: dec(answer),
        yearly: dec(yearly),
      },
    });

  return {
    ok: true,
    result: {
      calculatorId: "meeting-cost",
      operation: input.operation,
      answer: dec(answer),
      working,
      visual: {
        ...shared,
        kind: "meeting-cost",
        answer,
        minutes: minutes.toFixed(),
        refocus: refocus.toFixed(),
        frequency,
        meetingsPerYear: count.toFixed(),
        meetingPart,
        refocusPart,
        yearly,
        monthly,
        personHours: personHoursText,
        fteShare,
        minuteSaving,
        fiveMinuteSaving,
        personSaving,
        groups: split,
      },
    },
  };
}
