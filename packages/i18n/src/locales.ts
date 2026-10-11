/** Locale registry. Only English ships; add a locale here and in `catalogs`. */
export const defaultLocale = "en";
export const supportedLocales = ["en"] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeTags: Record<Locale, string> = { en: "en-US" };
export const localeDirections: Record<Locale, "ltr" | "rtl"> = { en: "ltr" };

export type MessageCatalog = Readonly<Record<string, string>>;

/** Message lookup that falls back to the default locale, then to the key. */
export function resolveMessage(
  catalogs: Partial<Record<Locale, MessageCatalog>>,
  locale: Locale,
  key: string,
): string {
  const own = catalogs[locale];
  if (own && Object.hasOwn(own, key)) return own[key] ?? key;
  const fallback = catalogs[defaultLocale];
  return fallback && Object.hasOwn(fallback, key)
    ? (fallback[key] ?? key)
    : key;
}

/** Keys present in the default catalog but missing from `catalog`. */
export function missingKeys(
  reference: MessageCatalog,
  catalog: MessageCatalog,
): string[] {
  return Object.keys(reference).filter((key) => !Object.hasOwn(catalog, key));
}

/** Fill `{name}` placeholders with plain string values. */
export function formatMessage(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_.-]*)\}/g,
    (placeholder, name: string) => values[name] ?? placeholder,
  );
}
