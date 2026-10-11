import { calculatorCatalog, packCatalog } from "@open-calculators/calculators";
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://librecalculator.com");
  const paths = [
    "/",
    "/about/",
    ...packCatalog.map((pack) => `/packs/${pack.id}/`),
    ...calculatorCatalog.map((item) => `/calculators/${item.slug}/`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, base).href}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
