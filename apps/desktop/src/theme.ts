export type ThemeChoice = "system" | "light" | "dark";
const KEY = "oc.theme";

export function getTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY);
    if (value === "light" || value === "dark") return value;
  } catch {}
  return "system";
}

/** Applies and remembers the choice; the quick window follows via the storage event. */
export function applyTheme(choice: ThemeChoice, save = true) {
  const dark =
    choice === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : choice === "dark";
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";
  if (!save) return;
  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {}
}

export function watchTheme() {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => applyTheme(getTheme(), false);
  query.addEventListener("change", sync);
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) sync();
  });
  sync();
}
