// Builds one narrated 16:9 MP4 per calculator and language with explainroo.
//   bun scripts/build-videos.ts [calculator] [--lang en] [--draft] [--dry]
// Source layout: videos/languages.json and videos/<calculator>/
//   video.json, scenes.js, strings.<lang>.json, script.<lang>.md
// Output: apps/web/public/videos/<calculator>/<lang>.mp4 (git-ignored).
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

type Language = {
  name: string;
  voice: string;
  status: "ready" | "planned";
  captionsOnly?: boolean;
};

const root = resolve(import.meta.dir, "..");
const sourceDir = join(root, "videos");
const stageDir = join(root, ".videos-build");
const outDir = join(root, "apps/web/public/videos");
const explainroo = resolve(
  process.env.EXPLAINROO_DIR ?? join(root, "../tools/explainroo"),
);

// 16:9 is the page embed; plain 9:16 is centered (the "tiktok" preset shifts
// content to dodge app buttons, which we do not want).
const formats = [
  { name: "wide", size: "16:9", suffix: "" },
  { name: "tall", size: "9:16", suffix: ".9x16" },
];

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const calculator = args.find(
  (a, i) =>
    !a.startsWith("--") &&
    args[i - 1] !== "--lang" &&
    args[i - 1] !== "--format",
);

const languages: Record<string, Language> = JSON.parse(
  readFileSync(join(sourceDir, "languages.json"), "utf8"),
);
const wantedLang = option("lang");

const calculators = readdirSync(sourceDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      !d.name.startsWith("_") &&
      (!calculator || d.name === calculator),
  )
  .map((d) => d.name);
if (calculator && calculators.length === 0)
  throw new Error(`No video project: videos/${calculator}`);

function run(command: string, commandArgs: string[]) {
  const result = spawnSync(command, commandArgs, { encoding: "utf8" });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  // onnxruntime aborts while the process exits, after the work succeeded.
  const exitAbort = /mutex lock failed/.test(result.stderr);
  return (
    result.status === 0 ||
    (exitAbort && !/\bERROR\b|Error:/.test(result.stdout + result.stderr))
  );
}

let failures = 0;
for (const id of calculators) {
  const project = join(sourceDir, id);
  for (const [lang, info] of Object.entries(languages)) {
    if (wantedLang ? lang !== wantedLang : info.status !== "ready") continue;
    const script = join(project, `script.${lang}.md`);
    const strings = join(project, `strings.${lang}.json`);
    if (!existsSync(script) || !existsSync(strings)) {
      console.log(`skip ${id}/${lang}: missing script or strings`);
      continue;
    }
    for (const format of formats) {
      if (option("format") && option("format") !== format.name) continue;
      const stage = join(stageDir, id, `${lang}${format.suffix}`);
      if (flag("dry")) {
        console.log(
          `would build ${id}/${lang} ${format.size} voice=${info.voice}`,
        );
        continue;
      }
      mkdirSync(stage, { recursive: true });
      for (const stale of ["script.md", "scenes.js", "strings.js", "layout.js"])
        rmSync(join(stage, stale), { force: true });
      // Keep build/ between runs so explainroo only redoes changed scenes.
      const settings = {
        ...JSON.parse(readFileSync(join(sourceDir, "defaults.json"), "utf8")),
        ...JSON.parse(readFileSync(join(project, "video.json"), "utf8")),
      };
      const title = JSON.parse(readFileSync(strings, "utf8")).title as string;
      writeFileSync(
        join(stage, "video.json"),
        `${JSON.stringify({ ...settings, title, voice: info.voice, size: format.size }, null, 2)}\n`,
      );
      cpSync(script, join(stage, "script.md"));
      cpSync(join(project, "scenes.js"), join(stage, "scenes.js"));
      cpSync(join(sourceDir, "_shared/layout.js"), join(stage, "layout.js"));
      writeFileSync(
        join(stage, "strings.js"),
        `export default ${readFileSync(strings, "utf8").trim()};\n`,
      );
      if (existsSync(join(project, "assets")))
        cpSync(join(project, "assets"), join(stage, "assets"), {
          recursive: true,
        });

      const cli = join(explainroo, "bin/explainroo.js");
      const steps = [
        ["check", stage],
        ["render", stage, ...(flag("draft") ? ["--draft"] : [])],
        ...(flag("draft") ? [] : [["verify", stage]]),
      ];
      let ok = true;
      for (const step of steps) {
        ok = run("node", [cli, ...step]);
        if (!ok) break;
      }
      const mp4 = join(stage, "out", flag("draft") ? "draft.mp4" : "video.mp4");
      if (!ok || !existsSync(mp4)) {
        console.error(`FAILED ${id}/${lang} ${format.size}`);
        failures++;
        continue;
      }
      mkdirSync(join(outDir, id), { recursive: true });
      cpSync(mp4, join(outDir, id, `${lang}${format.suffix}.mp4`));
      const base = join(outDir, id, `${lang}${format.suffix}`);
      // Chapters (one per scene) for the web player; identical for both formats.
      const timeline = JSON.parse(
        readFileSync(join(stage, "build/timeline.json"), "utf8"),
      );
      // Poster: just before the first scene ends, when it is fully drawn.
      const posterAt = Math.max(1, (timeline.scenes[1]?.start ?? 5) - 0.4);
      spawnSync("ffmpeg", [
        "-y",
        "-v",
        "error",
        "-ss",
        posterAt.toFixed(2),
        "-i",
        mp4,
        "-frames:v",
        "1",
        "-vf",
        format.name === "tall" ? "scale=-2:1280" : "scale=1280:-2",
        "-q:v",
        "4",
        `${base}.jpg`,
      ]);
      const titles = JSON.parse(readFileSync(strings, "utf8")).chapters ?? {};
      writeFileSync(
        join(outDir, id, `${lang}.json`),
        `${JSON.stringify({
          duration: Math.round(timeline.duration * 10) / 10,
          chapters: timeline.scenes.map(
            (sc: { id: string; start: number }) => ({
              id: sc.id,
              title: titles[sc.id] ?? sc.id,
              start: Math.round(sc.start * 10) / 10,
            }),
          ),
        })}\n`,
      );
      console.log(
        `built apps/web/public/videos/${id}/${lang}${format.suffix}.mp4`,
      );
    }
  }
}
process.exit(failures ? 1 : 0);
