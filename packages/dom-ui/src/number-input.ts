import { DecimalValue } from "../../calculators/src/numeric/decimal";

export type NumberMarks = { decimal: string; group: string };

export function numberMarks(locale: string): NumberMarks {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    group: parts.find((part) => part.type === "group")?.value ?? "",
  };
}

const isDigit = (char: string) => char >= "0" && char <= "9";

/** Keep only what a number draft may contain: sign, digits, one decimal mark. */
export function cleanDraft(
  text: string,
  marks: NumberMarks,
  options: { integer?: boolean; signed?: boolean } = {},
): string {
  const signed = options.signed ?? true;
  let out = "";
  let hasDecimal = false;
  for (const char of text) {
    if (isDigit(char)) out += char;
    else if (char === marks.decimal && !options.integer && !hasDecimal) {
      hasDecimal = true;
      out += char;
    } else if (out === "" && signed && "-−–".includes(char)) out = "-";
    else if (out === "" && signed && char === "+") out = "+";
  }
  return out;
}

/** Display form of a draft: thousands grouping, nothing else changed. */
export function formatDraft(draft: string, marks: NumberMarks): string {
  const sign = /^[+-]/.test(draft) ? draft[0] : "";
  const body = sign ? draft.slice(1) : draft;
  const at = body.indexOf(marks.decimal);
  const integer = at === -1 ? body : body.slice(0, at);
  const rest = at === -1 ? "" : body.slice(at);
  const grouped = marks.group
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, marks.group)
    : integer;
  return `${sign}${grouped}${rest}`;
}

/** Number of draft characters (not separators) before a display position. */
export function coreCount(
  display: string,
  position: number,
  marks: NumberMarks,
): number {
  let count = 0;
  for (const char of display.slice(0, position)) {
    if (isDigit(char) || char === marks.decimal || "-+".includes(char)) count++;
  }
  return count;
}

/** Display position that follows `core` draft characters. */
export function displayPosition(
  display: string,
  core: number,
  marks: NumberMarks,
): number {
  if (core <= 0) return 0;
  let count = 0;
  for (let index = 0; index < display.length; index++) {
    const char = display[index] ?? "";
    if (isDigit(char) || char === marks.decimal || "-+".includes(char)) count++;
    if (count === core) return index + 1;
  }
  return display.length;
}

/** Turn pasted text such as "$1,234.50", "1.234,5" or "50 %" into a draft. */
export function interpretPaste(text: string, marks: NumberMarks): string {
  const stripped = text
    .trim()
    .replace(/[\s  ']/g, "")
    .replace(/[−–]/g, "-")
    .replace(/[^\d.,+-]/g, "");
  const lastDot = stripped.lastIndexOf(".");
  const lastComma = stripped.lastIndexOf(",");
  let decimal = "";
  if (lastDot !== -1 && lastComma !== -1) {
    decimal = lastDot > lastComma ? "." : ",";
  } else {
    const only = lastDot !== -1 ? "." : lastComma !== -1 ? "," : "";
    const count = only ? stripped.split(only).length - 1 : 0;
    const after = only ? stripped.length - stripped.lastIndexOf(only) - 1 : 0;
    // A lone separator followed by exactly three digits is grouping when it
    // is not this locale's decimal mark; otherwise treat it as the decimal.
    if (only && count === 1 && !(after === 3 && only !== marks.decimal)) {
      decimal = only;
    }
  }
  let out = "";
  for (const char of stripped) {
    if (char === "." || char === ",") {
      if (char === decimal && !out.includes(marks.decimal))
        out += marks.decimal;
    } else out += char;
  }
  return out;
}

const SIGNED = /^[+-]?(\d+(\.\d*)?|\.\d+)?$/;

/** Step a draft by `amount`; invalid or empty drafts start from zero. */
export function stepDraft(
  draft: string,
  amount: number,
  marks: NumberMarks,
): string {
  const canonical =
    marks.decimal === "." ? draft : draft.replace(marks.decimal, ".");
  let base = new DecimalValue(0);
  if (SIGNED.test(canonical) && /\d/.test(canonical)) {
    base = new DecimalValue(canonical.replace(/^\+/, ""));
  }
  const next = base.plus(amount).toFixed();
  return marks.decimal === "." ? next : next.replace(".", marks.decimal);
}

/** Short symbol for a unit message such as "metres (m)" or "percent (%)". */
export function unitAffix(
  unitKey: string | undefined,
  unitText: string | undefined,
): { prefix?: string; suffix?: string } {
  if (!unitKey || !unitText) return {};
  if (unitKey === "unit.usd") return { prefix: "$" };
  const symbol = /\(([^)]+)\)\s*$/.exec(unitText)?.[1];
  return symbol ? { suffix: symbol } : {};
}
