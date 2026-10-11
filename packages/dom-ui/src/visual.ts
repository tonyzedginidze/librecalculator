import { formatDecimal } from "../../i18n/src/en";

export type PercentageVisualShape = {
  value: string;
  reference: string;
  fraction: string;
  outside: boolean;
  sign: "negative" | "zero" | "positive";
  descriptionKey: string;
  alternativeKey: string;
  outsideLabelKey: string;
};

export type BarModel = {
  widthPercent: number;
  outside: boolean;
  sign: PercentageVisualShape["sign"];
  valueText: string;
  referenceText: string;
  fractionText: string;
  descriptionKey: string;
  alternativeKey: string;
  outsideLabelKey: string;
};

/** Presentation width only. The answer, sign, and outside flag come from the shared result. */
export function percentageBarModel(
  visual: PercentageVisualShape,
  locale: string,
): BarModel {
  return {
    widthPercent: fillWidth(visual.fraction),
    outside: visual.outside,
    sign: visual.sign,
    valueText: formatDecimal(visual.value, locale),
    referenceText: formatDecimal(visual.reference, locale),
    fractionText: formatDecimal(visual.fraction, locale),
    descriptionKey: visual.descriptionKey,
    alternativeKey: visual.alternativeKey,
    outsideLabelKey: visual.outsideLabelKey,
  };
}

function fillWidth(fraction: string): number {
  if (!/^(?:0|1|0\.\d+|1\.0+)$/.test(fraction)) return 0;
  const value = Number(fraction);
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value * 100));
}
