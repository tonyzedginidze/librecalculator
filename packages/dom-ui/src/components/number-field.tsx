import {
  type ClipboardEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  cleanDraft,
  coreCount,
  displayPosition,
  formatDraft,
  interpretPaste,
  numberMarks,
  stepDraft,
} from "../number-input";

/**
 * Number entry for calculators. The draft stays plain (no grouping) so the
 * engines parse it unchanged; the field only displays it with thousands
 * grouping, keeps the caret on the same digit while typing, understands pasted
 * numbers from other formats, and steps with the arrow keys.
 */
export function NumberField(props: {
  id: string;
  name: string;
  value: string;
  onChange: (draft: string) => void;
  locale: string;
  integer?: boolean;
  invalid?: boolean;
  describedBy?: string | undefined;
  prefix?: string | undefined;
  suffix?: string | undefined;
  /** Adds a ± button inside the field. */
  onToggleSign?: (() => void) | undefined;
  signLabel?: string | undefined;
}) {
  const { value, onChange, integer } = props;
  const marks = useMemo(() => numberMarks(props.locale), [props.locale]);
  const display = formatDraft(value, marks);
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const pointer = useRef(false);
  const [, rerender] = useState(0);
  const options = { integer: integer ?? false };

  // Restore the caret after the formatted value is committed.
  useLayoutEffect(() => {
    const element = inputRef.current;
    if (caret.current === null || !element) return;
    const position = displayPosition(display, caret.current, marks);
    element.setSelectionRange(position, position);
    caret.current = null;
  });

  const commit = (draft: string, core: number) => {
    caret.current = core;
    if (draft !== value) onChange(draft);
    else rerender((tick) => tick + 1); // rejected input: snap back
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    const size = event.shiftKey ? 10 : event.altKey && !integer ? 0.1 : 1;
    const next = stepDraft(
      value,
      event.key === "ArrowUp" ? size : -size,
      marks,
    );
    commit(next, next.length);
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const element = event.currentTarget;
    const start = coreCount(display, element.selectionStart ?? 0, marks);
    const end = coreCount(display, element.selectionEnd ?? 0, marks);
    const pasted = interpretPaste(event.clipboardData.getData("text"), marks);
    const next = cleanDraft(
      value.slice(0, start) + pasted + value.slice(end),
      marks,
      options,
    );
    commit(next, start + pasted.length);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: click-to-focus convenience; the input itself is the keyboard target
    <div
      className="oc-input"
      data-invalid={props.invalid || undefined}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      {props.prefix ? (
        <span className="oc-input-affix" aria-hidden="true">
          {props.prefix}
        </span>
      ) : null}
      <input
        ref={inputRef}
        id={props.id}
        name={props.name}
        value={display}
        inputMode={integer ? "numeric" : "decimal"}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.describedBy}
        onPointerDown={() => {
          pointer.current = true;
        }}
        onFocus={(event) => {
          // Tabbing in selects the value so typing replaces it.
          if (!pointer.current) event.currentTarget.select();
        }}
        onBlur={() => {
          pointer.current = false;
        }}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onChange={(event) => {
          const element = event.currentTarget;
          const raw = element.value;
          const before = coreCount(
            raw,
            element.selectionStart ?? raw.length,
            marks,
          );
          const next = cleanDraft(raw, marks, options);
          commit(next, Math.min(before, next.length));
        }}
      />
      {props.suffix ? (
        <span className="oc-input-affix" aria-hidden="true">
          {props.suffix}
        </span>
      ) : null}
      {props.onToggleSign ? (
        <button
          type="button"
          className="oc-input-sign"
          aria-label={props.signLabel}
          onClick={props.onToggleSign}
        >
          ±
        </button>
      ) : null}
    </div>
  );
}
