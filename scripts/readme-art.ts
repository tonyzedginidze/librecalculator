import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { packCatalog } from "../packages/calculators/src/packs.generated";
import { PACK_STORAGE_KEY } from "../packages/calculators/src/runtime/packs";
import { variableCss } from "../packages/design/src/css";
import { ui } from "../packages/i18n/src/ui";

// Renders the README banners in .github/readme from the built web site, so the
// art, tokens and calculator markup always match the product.
// Usage: bun run build:web && bun run readme:art

const root = resolve(import.meta.dir, "..");
const dist = join(root, "apps/web/dist");
const out = join(root, ".github/readme");

type Banner = { id: string; width: number; height: number; themes: string[] };
const both = ["light", "dark"];
const banners: Banner[] = [
  { id: "hero", width: 960, height: 440, themes: both },
  { id: "star", width: 960, height: 112, themes: both },
  { id: "f-working", width: 480, height: 270, themes: both },
  { id: "f-packs", width: 480, height: 270, themes: both },
  { id: "f-platforms", width: 480, height: 270, themes: both },
  { id: "f-exact", width: 480, height: 270, themes: both },
  { id: "packs", width: 960, height: 444, themes: both },
  { id: "social", width: 1280, height: 640, themes: ["light"] },
];

const mime: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

if (!existsSync(join(dist, "index.html")))
  throw new Error("apps/web/dist is missing. Run bun run build:web first.");

let page = "";
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/__readme-art")
      return new Response(page, { headers: { "content-type": "text/html" } });
    let file = join(dist, decodeURIComponent(pathname));
    if (!extname(file)) file = join(file, "index.html");
    if (!file.startsWith(dist) || !existsSync(file))
      return new Response("Not found", { status: 404 });
    return new Response(Bun.file(file), {
      headers: { "content-type": mime[extname(file)] ?? "" },
    });
  },
});
const base = `http://localhost:${server.port}`;

const executable = Bun.which("agent-browser");
if (!executable) throw new Error("agent-browser is not installed or on PATH");
const work = join(tmpdir(), `readme-art-${process.pid}`);
await mkdir(work, { recursive: true });
const config = join(work, "agent-browser.json");
await writeFile(config, "{}\n");
const session = `readme-art-${process.pid}`;
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
    throw new Error(`agent-browser ${args[0]}: ${stderr || stdout}`);
  const response = JSON.parse(stdout) as {
    success: boolean;
    error?: string;
    data: { result: unknown };
  };
  if (!response.success)
    throw new Error(`agent-browser ${args[0]}: ${response.error}`);
  return response.data;
};
const evaluate = async <T>(script: string): Promise<T> =>
  (await cli("eval", "-b", Buffer.from(script).toString("base64"))).result as T;
const visit = async (path: string) => {
  await cli("open", base + path);
  await evaluate(
    "document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 400)))",
  );
};

// Inputs are React-controlled, so copy live values into attributes before serializing.
const grab = (selector: string) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) throw new Error("Missing ${selector}");
  for (const input of el.querySelectorAll("input")) input.setAttribute("value", input.value);
  return el.outerHTML;
})()`;

try {
  await cli("set", "viewport", "1440", "900", "1");
  await cli("set", "media", "light", "reduced-motion");
  await visit("/");
  await evaluate(
    `localStorage.setItem(${JSON.stringify(PACK_STORAGE_KEY)}, ${JSON.stringify(
      JSON.stringify(packCatalog.map((pack) => pack.id)),
    )})`,
  );
  await visit("/");
  const tiles = await evaluate<
    unknown[]
  >(`[...document.querySelectorAll("a.oc-tile")].map((a) => ({
    id: a.getAttribute("href").split("/").filter(Boolean).pop(),
    category: a.dataset.category,
    label: a.querySelector(".oc-tile-category").textContent,
    title: a.querySelector(".oc-tile-title").textContent,
    svg: a.querySelector("svg").outerHTML,
  }))`);
  const rows = await evaluate<
    { name: string; description: string; category: string; icon: string }[]
  >(
    `[...document.querySelectorAll(".oc-pack-row")].map((r) => ({
      name: r.querySelector(".oc-pack-name").textContent,
      description: r.querySelector("small").textContent,
      category: r.dataset.category,
      icon: r.querySelector("svg").outerHTML,
    }))`,
  );
  if (rows.length !== packCatalog.length)
    throw new Error(
      `Expected ${packCatalog.length} pack rows, found ${rows.length}`,
    );
  const ordered = [...packCatalog].sort(
    (a, b) => Number(b.default) - Number(a.default),
  );
  const packs = ordered.map((pack) => {
    const strings: Record<string, string> = ui;
    const name = strings[pack.titleKey] ?? strings[`ui.${pack.titleKey}`];
    const row = rows.find((candidate) => candidate.name === name);
    if (!row) throw new Error(`No pack row for ${pack.id}`);
    return row;
  });
  await visit("/calculators/bmi");
  const slots: Record<string, string> = {
    "bmi-fields": await evaluate(grab(".oc-fields")),
    "bmi-answer": await evaluate(grab(".oc-answer")),
    "bmi-gauge": await evaluate(grab(".oc-viz-gauge")),
    "bmi-lesson": await evaluate(`(() => {
      const lesson = document.querySelector(".oc-lesson");
      const [kicker, heading] = lesson.querySelectorAll("h2, h3");
      const text = (el) => el.textContent.replace(/[&<>]/g, (c) => "&#" + c.charCodeAt(0) + ";");
      return '<span class="k">' + text(kicker) + "</span><b>" + text(heading) + "</b><p>" + text(lesson.querySelector("p")) + "</p>";
    })()`),
  };
  await visit("/calculators/compound-interest");
  slots["ci-fields"] = await evaluate(grab(".oc-fields"));

  const data = {
    tiles,
    packs,
    slots,
  };
  const template = await readFile(
    join(import.meta.dir, "readme-art/page.html"),
    "utf8",
  );
  const uiCss = await readFile(
    join(root, "packages/design/src/ui.css"),
    "utf8",
  );
  page = template
    .replace("/*VARIABLES*/", () => variableCss)
    .replace("/*UI*/", () => uiCss)
    .replace("/*DATA*/null", () =>
      JSON.stringify(data).replaceAll("</", "<\\/"),
    );

  await mkdir(out, { recursive: true });
  for (const banner of banners) {
    for (const theme of banner.themes) {
      await cli(
        "set",
        "viewport",
        String(banner.width),
        String(banner.height),
        "2",
      );
      await visit(`/__readme-art?banner=${banner.id}&theme=${theme}`);
      const file = join(out, `${banner.id}-${theme}.png`);
      await cli("screenshot", file);
      console.log(`${file.replace(`${root}/`, "")}`);
    }
  }
} finally {
  await cli("close").catch(() => {});
  server.stop(true);
  await rm(work, { recursive: true, force: true });
}
