import { type ReactNode, useState } from "react";
import { NumberField } from "../../components/number-field";

export type Option = { value: string; label: string };

/**
 * A field answered by tapping one option. With `custom`, a last option opens a
 * typed entry for any other value; it stays open while the value is not a preset.
 */
export function Picker(props: {
  id: string;
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  error: string | null;
  custom?: { label: string; input: ReactNode };
}) {
  const preset = props.options.some((o) => o.value === props.value);
  const [typing, setTyping] = useState(!preset);
  const customOpen = props.custom !== undefined && (typing || !preset);
  const errorId = `${props.id}-error`;
  return (
    <fieldset
      className="oc-field oc-meeting-picker"
      aria-describedby={props.error ? errorId : undefined}
    >
      <legend className="oc-field-label">{props.label}</legend>
      <div className="oc-meeting-options">
        {props.options.map((option) => {
          const active = !customOpen && option.value === props.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              data-active={active || undefined}
              onClick={() => {
                setTyping(false);
                props.onChange(option.value);
              }}
            >
              {option.label}
            </button>
          );
        })}
        {props.custom ? (
          <button
            type="button"
            aria-pressed={customOpen}
            data-active={customOpen || undefined}
            onClick={() => setTyping(true)}
          >
            {props.custom.label}
          </button>
        ) : null}
      </div>
      {customOpen ? props.custom?.input : null}
      {props.error ? (
        <p className="oc-error" id={errorId}>
          {props.error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** The typed entry behind a picker's custom option. */
export function CustomNumber(props: {
  id: string;
  label: string;
  value: string;
  onChange: (draft: string) => void;
  locale: string;
  invalid: boolean;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="oc-meeting-custom">
      <label className="oc-sr-only" htmlFor={props.id}>
        {props.label}
      </label>
      <NumberField
        id={props.id}
        name={props.id}
        value={props.value}
        locale={props.locale}
        invalid={props.invalid}
        prefix={props.prefix}
        suffix={props.suffix}
        onChange={props.onChange}
      />
    </div>
  );
}

/** A closed panel for settings most people keep, with their values in the summary. */
export function Assumptions(props: {
  summary: string;
  title: string;
  forceOpen: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="oc-meeting-assumptions"
      open={open || props.forceOpen}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span className="oc-field-label">{props.title}</span>
        <span className="oc-quiet">{props.summary}</span>
      </summary>
      <div className="oc-meeting-assumptions-body">{props.children}</div>
    </details>
  );
}
