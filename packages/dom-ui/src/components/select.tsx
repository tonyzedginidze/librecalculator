import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string; group?: string };

export function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Styled dropdown with the listbox pattern: arrows, Home/End, type-ahead, Esc. */
export function Select(props: {
  id?: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  label?: string;
  invalid?: boolean;
  describedBy?: string | undefined;
}) {
  const { options, value } = props;
  const autoId = useId();
  const id = props.id ?? autoId;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when the active option changes
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option) props.onChange(option.value);
    setOpen(false);
  };
  const move = (index: number) =>
    setActive(Math.min(options.length - 1, Math.max(0, index)));

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) return show();
        return move(active + (event.key === "ArrowDown" ? 1 : -1));
      }
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        return move(event.key === "Home" ? 0 : options.length - 1);
      case "Enter":
      case " ":
        event.preventDefault();
        return open ? choose(active) : show();
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      default: {
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
        const letter = event.key.toLowerCase();
        const from = open ? active + 1 : selectedIndex + 1;
        const ordered = [...options.slice(from), ...options.slice(0, from)];
        const hit = ordered.find((option) =>
          option.label.toLowerCase().startsWith(letter),
        );
        if (!hit) return;
        const index = options.indexOf(hit);
        if (open) setActive(index);
        else props.onChange(hit.value);
      }
    }
  };

  let lastGroup: string | undefined;
  return (
    <div className="oc-select" ref={rootRef} data-open={open}>
      <button
        type="button"
        id={id}
        className="oc-select-trigger"
        // biome-ignore lint/a11y/useSemanticElements: custom listbox combobox
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        aria-label={props.label}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <span className="oc-select-value">{selected?.label ?? ""}</span>
        <Chevron />
      </button>
      {open ? (
        <div
          className="oc-select-list"
          id={listId}
          ref={listRef}
          // biome-ignore lint/a11y/useSemanticElements: custom listbox
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => {
            const heading =
              option.group && option.group !== lastGroup ? option.group : null;
            lastGroup = option.group;
            return (
              <div key={option.value} role="presentation">
                {heading ? (
                  <div className="oc-select-group" role="presentation">
                    {heading}
                  </div>
                ) : null}
                {/* biome-ignore lint/a11y/useSemanticElements: custom listbox option */}
                <div
                  id={`${id}-opt-${index}`}
                  role="option"
                  className="oc-select-option"
                  aria-selected={index === selectedIndex}
                  data-active={index === active}
                  tabIndex={-1}
                  onMouseMove={() => setActive(index)}
                  onClick={() => choose(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") choose(index);
                  }}
                >
                  <span>{option.label}</span>
                  {index === selectedIndex ? <Check /> : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
