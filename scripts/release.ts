import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

/**
 * Desktop versioning. apps/desktop/package.json holds the version; Tauri reads
 * it from there, and this script keeps Cargo.toml and Cargo.lock in step.
 *
 *   bun run release <patch|minor|major|x.y.z>   bump, commit and tag vX.Y.Z
 *   bun run release check [vX.Y.Z]              fail if versions drift or the tag differs
 *
 * Pushing the tag (git push --follow-tags) starts the release workflow.
 */
const root = join(import.meta.dir, "..");
const files = {
  pkg: join(root, "apps/desktop/package.json"),
  cargo: join(root, "apps/desktop/src-tauri/Cargo.toml"),
  lock: join(root, "apps/desktop/src-tauri/Cargo.lock"),
};
const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
const CARGO_VERSION = /^(\[package\][^[]*?\nversion = ")([^"]+)(")/m;
const LOCK_VERSION =
  /(name = "libre-calculator-desktop"\nversion = ")([^"]+)(")/;

async function readVersions() {
  const pkg = JSON.parse(await readFile(files.pkg, "utf8")) as {
    version: string;
  };
  const cargo = (await readFile(files.cargo, "utf8")).match(CARGO_VERSION)?.[2];
  const lock = (await readFile(files.lock, "utf8")).match(LOCK_VERSION)?.[2];
  return { pkg: pkg.version, cargo, lock };
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function check(tag?: string) {
  const v = await readVersions();
  if (v.pkg !== v.cargo || v.pkg !== v.lock) {
    fail(
      `Desktop versions drift: package.json ${v.pkg}, Cargo.toml ${v.cargo}, Cargo.lock ${v.lock}`,
    );
  }
  if (tag && tag !== `v${v.pkg}`) {
    fail(`Tag ${tag} does not match the desktop version v${v.pkg}`);
  }
  console.log(`Desktop version ${v.pkg} is consistent`);
}

function next(current: string, bump: string) {
  if (SEMVER.test(bump)) return bump;
  const [major = 0, minor = 0, patch = 0] = (current.split("-")[0] ?? "")
    .split(".")
    .map(Number);
  if (bump === "major") return `${major + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  if (bump === "patch") return `${major}.${minor}.${patch + 1}`;
  fail("Usage: bun run release <patch|minor|major|x.y.z> | check [tag]");
}

async function release(bump: string) {
  if ((await $`git status --porcelain`.text()).trim()) {
    fail("Commit or stash your changes first.");
  }
  const branch = (await $`git branch --show-current`.text()).trim();
  if (branch !== "main") fail(`Release from main, not ${branch}.`);

  const current = await readVersions();
  const version = next(current.pkg, bump);
  const tag = `v${version}`;
  if ((await $`git tag --list ${tag}`.text()).trim()) {
    fail(`${tag} already exists.`);
  }

  const pkg = await readFile(files.pkg, "utf8");
  await writeFile(
    files.pkg,
    pkg.replace(/"version": "[^"]+"/, `"version": "${version}"`),
  );
  for (const [file, pattern] of [
    [files.cargo, CARGO_VERSION],
    [files.lock, LOCK_VERSION],
  ] as const) {
    const text = await readFile(file, "utf8");
    await writeFile(file, text.replace(pattern, `$1${version}$3`));
  }
  await check(tag);

  await $`git add ${files.pkg} ${files.cargo} ${files.lock}`;
  await $`git commit -m ${`Release desktop ${tag}`}`.quiet();
  await $`git tag -a ${tag} -m ${`Libre Calculator ${tag}`}`;
  console.log(
    `Tagged ${tag} (was ${current.pkg}). Publish with: git push --follow-tags`,
  );
}

const [command, arg] = process.argv.slice(2);
if (command === "check") await check(arg);
else if (command) await release(command);
else fail("Usage: bun run release <patch|minor|major|x.y.z> | check [tag]");
