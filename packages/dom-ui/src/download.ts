import { repositoryUrl } from "./catalog";

/**
 * Desktop download: detect the visitor's system, then pick the matching
 * installer from the latest GitHub release. The release asset names come from
 * .github/workflows/release.yml (Tauri bundle names with spaces as dots).
 */
export type DesktopOs = "mac" | "windows" | "linux";
export type DesktopArch = "x64" | "arm64";
export type LinuxFamily = "debian" | "fedora" | "other";
export type DownloadFormat = "dmg" | "exe" | "msi" | "appimage" | "deb" | "rpm";

export interface Platform {
  os: DesktopOs | "other";
  arch: DesktopArch;
  linux: LinuxFamily;
}

export interface ReleaseAsset {
  name: string;
  size: number;
  url: string;
}

export interface Release {
  version: string;
  pageUrl: string;
  assets: ReleaseAsset[];
}

export interface DownloadOption {
  os: DesktopOs;
  arch: DesktopArch | "universal";
  format: DownloadFormat;
  asset: ReleaseAsset;
}

export const releasesUrl = `${repositoryUrl}/releases/latest`;
const releaseApi =
  "https://api.github.com/repos/tonyzedginidze/librecalculator/releases/latest";

/** Every installer we publish, in the order the full list shows them. */
const formats: readonly {
  os: DesktopOs;
  arch: DesktopArch | "universal";
  format: DownloadFormat;
  match: RegExp;
}[] = [
  { os: "mac", arch: "universal", format: "dmg", match: /_universal\.dmg$/ },
  { os: "windows", arch: "x64", format: "exe", match: /_x64-setup\.exe$/ },
  { os: "windows", arch: "x64", format: "msi", match: /_x64_[\w-]+\.msi$/ },
  { os: "windows", arch: "arm64", format: "exe", match: /_arm64-setup\.exe$/ },
  { os: "linux", arch: "x64", format: "appimage", match: /_amd64\.AppImage$/ },
  { os: "linux", arch: "x64", format: "deb", match: /_amd64\.deb$/ },
  { os: "linux", arch: "x64", format: "rpm", match: /\.x86_64\.rpm$/ },
  {
    os: "linux",
    arch: "arm64",
    format: "appimage",
    match: /_aarch64\.AppImage$/,
  },
  { os: "linux", arch: "arm64", format: "deb", match: /_arm64\.deb$/ },
  { os: "linux", arch: "arm64", format: "rpm", match: /\.aarch64\.rpm$/ },
];

export function downloadOptions(release: Release): DownloadOption[] {
  return formats.flatMap(({ match, ...option }) => {
    const asset = release.assets.find((candidate) =>
      match.test(candidate.name),
    );
    return asset ? [{ ...option, asset }] : [];
  });
}

/** The single best installer for this visitor, or undefined if none fits. */
export function recommended(
  options: readonly DownloadOption[],
  platform: Platform,
): DownloadOption | undefined {
  if (platform.os === "other") return undefined;
  const preferred: Record<DesktopOs, DownloadFormat> = {
    mac: "dmg",
    windows: "exe",
    linux:
      platform.linux === "debian"
        ? "deb"
        : platform.linux === "fedora"
          ? "rpm"
          : "appimage",
  };
  const fits = (option: DownloadOption, arch: DesktopArch) =>
    option.os === platform.os &&
    (option.arch === "universal" || option.arch === arch);
  const format = preferred[platform.os];
  // x64 Windows builds also run on Windows on ARM, so fall back to them.
  return (
    options.find((o) => fits(o, platform.arch) && o.format === format) ??
    options.find((o) => fits(o, platform.arch)) ??
    (platform.os === "windows"
      ? options.find((o) => fits(o, "x64") && o.format === format)
      : undefined)
  );
}

interface NavigatorLike {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: { platform?: string };
}

/** Best guess from the user agent alone; refine the arch with refineArch. */
export function detectPlatform(nav: NavigatorLike): Platform {
  const ua = nav.userAgent;
  const hint = `${nav.userAgentData?.platform ?? ""} ${nav.platform ?? ""} ${ua}`;
  // iPads ask for desktop sites as "Macintosh"; only they have touch.
  const mobile =
    /Android|iPhone|iPad|iPod|CrOS/i.test(ua) ||
    (/Mac/i.test(ua) && (nav.maxTouchPoints ?? 0) > 1);
  const os: Platform["os"] = mobile
    ? "other"
    : /Mac/i.test(hint)
      ? "mac"
      : /Win/i.test(hint)
        ? "windows"
        : /Linux|X11|BSD/i.test(hint)
          ? "linux"
          : "other";
  const arch: DesktopArch = /aarch64|arm64|armv8|\bARM\b/i.test(ua)
    ? "arm64"
    : "x64";
  const linux: LinuxFamily = /Ubuntu|Debian|Mint|Pop!_OS/i.test(ua)
    ? "debian"
    : /Fedora|Red Hat|CentOS|openSUSE|SUSE/i.test(ua)
      ? "fedora"
      : "other";
  return { os, arch, linux };
}

/** Chromium browsers report the real CPU through client hints. */
export async function refineArch(platform: Platform): Promise<Platform> {
  const data = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (
          hints: string[],
        ) => Promise<{ architecture?: string }>;
      };
    }
  ).userAgentData;
  try {
    const values = await data?.getHighEntropyValues?.(["architecture"]);
    if (values?.architecture === "arm") return { ...platform, arch: "arm64" };
    if (values?.architecture === "x86") return { ...platform, arch: "x64" };
  } catch {
    // No hints: keep the user-agent guess.
  }
  return platform;
}

const cacheKey = "oc-desktop-release";
const cacheMs = 60 * 60 * 1000;

/** The latest release, cached for an hour per tab to spare the API limit. */
export async function fetchLatestRelease(): Promise<Release> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) ?? "null") as {
      at: number;
      release: Release;
    } | null;
    if (cached && Date.now() - cached.at < cacheMs) return cached.release;
  } catch {
    // Storage blocked or corrupt: fetch instead.
  }
  const response = await fetch(releaseApi, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
  const data = (await response.json()) as {
    tag_name: string;
    html_url: string;
    assets: { name: string; size: number; browser_download_url: string }[];
  };
  const release: Release = {
    version: data.tag_name.replace(/^v/, ""),
    pageUrl: data.html_url,
    assets: data.assets.map((asset) => ({
      name: asset.name,
      size: asset.size,
      url: asset.browser_download_url,
    })),
  };
  try {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({ at: Date.now(), release }),
    );
  } catch {
    // Not critical.
  }
  return release;
}

/** Megabytes for display, one decimal below 10. */
export function megabytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb < 10 ? mb.toFixed(1) : String(Math.round(mb));
}
