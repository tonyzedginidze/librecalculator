import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { OG_HEIGHT, OG_WIDTH, ogKeys } from "../apps/web/src/og";

const usage = `bun run generate:og [--url http://127.0.0.1:4321] [--keys home,bmi]
Screenshots /og-card/<key>/ from the live Astro dev server (bun run dev:web)
into apps/web/public/og/<key>.png at ${OG_WIDTH}x${OG_HEIGHT}. Requires
agent-browser. Compresses with pngquant and oxipng when they are installed.`;

let base = "http://127.0.0.1:4321";
let keys = ogKeys;
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index++) {
  const flag = args[index];
  const value = args[++index];
  if (!value) throw new Error(`Missing value for ${flag}\n${usage}`);
  if (flag === "--url") base = new URL(value).href.replace(/\/$/, "");
  else if (flag === "--keys") {
    keys = value.split(",");
    const unknown = keys.filter((key) => !ogKeys.includes(key));
    if (unknown.length) throw new Error(`Unknown keys: ${unknown.join(", ")}`);
  } else throw new Error(`Unknown option: ${flag}\n${usage}`);
}

const executable = Bun.which("agent-browser");
if (!executable) throw new Error("agent-browser is not installed or on PATH");
const out = join(import.meta.dir, "../apps/web/public/og");
await mkdir(out, { recursive: true });
const work = await mkdtemp(join(tmpdir(), "og-"));
// A private config and clean environment keep this off the user's own browser.
const config = join(work, "agent-browser.json");
await writeFile(config, "{}\n");
const session = `og-${process.pid}`;
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !key.startsWith("AGENT_BROWSER_"),
  ),
);
const run = async (command: string[]) => {
  const child = Bun.spawn(command, { env, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`${command[0]} failed: ${stderr || stdout}`);
};
const cli = (...rest: string[]) =>
  run([executable, "--config", config, "--session", session, ...rest]);
const pngquant = Bun.which("pngquant");
const oxipng = Bun.which("oxipng");

try {
  await cli("open", `${base}/og-card/${keys[0]}/`);
  await cli("set", "viewport", String(OG_WIDTH), String(OG_HEIGHT), "1");
  await cli("set", "media", "light", "reduced-motion");
  for (const key of keys) {
    await cli("open", `${base}/og-card/${key}/`);
    await cli("wait", "--fn", "document.fonts.status === 'loaded'");
    const file = join(out, `${key}.png`);
    await cli("screenshot", file);
    if (pngquant)
      await run([
        pngquant,
        "--force",
        "--skip-if-larger",
        "--ext",
        ".png",
        "--quality",
        "80-95",
        file,
      ]).catch(() => {});
    if (oxipng) await run([oxipng, "-q", "-o", "3", "--strip", "safe", file]);
    console.log(`og/${key}.png`);
  }
} finally {
  await cli("close").catch(() => {});
  await rm(work, { recursive: true, force: true });
}
