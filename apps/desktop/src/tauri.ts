import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export const isMac =
  typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

export type IntegrationStatus = {
  tray: boolean;
  shortcut: boolean;
  shortcutValue: string | null;
  shortcutError: string | null;
};

export async function showMain(calculatorId: string): Promise<void> {
  if (!isTauri()) {
    window.location.assign(`/?calculator=${encodeURIComponent(calculatorId)}`);
    return;
  }
  await invoke("show_main", { calculatorId });
}

export async function hideQuick(): Promise<void> {
  if (!isTauri()) return;
  await invoke("hide_quick");
}

export async function getStatus(): Promise<IntegrationStatus | null> {
  if (!isTauri()) return null;
  return invoke<IntegrationStatus>("get_integration_status");
}

export async function setShortcut(
  shortcut: string,
): Promise<IntegrationStatus> {
  return invoke<IntegrationStatus>("set_global_shortcut", { shortcut });
}

export async function setCalculatorMenu(
  calculators: { id: string; title: string; category: string }[],
): Promise<void> {
  if (!isTauri()) return;
  await invoke("set_calculator_menu", { calculators });
}

function on<T>(name: string, handler: (payload: T) => void): () => void {
  if (!isTauri()) return () => {};
  const stop = listen<T>(name, (event) => handler(event.payload));
  return () => void stop.then((fn: UnlistenFn) => fn());
}

export const onCalculatorSelected = (handler: (id: string) => void) =>
  on<{ calculatorId?: string }>("calculator-selected", (payload) => {
    if (typeof payload.calculatorId === "string") handler(payload.calculatorId);
  });
export const onOpenSettings = (handler: () => void) =>
  on<null>("open-settings", handler);
export const onQuickShown = (handler: () => void) =>
  on<null>("quick-shown", handler);
