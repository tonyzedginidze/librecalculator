import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { calculatorCatalog } from "../packages/calculators/src/catalog.generated";
import { packCatalog } from "../packages/calculators/src/packs.generated";
import { PACK_STORAGE_KEY } from "../packages/calculators/src/runtime/packs";
import { calculatorRoute } from "../packages/dom-ui/src/catalog";
import { captureScenes, showScene } from "./export-art/browser";
import { readPngPixels } from "./export-art/png";

export type Theme = "light" | "dark";
export type ExportOptions = {
  url: string;
  out: string | undefined;
  ids: string[] | undefined;
  themes: Theme[];
  all: boolean;
};

const usage = `bun run export:art [--url http://localhost:4321] [--out directory]
  [--ids length,circle] [--theme light|dark|both] [--all]
Default selection: non-core calculators, excluding discount. --ids overrides
that selection; --all selects the whole catalog. Outputs native 320x180 PNGs
and manifest.json. Requires the live Astro dev server (not preview), installed
agent-browser and its Chromium browser.`;

export function assertLiveSource(html: string, url: string) {
  if (!/<script\b[^>]*\bsrc=["'][^"']*\/@vite\/client(?:[?"'])/.test(html))
    throw new Error(
      `${url} is not the live Astro/Vite dev server. Built preview assets can be stale after source edits. Start bun run dev:web and use its actual URL before exporting current-source art.`,
    );
}

export function parseOptions(args: string[]): ExportOptions {
  const options: ExportOptions = {
    url: "http://localhost:4321",
    out: undefined,
    ids: undefined,
    themes: ["light", "dark"],
    all: false,
  };
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (!flag || seen.has(flag)) throw new Error(`Duplicate option: ${flag}`);
    seen.add(flag);
    if (flag === "--all") {
      options.all = true;
      continue;
    }
    if (!["--url", "--out", "--ids", "--theme"].includes(flag))
      throw new Error(`Unknown option: ${flag}\n${usage}`);
    const value = args[++index];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${flag}`);
    if (flag === "--url") {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol))
        throw new Error("--url must be an HTTP(S) catalog URL");
      options.url = url.href;
    } else if (flag === "--out") options.out = resolve(value);
    else if (flag === "--ids") {
      options.ids = value.split(",").map((id) => id.trim());
      if (options.ids.some((id) => !/^[a-z][a-z0-9-]*$/.test(id)))
        throw new Error(
          "--ids must be a comma-separated list of calculator IDs",
        );
      if (new Set(options.ids).size !== options.ids.length)
        throw new Error("--ids contains duplicates");
    } else {
      if (value !== "light" && value !== "dark" && value !== "both")
        throw new Error("--theme must be light, dark or both");
      options.themes = value === "both" ? ["light", "dark"] : [value];
    }
  }
  if (options.all && options.ids) throw new Error("Use either --all or --ids");
  return options;
}

export function selectCalculators(options: Pick<ExportOptions, "ids" | "all">) {
  const core = new Set<string>(
    packCatalog.find((pack) => pack.id === "core")?.calculatorIds ?? [],
  );
  const selected = options.ids
    ? options.ids.map((id) => {
        const item = calculatorCatalog.find((entry) => entry.id === id);
        if (!item) throw new Error(`Unknown calculator ID: ${id}`);
        return item;
      })
    : calculatorCatalog.filter(
        (item) => options.all || (!core.has(item.id) && item.id !== "discount"),
      );
  if (!selected.length) throw new Error("No calculators selected");
  return selected;
}

async function exportArt(options: ExportOptions) {
  const selected = selectCalculators(options);
  const page = await fetch(options.url, { signal: AbortSignal.timeout(10000) });
  if (!page.ok) throw new Error(`${page.url}: HTTP ${page.status}`);
  assertLiveSource(await page.text(), page.url);
  console.log(`Current-source runtime: ${page.url} (Astro/Vite development)`);
  const executable = Bun.which("agent-browser");
  if (!executable)
    throw new Error("agent-browser is not installed or is not on PATH");
  const tempRoot = join(tmpdir(), "opencode");
  if (!options.out) await mkdir(tempRoot, { recursive: true });
  const out = options.out ?? (await mkdtemp(join(tempRoot, "art-export-")));
  await mkdir(out, { recursive: true });
  // A private config and clean CLI environment prevent profile/CDP/state defaults
  // from connecting this export to an existing user's browser.
  const config = join(out, `.agent-browser-${process.pid}.json`);
  await writeFile(config, "{}\n");
  const session = `art-export-${process.pid}`;
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !key.startsWith("AGENT_BROWSER_"),
    ),
  );
  const cli = async (...args: string[]) => {
    const child = Bun.spawn(
      [executable, "--config", config, "--session", session, "--json", ...args],
      { env, stdout: "pipe", stderr: "pipe" },
    );
    const [stdout, stderr, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code !== 0)
      throw new Error(`agent-browser ${args[0]} failed: ${stderr || stdout}`);
    const response = JSON.parse(stdout) as {
      success: boolean;
      error?: string;
      data: { result: unknown };
    };
    if (!response.success)
      throw new Error(`agent-browser ${args[0]} failed: ${response.error}`);
    return response.data;
  };
  const evaluate = async <T>(script: string): Promise<T> =>
    (await cli("eval", "-b", Buffer.from(script).toString("base64")))
      .result as T;
  let opened = false;
  const artifacts = [];
  try {
    opened = true; // Also close a partially opened session after navigation fails.
    await cli("open", options.url);
    await cli("set", "viewport", "320", "180", "1");
    await cli("set", "media", "light", "reduced-motion");
    await cli("wait", ".oc-tile .oc-art");
    await evaluate(`localStorage.setItem(${JSON.stringify(PACK_STORAGE_KEY)},
      ${JSON.stringify(JSON.stringify(packCatalog.map((pack) => pack.id)))});
      window.dispatchEvent(new Event('oc.packs.changed')); true`);
    // Reload after writing the real preference: React reads it on hydration.
    await cli("reload");
    await cli(
      "wait",
      "--fn",
      `document.querySelector('astro-island') && !document.querySelector('astro-island[ssr]')`,
    );
    const requests = selected.map((item) => ({
      ...item,
      route: calculatorRoute(item.id),
    }));
    const ready = requests.map(
      (item) => `.oc-tile[href=${JSON.stringify(item.route)}] .oc-art`,
    );
    await cli(
      "wait",
      "--fn",
      `${JSON.stringify(ready)}.every(selector => document.querySelector(selector))`,
    );
    for (const theme of options.themes) {
      await cli("set", "media", theme, "reduced-motion");
      const scenes = await evaluate<Awaited<ReturnType<typeof captureScenes>>>(
        `(${captureScenes.toString()})(${JSON.stringify(requests)}, ${JSON.stringify(theme)})`,
      );
      const baselinePath = join(out, `.background-${theme}-${process.pid}.png`);
      try {
        for (const scene of scenes) {
          const geometry = await evaluate<
            Awaited<ReturnType<typeof showScene>>
          >(`(${showScene.toString()})(${JSON.stringify(scene.id)})`);
          const file = join(out, `${scene.id}-${theme}.png`);
          await cli("screenshot", "--screenshot-format", "png", file);
          const png = readPngPixels(await readFile(file));
          // Capture the identical viewport without the SVG to detect empty art,
          // including a non-uniform gradient background rather than just white.
          await evaluate(
            `(async () => {
              document.querySelector('#oc-art-export svg').style.visibility = 'hidden';
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
              return true;
            })()`,
          );
          await cli("screenshot", "--screenshot-format", "png", baselinePath);
          const background = readPngPixels(await readFile(baselinePath), true);
          if (png.equals(background))
            throw new Error(`${file}: empty art image`);
          artifacts.push({ ...scene, theme, geometry, path: file });
          console.log(`${scene.id} ${theme}: ${file}`);
        }
      } finally {
        await rm(baselinePath, { force: true });
      }
    }
    const manifest = join(out, "manifest.json");
    await writeFile(
      manifest,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          sourceUrl: options.url,
          sourceMode: "astro-vite-development",
          hydration: "complete",
          viewport: { width: 320, height: 180, deviceScaleFactor: 1 },
          selection: selected.map((item) => item.id),
          themes: options.themes,
          count: artifacts.length,
          artifacts,
        },
        null,
        2,
      )}\n`,
    );
    console.log(`Exported ${artifacts.length} PNGs. Manifest: ${manifest}`);
  } finally {
    try {
      if (opened) await cli("close");
    } finally {
      await rm(config, { force: true });
    }
  }
}

if (import.meta.main) {
  try {
    if (process.argv.slice(2).includes("--help")) console.log(usage);
    else await exportArt(parseOptions(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
