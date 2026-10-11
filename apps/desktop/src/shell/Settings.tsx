import { ui } from "@open-calculators/i18n/ui";
import { useEffect, useState } from "react";
import {
  getStatus,
  type IntegrationStatus,
  isMac,
  isTauri,
  setShortcut,
} from "../tauri";
import { applyTheme, getTheme, type ThemeChoice } from "../theme";
import { acceleratorFrom, keysOf } from "./keys";

const themes: { value: ThemeChoice; label: string }[] = [
  { value: "system", label: ui["ui.settings.theme.system"] },
  { value: "light", label: ui["ui.settings.theme.light"] },
  { value: "dark", label: ui["ui.settings.theme.dark"] },
];

export function Keys(props: { accelerator: string }) {
  return (
    <span className="dk-keys">
      {keysOf(props.accelerator).map((key) => (
        <kbd key={key}>{key}</kbd>
      ))}
    </span>
  );
}

export function Settings() {
  const [theme, setTheme] = useState<ThemeChoice>(getTheme);
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getStatus().then(setStatus);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const onKey = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Escape") return setRecording(false);
      const accelerator = acceleratorFrom(event);
      if (!accelerator) return;
      setRecording(false);
      setShortcut(accelerator)
        .then((next) => {
          setStatus(next);
          setError(null);
        })
        .catch((reason) => setError(String(reason)));
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [recording]);

  const clear = () =>
    setShortcut("")
      .then((next) => {
        setStatus(next);
        setError(null);
      })
      .catch((reason) => setError(String(reason)));

  const reset = () =>
    setShortcut("CommandOrControl+Shift+C")
      .then((next) => {
        setStatus(next);
        setError(null);
      })
      .catch((reason) => setError(String(reason)));

  return (
    <div className="dk-settings">
      <section>
        <h2>{ui["ui.settings.appearance"]}</h2>
        <div className="dk-row">
          <div>
            <strong>{ui["ui.settings.theme"]}</strong>
            <p>{ui["ui.settings.theme.hint"]}</p>
          </div>
          <div className="dk-segment">
            {themes.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={theme === option.value}
                onClick={() => {
                  setTheme(option.value);
                  applyTheme(option.value);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isTauri() ? (
        <section>
          <h2>{ui["ui.settings.quick"]}</h2>
          <div className="dk-row">
            <div>
              <strong>{ui["ui.settings.shortcut"]}</strong>
              <p>
                {ui["ui.settings.shortcut.hint"]}
                {status?.tray
                  ? isMac
                    ? ui["ui.settings.shortcut.tray.mac"]
                    : ui["ui.settings.shortcut.tray.other"]
                  : ui["ui.settings.shortcut.tray.none"]}
              </p>
            </div>
            <div className="dk-shortcut">
              <button
                type="button"
                className="dk-record"
                data-recording={recording}
                onClick={() => setRecording(!recording)}
              >
                {recording ? (
                  ui["ui.settings.shortcut.recording"]
                ) : status?.shortcutValue ? (
                  <Keys accelerator={status.shortcutValue} />
                ) : (
                  ui["ui.settings.shortcut.unset"]
                )}
              </button>
              <button type="button" className="dk-link" onClick={reset}>
                {ui["ui.settings.reset"]}
              </button>
              {status?.shortcutValue ? (
                <button type="button" className="dk-link" onClick={clear}>
                  {ui["ui.settings.clear"]}
                </button>
              ) : null}
            </div>
          </div>
          {error || status?.shortcutError ? (
            <p className="dk-error">{error ?? status?.shortcutError}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
