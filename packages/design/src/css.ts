import { type ThemeName, tokens } from "./tokens";

const names: Record<keyof (typeof tokens.color)["light"], string> = {
  canvas: "--oc-canvas",
  surface: "--oc-surface",
  ink: "--oc-ink",
  muted: "--oc-muted",
  line: "--oc-line",
  accent: "--oc-accent",
  accentInk: "--oc-accent-ink",
  accentSoft: "--oc-accent-soft",
  danger: "--oc-danger",
  dangerSoft: "--oc-danger-soft",
  focus: "--oc-focus",
  barTrack: "--oc-bar-track",
  barFill: "--oc-bar-fill",
  barNegative: "--oc-bar-negative",
  barOutside: "--oc-bar-outside",
  result: "--oc-result",
  resultSoft: "--oc-result-soft",
  warn: "--oc-warn",
  warnSoft: "--oc-warn-soft",
  info: "--oc-info",
  infoSoft: "--oc-info-soft",
  geometry: "--oc-geometry",
  geometrySoft: "--oc-geometry-soft",
  units: "--oc-units",
  unitsSoft: "--oc-units-soft",
  cooking: "--oc-cooking",
  cookingSoft: "--oc-cooking-soft",
  education: "--oc-education",
  educationSoft: "--oc-education-soft",
  finance: "--oc-finance",
  financeSoft: "--oc-finance-soft",
  health: "--oc-health",
  healthSoft: "--oc-health-soft",
  construction: "--oc-construction",
  constructionSoft: "--oc-construction-soft",
  dateTime: "--oc-date-time",
  dateTimeSoft: "--oc-date-time-soft",
  statistics: "--oc-statistics",
  statisticsSoft: "--oc-statistics-soft",
  physics: "--oc-physics",
  physicsSoft: "--oc-physics-soft",
};

function block(selector: string, theme: ThemeName): string {
  const lines = Object.entries(tokens.color[theme]).map(
    ([key, value]) => `  ${names[key as keyof typeof names]}: ${value};`,
  );
  return `${selector} {\n${lines.join("\n")}\n  color-scheme: ${theme};\n}`;
}

/** Token-derived custom properties. Inline this before paint; do not duplicate the hex values. */
export const variableCss = [
  block(":root, [data-theme='light']", "light"),
  `@media (prefers-color-scheme: dark) {\n  ${block(":root:not([data-theme='light'])", "dark").replaceAll("\n", "\n  ")}\n}`,
  block("[data-theme='dark']", "dark"),
  `:root {\n  --oc-font-serif: ${tokens.type.serif};\n  --oc-font-sans: ${tokens.type.sans};\n  --oc-font-mono: ${tokens.type.mono};\n  --oc-motion: ${tokens.motionMs}ms;\n  --oc-bg-surface: var(--oc-surface);\n  --oc-border-color: var(--oc-line);\n  --oc-text-main: var(--oc-ink);\n  --oc-text-muted: var(--oc-muted);\n  --oc-bg-element: var(--oc-canvas);\n  --oc-bg-hover: var(--oc-accent-soft);\n  --oc-bg-primary-tint: var(--oc-result-soft);\n  --oc-bg-info: var(--oc-info-soft);\n  --oc-accent-color: var(--oc-accent);\n  --oc-accent-dark: var(--oc-accent);\n  --oc-accent-light: var(--oc-accent);\n  --oc-color-info: var(--oc-info);\n  --oc-text-info: var(--oc-info);\n}`,
].join("\n");
