import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { calculatorCatalog } from "../packages/calculators/src/catalog.generated";
import { packCatalog } from "../packages/calculators/src/packs.generated";

const dist = join(import.meta.dir, "../apps/web/dist");
const hashes = createHash("sha256");
const read = async (url: string) => {
  const path =
    url === "/" ? "/index.html" : url.endsWith("/") ? `${url}index.html` : url;
  return readFile(join(dist, path), "utf8");
};
// Only static dependencies: following every dynamic import would cache inactive packs.
async function dependencies(start: string[]): Promise<string[]> {
  const seen = new Set<string>();
  const visit = async (url: string) => {
    if (seen.has(url)) return;
    seen.add(url);
    const source = await read(url);
    hashes.update(url).update(source);
    const links = url.endsWith("/")
      ? [...source.matchAll(/["'](\/_astro\/[^"'<>\s]+\.(?:js|css))["']/g)].map(
          (match) => match[1] as string,
        )
      : url.endsWith(".js")
        ? [
            ...source.matchAll(
              /(?:\bimport\s*(?:[^;"']*?\bfrom\s*)?|\bexport\s*[^;"']*?\bfrom\s*)["']([^"']+\.(?:js|css))["']/g,
            ),
          ].map(
            (match) =>
              new URL(match[1] as string, `https://offline.local${url}`)
                .pathname,
          )
        : [];
    await Promise.all(
      links.filter((path) => path.startsWith("/_astro/")).map(visit),
    );
  };
  for (const url of start) await visit(url);
  return [...seen].sort();
}
const assets: Record<string, string[]> = {};
for (const pack of packCatalog) {
  const ids = new Set<string>(pack.calculatorIds);
  assets[pack.id] = await dependencies([
    ...(pack.id === "core" ? ["/"] : []),
    `/packs/${pack.id}/`,
    ...calculatorCatalog
      .filter((item) => ids.has(item.id))
      .map((item) => `/calculators/${item.slug}/`),
  ]);
}
const version = hashes.digest("hex").slice(0, 16);
await writeFile(
  join(dist, "offline-packs.json"),
  JSON.stringify({ version, assets }),
);
const worker = await readFile(
  join(import.meta.dir, "../apps/web/offline-worker.js"),
  "utf8",
);
await writeFile(
  join(dist, "sw.js"),
  `const VERSION=${JSON.stringify(version)};\nconst PACK_ASSETS=${JSON.stringify(assets)};\n${worker}`,
);
console.log(
  `Offline ${version}: ${Object.entries(assets)
    .map(([id, urls]) => `${id} ${urls.length} resources`)
    .join(", ")}`,
);
