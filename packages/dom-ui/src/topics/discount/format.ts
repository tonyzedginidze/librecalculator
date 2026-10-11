import { formatDecimal } from "../../../../i18n/src/en";
import { fillMessage } from "../../components/viz";
import { messageText } from "../../lesson-text";

type Messages = Readonly<Record<string, string>>;

/** Discount percentages show two decimals at most ("33.33%"). */
export const PERCENT_DIGITS = 2;

/** Money at cents precision with both cent digits kept ("$54.40", not "$54.4"). */
export function money(
  canonical: string,
  locale: string,
  messages: Messages,
): string {
  const negative = canonical.startsWith("-");
  const text = formatDecimal(canonical.replace(/^[+-]/, ""), locale, {
    fractionDigits: 2,
  });
  const decimal = formatDecimal("0.5", locale).replace(/\d/g, "");
  const [whole = "", cents = ""] = text.split(decimal);
  const amount = `${whole}${decimal}${cents.padEnd(2, "0")}`;
  const filled = fillMessage(messageText(messages, "discount.format.money"), {
    amount,
  });
  return amount === `0${decimal}00` || !negative
    ? filled
    : `${formatDecimal("-1", locale).replace(/\d/g, "")}${filled}`;
}

export function percent(
  canonical: string,
  locale: string,
  messages: Messages,
): string {
  return fillMessage(messageText(messages, "discount.format.percent"), {
    amount: formatDecimal(canonical, locale, {
      fractionDigits: PERCENT_DIGITS,
    }),
  });
}
