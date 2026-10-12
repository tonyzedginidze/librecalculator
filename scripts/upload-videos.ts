// Uploads the built videos to the R2 bucket that serves them.
//   bun scripts/upload-videos.ts [calculator] [--bucket librecalculator-videos]
// Source: apps/web/public/videos/<id>/* (git-ignored build output).
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const videosDir = join(root, "apps/web/public/videos");
const args = process.argv.slice(2);
const bucketAt = args.indexOf("--bucket");
const bucket = bucketAt >= 0 ? args[bucketAt + 1] : "librecalculator-videos";
const only = args.find(
  (a, i) => !a.startsWith("--") && args[i - 1] !== "--bucket",
);

const types: Record<string, string> = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".json": "application/json",
};

const jobs: { key: string; file: string; type: string }[] = [];
for (const id of readdirSync(videosDir)) {
  if (only && id !== only) continue;
  for (const name of readdirSync(join(videosDir, id))) {
    const type = types[name.slice(name.lastIndexOf("."))];
    if (type)
      jobs.push({
        key: `${id}/${name}`,
        file: join(videosDir, id, name),
        type,
      });
  }
}

function upload(job: (typeof jobs)[number]) {
  return new Promise<boolean>((done) => {
    const p = spawn(
      "bunx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        `${bucket}/${job.key}`,
        "--file",
        job.file,
        "--content-type",
        job.type,
        "--cache-control",
        "public, max-age=604800",
        "--remote",
      ],
      { cwd: root, stdio: "ignore" },
    );
    p.on("close", (code) => done(code === 0));
  });
}

let next = 0;
let failed = 0;
async function worker() {
  while (next < jobs.length) {
    const job = jobs[next++] as (typeof jobs)[number];
    // The R2 API rate-limits bursts ("Too Many Requests"); back off and retry.
    let ok = false;
    for (let attempt = 1; attempt <= 5 && !ok; attempt++) {
      ok = await upload(job);
      if (!ok) await Bun.sleep(attempt * 15_000);
    }
    if (!ok) {
      failed++;
      console.error(`FAILED ${job.key}`);
    } else if (next % 20 === 0) console.log(`${next}/${jobs.length}`);
  }
}
// Large files fail under more parallel uploads; two at a time is reliable.
await Promise.all(Array.from({ length: 2 }, worker));
console.log(`uploaded ${jobs.length - failed}/${jobs.length} to ${bucket}`);
process.exit(failed ? 1 : 0);
