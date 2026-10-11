import { calculatorCatalog, packCatalog } from "@open-calculators/calculators";
import { en } from "@open-calculators/i18n";
import { ui } from "@open-calculators/i18n/ui";
import type { APIRoute } from "astro";

const messages: Readonly<Record<string, string>> = { ...en, ...ui };

/** llms.txt: a plain index of every calculator for language-model tools. */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://librecalculator.com");
  const link = (path: string) => new URL(path, base).href;
  const sections = packCatalog.map((pack) => {
    const ids = new Set<string>(pack.calculatorIds);
    const lines = calculatorCatalog
      .filter((item) => ids.has(item.id))
      .map(
        (item) =>
          `- [${messages[item.titleKey]}](${link(`/calculators/${item.slug}/`)}): ${messages[item.descriptionKey]}`,
      );
    return `## ${messages[pack.titleKey]}\n\n${messages[`ui.pack.${pack.id}.intro`] ?? ""}\n\n${lines.join("\n")}`;
  });
  const body = [
    `# ${ui["ui.app.name"]}`,
    `> ${ui["ui.seo.home.description"]}`,
    ui["ui.about.accuracy.text"],
    `- [${ui["ui.about.title"]}](${link("/about/")})`,
    ...sections,
  ].join("\n\n");
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
