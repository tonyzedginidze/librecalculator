import { packCatalog } from "../packs.generated";

export const PACK_STORAGE_KEY = "oc.active-packs.v1";
export const defaultPackIds = () =>
  packCatalog
    .filter((pack) => pack.id === "core" || pack.default)
    .map((pack) => String(pack.id));
/** Every pack: the web default, where nothing is installed locally. */
export const allPackIds = () => packCatalog.map((pack) => String(pack.id));

/** Invalid preferences reset; obsolete IDs are discarded. Core is always active. */
export function normalizeActivePacks(
  value: unknown,
  fallback = defaultPackIds,
): string[] {
  if (
    !Array.isArray(value) ||
    value.length > 10000 ||
    !value.every((id) => typeof id === "string")
  )
    return fallback();
  const wanted = new Set(value);
  wanted.add("core");
  return packCatalog
    .filter((pack) => wanted.has(pack.id))
    .map((pack) => String(pack.id));
}

export function decodeActivePacks(
  raw: string | null,
  fallback = defaultPackIds,
): string[] {
  if (raw === null || raw.length > 100000) return fallback();
  try {
    return normalizeActivePacks(JSON.parse(raw), fallback);
  } catch {
    return fallback();
  }
}
