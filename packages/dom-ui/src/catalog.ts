import type { CalculatorId } from "../../calculators/src/catalog.generated";
import { calculatorCatalog } from "../../calculators/src/catalog.generated";
import { calculatorPacks } from "../../calculators/src/packs.generated";
import { en } from "../../i18n/src/en";

/** The project's source repository, linked from the sidebar, footer and schema. */
export const repositoryUrl =
  "https://github.com/tonyzedginidze/librecalculator";

/** The creator's LinkedIn profile, linked from the sidebar card. */
export const creatorUrl = "https://www.linkedin.com/in/tokozedg";

export function calculatorRoute(id: CalculatorId): string {
  const item = calculatorCatalog.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown calculator ID: ${id}`);
  return `/calculators/${item.slug}/`;
}

export const categoryOrder = [
  "math",
  "geometry",
  "units",
  "finance",
  "cooking",
  "education",
  "health",
  "construction",
  "date-time",
  "statistics",
  "physics",
] as const;
export type Category = (typeof categoryOrder)[number];

export type CatalogItem = {
  id: CalculatorId;
  packId: string;
  category: Category;
  title: string;
  description: string;
  keywords: string;
};

const displayOrder: readonly string[] = [
  "percentage",
  "percentage-change",
  "fractions",
  "area",
  "volume",
  "pythagorean",
  "unit-conversion",
  "compound-interest",
  "loan-payments",
  "tip-splitting",
];
const rank = (id: string) => {
  const index = displayOrder.indexOf(id);
  return index === -1 ? displayOrder.length : index;
};

export const catalogItems: readonly CatalogItem[] = [...calculatorCatalog]
  .sort((a, b) => rank(a.id) - rank(b.id))
  .map((item) => ({
    id: item.id,
    packId:
      (calculatorPacks as Readonly<Record<string, string>>)[item.id] ?? "core",
    category: item.category as Category,
    title: en[item.titleKey],
    description: en[item.descriptionKey],
    keywords: [item.id, item.category, ...item.searchKeys.map((k) => en[k])]
      .join(" ")
      .toLowerCase(),
  }));

export function filterItems(
  items: readonly CatalogItem[],
  query: string,
  category: Category | "all" = "all",
): CatalogItem[] {
  const needle = query.trim().toLowerCase();
  const matches = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!needle ||
        `${item.title} ${item.description} ${item.keywords}`
          .toLowerCase()
          .includes(needle)),
  );
  if (!needle) return matches;
  // Title matches first, so "comp" finds Compound interest before a
  // description that happens to say "compare". Ties keep catalog order.
  const relevance = (item: CatalogItem) => {
    const title = item.title.toLowerCase();
    if (title.startsWith(needle)) return 0;
    if (title.split(/[\s-]+/).some((word) => word.startsWith(needle))) return 1;
    if (title.includes(needle)) return 2;
    if (item.keywords.includes(needle)) return 3;
    return 4;
  };
  return matches
    .map((item) => ({ item, score: relevance(item) }))
    .sort((a, b) => a.score - b.score)
    .map(({ item }) => item);
}
