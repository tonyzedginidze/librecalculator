import type { CalculatorId } from "@open-calculators/calculators";
import {
  type CatalogItem,
  catalogItems,
  filterItems,
} from "@open-calculators/dom-ui/catalog";
import { ui } from "@open-calculators/i18n/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { hideQuick, isTauri, onQuickShown, showMain } from "../tauri";
import { useTopic } from "../use-topic";

export function QuickPanel() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<CatalogItem | null>(null);
  const [pinned, setPinned] = useState(() => {
    try {
      return localStorage.getItem("oc.quick.pin") === "1";
    } catch {
      return false;
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => filterItems(catalogItems, query), [query]);

  const reset = () => {
    setPicked(null);
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: subscribe once
  useEffect(() => {
    document.title = ui["ui.desktop.quick.title"];
    return onQuickShown(reset);
  }, []);

  // Clicking away dismisses the popup unless it is pinned.
  useEffect(() => {
    try {
      localStorage.setItem("oc.quick.pin", pinned ? "1" : "0");
    } catch {}
    if (pinned || !isTauri()) return;
    const onBlur = () => void hideQuick();
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [pinned]);

  const pin = (
    <button
      type="button"
      className="dq-pin"
      aria-pressed={pinned}
      title={pinned ? ui["ui.quick.pin.off"] : ui["ui.quick.pin.on"]}
      onClick={() => setPinned(!pinned)}
    >
      <PinIcon />
    </button>
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only touches setters and a ref
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (picked) reset();
      else if (query) setQuery("");
      else if (isTauri()) void hideQuick();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked, query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when selection moves
  useEffect(() => {
    document
      .querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  if (picked) {
    return (
      <div className="dq">
        <div className="dq-head" data-tauri-drag-region>
          <button
            type="button"
            onClick={reset}
            aria-label={ui["ui.quick.back"]}
          >
            ←
          </button>
          <strong data-tauri-drag-region>{picked.title}</strong>
          <button
            type="button"
            className="dq-open"
            onClick={() => void showMain(picked.id).then(hideQuick)}
          >
            {ui["ui.quick.openInApp"]}
          </button>
          {pin}
        </div>
        <div className="dq-body">
          <QuickCalculator id={picked.id} item={picked} />
        </div>
      </div>
    );
  }

  return (
    <div className="dq">
      <div className="dq-head" data-tauri-drag-region>
        <input
          ref={inputRef}
          // biome-ignore lint/a11y/noAutofocus: a palette exists to be typed into
          autoFocus
          value={query}
          placeholder={ui["ui.search.placeholder"]}
          aria-label={ui["ui.search.label"]}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown")
              setActive((value) => Math.min(results.length - 1, value + 1));
            else if (event.key === "ArrowUp")
              setActive((value) => Math.max(0, value - 1));
            else if (event.key === "Enter") {
              const choice = results[active];
              if (choice) setPicked(choice);
            } else return;
            event.preventDefault();
          }}
        />
        {pin}
      </div>
      <ul className="dq-list">
        {results.map((entry, index) => (
          <li key={entry.id}>
            <button
              type="button"
              data-selected={index === active}
              aria-current={index === active}
              data-category={entry.category}
              onMouseMove={() => setActive(index)}
              onClick={() => setPicked(entry)}
            >
              <span>{entry.title.replace(/ calculator$/i, "")}</span>
              <small>{ui[`ui.category.${entry.category}`]}</small>
            </button>
          </li>
        ))}
        {results.length === 0 ? (
          <li className="dq-empty">{ui["ui.search.empty"]}</li>
        ) : null}
      </ul>
      <footer className="dq-foot">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> {ui["ui.quick.hint.navigate"]}
        </span>
        <span>
          <kbd>↵</kbd> {ui["ui.quick.hint.open"]}
        </span>
        <span>
          <kbd>esc</kbd> {ui["ui.quick.hint.close"]}
        </span>
      </footer>
    </div>
  );
}

function QuickCalculator(props: { id: CalculatorId; item: CatalogItem }) {
  const { topic, error } = useTopic(props.id);
  if (error) return <p className="oc-error">{error}</p>;
  if (!topic) return <p className="oc-quiet">{ui["ui.loading"]}</p>;
  return (
    <topic.View
      id={props.id}
      title={props.item.title}
      description={props.item.description}
      messages={topic.messages}
      locale="en-US"
    />
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}
