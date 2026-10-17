import {
  calculate,
  type ErrorCode,
  type Input,
  operations,
  type Result,
} from "../../../../calculators/src/meeting-cost";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";

/** One attendee row as typed: a people draft and a salary draft. */
export type Row = { people: string; salary: string };

/** Drafts keep the engine's "people x salary;…" shape, with locale number text. */
export const rowsOf = (draft: string): Row[] =>
  draft.split(";").map((token) => {
    const [people = "", salary = ""] = token.split("x");
    return { people, salary };
  });
export const draftOf = (rows: readonly Row[]): string =>
  rows.map((r) => `${r.people}x${r.salary}`).join(";");

export const adapter: TopicAdapter<Result, ErrorCode> = {
  id: "meeting-cost",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "choice") return { state: "valid", canonical: raw };
    if (field.id !== "attendees") return parseLocaleDecimal(raw, locale);
    if (raw.length > 1000) return { state: "invalid", reason: "too-long" };
    const canonical: string[] = [];
    for (const row of rowsOf(raw)) {
      const people = row.people.trim();
      if (people === "" || row.salary.trim() === "")
        return { state: "incomplete" };
      if (!/^\d+$/.test(people))
        return { state: "invalid", reason: "invalid-character" };
      const salary = parseLocaleDecimal(row.salary, locale);
      if (salary.state !== "valid") return salary;
      canonical.push(`${Number(people)}x${salary.canonical}`);
    }
    return { state: "valid", canonical: canonical.join(";") };
  },
  calculate(operation, fields) {
    return calculate({ ...fields, operation } as Input);
  },
};

/** Working-step arguments that are whole-cent dollar amounts. */
export const moneyArgs = [
  "salaryTotal",
  "roomHour",
  "answer",
  "yearly",
  "budget",
] as const;
