import { isMac } from "../tauri";

/** Turns a keydown into a Tauri accelerator, or null until a real chord is held. */
export function acceleratorFrom(event: KeyboardEvent): string | null {
  const code = event.code;
  let key: string | null = null;
  if (/^Key[A-Z]$/.test(code)) key = code.slice(3);
  else if (/^Digit\d$/.test(code)) key = code.slice(5);
  else if (/^F\d{1,2}$/.test(code)) key = code;
  else if (code === "Space") key = "Space";
  if (!key) return null;
  const parts: string[] = [];
  if (event.metaKey) parts.push(isMac ? "Command" : "Super");
  if (event.ctrlKey) parts.push("Control");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  if (parts.length === 0) return null;
  return [...parts, key].join("+");
}

const mac: Record<string, string> = {
  CommandOrControl: "⌘",
  Command: "⌘",
  Control: "⌃",
  Alt: "⌥",
  Shift: "⇧",
};
const other: Record<string, string> = {
  CommandOrControl: "Ctrl",
  Command: "Win",
  Super: "Win",
  Control: "Ctrl",
};

export function keysOf(accelerator: string): string[] {
  const table = isMac ? mac : other;
  return accelerator.split("+").map((part) => table[part] ?? part);
}
