import { calculatorCatalog, packCatalog } from "@open-calculators/calculators";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Every page with a social card, keyed by the PNG name under /og/. */
export const ogKeys = [
  "home",
  ...packCatalog.map((pack) => `pack-${pack.id}`),
  ...calculatorCatalog.map((item) => item.slug),
];

/** Maps a site path to its card: /, /packs/<id>/ and /calculators/<slug>/. */
export function ogImagePath(pathname: string): string {
  const [section, name] = pathname.split("/").filter(Boolean);
  const key =
    section === "packs" && name
      ? `pack-${name}`
      : section === "calculators" && name
        ? name
        : "home";
  return `/og/${ogKeys.includes(key) ? key : "home"}.png`;
}
