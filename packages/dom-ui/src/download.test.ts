import { describe, expect, test } from "bun:test";
import {
  detectPlatform,
  downloadOptions,
  megabytes,
  type Platform,
  type Release,
  recommended,
} from "./download";

// Asset names exactly as the v0.1.0 release published them.
const names = [
  "Libre.Calculator-0.1.0-1.aarch64.rpm",
  "Libre.Calculator-0.1.0-1.x86_64.rpm",
  "Libre.Calculator_0.1.0_aarch64.AppImage",
  "Libre.Calculator_0.1.0_amd64.AppImage",
  "Libre.Calculator_0.1.0_amd64.deb",
  "Libre.Calculator_0.1.0_arm64-setup.exe",
  "Libre.Calculator_0.1.0_arm64.deb",
  "Libre.Calculator_0.1.0_universal.dmg",
  "Libre.Calculator_0.1.0_x64-setup.exe",
  "Libre.Calculator_0.1.0_x64_en-US.msi",
  "Libre.Calculator_universal.app.tar.gz",
  "SHA256SUMS.txt",
];
const release: Release = {
  version: "0.1.0",
  pageUrl: "https://example.test/release",
  assets: names.map((name) => ({ name, size: 1, url: `https://dl/${name}` })),
};
const options = downloadOptions(release);
const pick = (platform: Platform) => recommended(options, platform)?.asset.name;
const ua = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  ubuntu:
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  fedoraArm:
    "Mozilla/5.0 (X11; Fedora; Linux aarch64; rv:140.0) Gecko/20100101 Firefox/140.0",
  linux:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
};

describe("desktop download", () => {
  test("finds every published installer and ignores the rest", () => {
    expect(options).toHaveLength(10);
    expect(options.map((o) => o.asset.name)).not.toContain("SHA256SUMS.txt");
  });

  test("detects the system from the user agent", () => {
    expect(detectPlatform({ userAgent: ua.mac }).os).toBe("mac");
    expect(detectPlatform({ userAgent: ua.windows })).toEqual({
      os: "windows",
      arch: "x64",
      linux: "other",
    });
    expect(detectPlatform({ userAgent: ua.ubuntu }).linux).toBe("debian");
    expect(detectPlatform({ userAgent: ua.fedoraArm })).toEqual({
      os: "linux",
      arch: "arm64",
      linux: "fedora",
    });
    expect(detectPlatform({ userAgent: ua.iphone }).os).toBe("other");
    expect(detectPlatform({ userAgent: ua.android }).os).toBe("other");
    expect(detectPlatform({ userAgent: ua.mac, maxTouchPoints: 5 }).os).toBe(
      "other",
    );
  });

  test("recommends the natural installer for each system", () => {
    const detect = (userAgent: string) => pick(detectPlatform({ userAgent }));
    expect(detect(ua.mac)).toBe("Libre.Calculator_0.1.0_universal.dmg");
    expect(detect(ua.windows)).toBe("Libre.Calculator_0.1.0_x64-setup.exe");
    expect(detect(ua.ubuntu)).toBe("Libre.Calculator_0.1.0_amd64.deb");
    expect(detect(ua.fedoraArm)).toBe("Libre.Calculator-0.1.0-1.aarch64.rpm");
    expect(detect(ua.linux)).toBe("Libre.Calculator_0.1.0_amd64.AppImage");
    expect(detect(ua.iphone)).toBeUndefined();
  });

  test("Windows on ARM gets the ARM build, or x64 when it is missing", () => {
    const arm: Platform = { os: "windows", arch: "arm64", linux: "other" };
    expect(pick(arm)).toBe("Libre.Calculator_0.1.0_arm64-setup.exe");
    const withoutArm = options.filter((o) => o.arch !== "arm64");
    expect(recommended(withoutArm, arm)?.asset.name).toBe(
      "Libre.Calculator_0.1.0_x64-setup.exe",
    );
  });

  test("shows sizes in megabytes", () => {
    expect(megabytes(7_340_032)).toBe("7.0");
    expect(megabytes(81_788_928)).toBe("78");
  });
});
