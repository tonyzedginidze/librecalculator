import { type ReactNode, useEffect, useRef, useState } from "react";
import { packCatalog } from "../../calculators/src/packs.generated";
import {
  decodeActivePacks,
  defaultPackIds,
  normalizeActivePacks,
  PACK_STORAGE_KEY,
} from "../../calculators/src/runtime/packs";
import { en } from "../../i18n/src/en";
import { ui } from "../../i18n/src/ui";
import { PackIcon } from "./components/pack-icon";

const messages: Readonly<Record<string, string>> = { ...en, ...ui };
export const packLabel = (key: string) => messages[key] ?? key;

const CHANGE = "oc.packs.changed";
const read = () => {
  try {
    return decodeActivePacks(localStorage.getItem(PACK_STORAGE_KEY));
  } catch {
    return defaultPackIds();
  }
};
export function useActivePacks() {
  const [active, setActive] = useState<string[]>(defaultPackIds);
  useEffect(() => {
    const update = () => setActive(read());
    update();
    window.addEventListener(CHANGE, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const toggle = (id: string) => {
    if (id === "core") return;
    const next = normalizeActivePacks(
      active.includes(id)
        ? active.filter((value) => value !== id)
        : [...active, id],
    );
    setActive(next);
    try {
      localStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE));
    } catch {
      /* Session activation still works when persistence is unavailable. */
    }
  };
  return { active, toggle };
}
export function PackPicker(props: {
  active: readonly string[];
  toggle: (id: string) => void;
}) {
  return (
    <fieldset className="oc-pack-picker">
      <legend>{ui["ui.packs.heading"]}</legend>
      {[...packCatalog]
        .sort((a, b) => Number(b.id === "core") - Number(a.id === "core"))
        .map((pack) => (
          <label
            className="oc-pack-row"
            key={pack.id}
            data-category={pack.category}
            data-active={props.active.includes(pack.id)}
          >
            <span className="oc-pack-icon">
              <PackIcon id={pack.id} />
            </span>
            <span className="oc-pack-info">
              <span className="oc-pack-name">{packLabel(pack.titleKey)}</span>
              <small>{packLabel(pack.descriptionKey)}</small>
              <small className="oc-pack-meta">
                {pack.id === "core"
                  ? ui["ui.packs.always"]
                  : ui[
                      Number(pack.calculatorIds.length) === 1
                        ? "ui.catalog.count.one"
                        : "ui.catalog.count.other"
                    ].replace("{count}", String(pack.calculatorIds.length))}
              </small>
            </span>
            <input
              type="checkbox"
              role="switch"
              aria-checked={props.active.includes(pack.id)}
              checked={props.active.includes(pack.id)}
              disabled={pack.id === "core"}
              aria-label={packLabel(pack.titleKey)}
              onChange={() => props.toggle(pack.id)}
            />
          </label>
        ))}
    </fieldset>
  );
}

export { PackIcon } from "./components/pack-icon";

export function SettingsDialog(props: {
  open: boolean;
  onClose: () => void;
  active: readonly string[];
  toggle: (id: string) => void;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (props.open && !dialog.open) dialog.showModal();
    else if (!props.open && dialog.open) dialog.close();
  }, [props.open]);
  return (
    <dialog
      ref={ref}
      className="oc-settings-dialog"
      aria-labelledby="oc-settings-title"
      aria-describedby="oc-settings-description"
      onCancel={props.onClose}
      onClose={props.onClose}
      onPointerDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          props.onClose();
      }}
    >
      <header className="oc-settings-head">
        <span className="oc-settings-emblem">
          <PackIcon id="settings" />
        </span>
        <div>
          <h2 id="oc-settings-title">{ui["ui.settings.title"]}</h2>
          <p id="oc-settings-description">
            {ui["ui.settings.pack-description"]}
          </p>
        </div>
        <button
          type="button"
          className="oc-settings-close"
          aria-label={ui["ui.settings.close"]}
          onClick={props.onClose}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>
      <div className="oc-settings-body">
        <PackPicker active={props.active} toggle={props.toggle} />
        {props.children}
      </div>
      <footer className="oc-settings-foot">
        <span>
          {props.active.length === 1
            ? ui["ui.packs.enabled.one"]
            : ui["ui.packs.enabled"].replace(
                "{count}",
                String(props.active.length),
              )}
        </span>
        <button type="button" onClick={props.onClose}>
          {ui["ui.settings.done"]}
        </button>
      </footer>
    </dialog>
  );
}
