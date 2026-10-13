import { calculatorCatalog, packCatalog } from "@open-calculators/calculators";
import { en } from "@open-calculators/i18n";
import { ui } from "@open-calculators/i18n/ui";

const messages: Readonly<Record<string, string>> = { ...en, ...ui };

export { repositoryUrl as repository } from "@open-calculators/dom-ui/catalog";

import { repositoryUrl as repository } from "@open-calculators/dom-ui/catalog";

/** Google's application categories, closest match per catalog category. */
const applicationCategory: Record<string, string> = {
  finance: "FinanceApplication",
  health: "HealthApplication",
  education: "EducationalApplication",
};

/** schema.org JSON-LD for a site path: the site itself, a pack or a calculator. */
export function structuredData(pathname: string, site: URL) {
  const [section, name] = pathname.split("/").filter(Boolean);
  const url = (path: string) => new URL(path, site).href;
  const home = url("/");
  const website = {
    "@type": "WebSite",
    "@id": `${home}#website`,
    name: ui["ui.app.name"],
    url: home,
    description: ui["ui.seo.home.description"],
    inLanguage: "en",
    publisher: { "@id": `${home}#organization` },
  };
  const organization = {
    "@type": "Organization",
    "@id": `${home}#organization`,
    name: ui["ui.app.name"],
    url: home,
    logo: {
      "@type": "ImageObject",
      url: url("/logo-512.png"),
      width: 512,
      height: 512,
    },
    sameAs: [repository],
  };
  const crumbs = (items: { name: string; path: string }[]) => ({
    "@type": "BreadcrumbList",
    "@id": `${url(items.at(-1)?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: url(item.path),
    })),
  });
  // Every page carries the site and publisher nodes so @id references resolve.
  const graph: object[] = [website, organization];
  const item =
    section === "calculators"
      ? calculatorCatalog.find((candidate) => candidate.slug === name)
      : undefined;
  if (item) {
    const pack = packCatalog.find((candidate) =>
      (candidate.calculatorIds as readonly string[]).includes(item.id),
    );
    const title = messages[item.titleKey] ?? item.id;
    graph.push(
      {
        "@type": "WebApplication",
        "@id": `${url(`/calculators/${item.slug}/`)}#app`,
        name: title,
        description: messages[item.descriptionKey],
        url: url(`/calculators/${item.slug}/`),
        image: url(`/og/${item.slug}.png`),
        applicationCategory:
          applicationCategory[item.category] ?? "UtilitiesApplication",
        inLanguage: "en",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isPartOf: { "@id": `${home}#website` },
        publisher: { "@id": `${home}#organization` },
      },
      crumbs([
        { name: ui["ui.app.name"], path: "/" },
        ...(pack
          ? [
              {
                name: messages[pack.titleKey] ?? pack.id,
                path: `/packs/${pack.id}/`,
              },
            ]
          : []),
        { name: title, path: `/calculators/${item.slug}/` },
      ]),
    );
  }
  const pack =
    section === "packs"
      ? packCatalog.find((candidate) => candidate.id === name)
      : undefined;
  if (pack) {
    const ids = new Set<string>(pack.calculatorIds);
    graph.push(
      {
        "@type": "CollectionPage",
        "@id": `${url(`/packs/${pack.id}/`)}#webpage`,
        inLanguage: "en",
        breadcrumb: { "@id": `${url(`/packs/${pack.id}/`)}#breadcrumb` },
        name: messages[pack.titleKey] ?? pack.id,
        description: messages[pack.descriptionKey],
        url: url(`/packs/${pack.id}/`),
        isPartOf: { "@id": `${home}#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: calculatorCatalog
            .filter((candidate) => ids.has(candidate.id))
            .map((candidate, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: messages[candidate.titleKey],
              url: url(`/calculators/${candidate.slug}/`),
            })),
        },
      },
      crumbs([
        { name: ui["ui.app.name"], path: "/" },
        {
          name: messages[pack.titleKey] ?? pack.id,
          path: `/packs/${pack.id}/`,
        },
      ]),
    );
  }
  if (section === "download") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${url("/download/")}#app`,
      name: ui["ui.app.name"],
      description: ui["ui.download.description"],
      url: url("/download/"),
      downloadUrl: `${repository}/releases/latest`,
      image: url("/download/desktop-light.webp"),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "macOS, Windows, Linux",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${home}#organization` },
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
