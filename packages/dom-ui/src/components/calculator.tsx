import { Fragment, type ReactNode, useState } from "react";
import type { CalculatorId } from "../../../calculators/src/catalog.generated";
import type { FieldDescriptor } from "../../../calculators/src/contracts";
import { ui } from "../../../i18n/src/ui";
import type { Evaluation } from "../evaluate";
import { messageText } from "../lesson-text";
import { ActivePill, MotionProvider, PillGroup } from "../motion";
import { unitAffix } from "../number-input";
import type { CalculatorController } from "../use-calculator";
import { CopyIcon, OperationIcon } from "./art";
import { NumberField } from "./number-field";
import { Select, type SelectOption } from "./select";

export function CalculatorPanel<R, Code extends string = string>(props: {
  title: string;
  description: string;
  topicId: CalculatorId | string;
  controller: CalculatorController<R, Code>;
  operations: readonly { id: string; label: string }[];
  messages: Readonly<Record<string, string>>;
  locale: string;
  getCopyText?: (evaluation: Evaluation<R, Code>) => string;
  renderAnswer?: (evaluation: Evaluation<R, Code>) => ReactNode;
  renderWorking?: (evaluation: Evaluation<R, Code>) => ReactNode;
  renderVisual?: (evaluation: Evaluation<R, Code>) => ReactNode;
  choiceOptions?: (field: FieldDescriptor) => SelectOption[];
  /**
   * A topic's own editor for a field, given each field's error message; return
   * undefined for the default input, or null to show nothing in its place.
   */
  renderField?: (
    field: FieldDescriptor,
    errorOf: (fieldId: string) => string | null,
  ) => ReactNode;
  extra?: ReactNode;
}) {
  const { controller, messages } = props;
  const evaluation = controller.evaluation;
  const [copied, setCopied] = useState(false);
  const copyText =
    props.getCopyText && evaluation.status === "ok"
      ? props.getCopyText(evaluation)
      : "";

  return (
    <form className="oc-calc" onSubmit={(event) => event.preventDefault()}>
      <header className="oc-calc-head">
        <h1 className="oc-title">{props.title}</h1>
        <p className="oc-quiet">{props.description}</p>
      </header>
      <div className="oc-calc-grid">
        <section
          className="oc-calc-inputs"
          aria-label={ui["ui.section.inputs"]}
        >
          {props.operations.length > 1 ? (
            <MotionProvider>
              <PillGroup>
                {(group) => (
                  <fieldset className="oc-ops">
                    <legend className="oc-group-label">
                      {ui["ui.operation.group"]}
                    </legend>
                    {props.operations.map((operation) => (
                      <button
                        key={operation.id}
                        type="button"
                        aria-pressed={operation.id === controller.operationId}
                        onClick={() => controller.setOperation(operation.id)}
                      >
                        {operation.id === controller.operationId ? (
                          <ActivePill group={`${group}-ops`} ring radius={6} />
                        ) : null}
                        <OperationIcon id={operation.id} />
                        {operation.label}
                      </button>
                    ))}
                  </fieldset>
                )}
              </PillGroup>
            </MotionProvider>
          ) : null}
          <div className="oc-fields">
            {controller.descriptor.fields.map((field) => {
              const issue = fieldIssue(evaluation, field.id);
              const errorId = `${field.id}-error`;
              const engineMessage =
                evaluation.status === "error" && evaluation.field === field.id
                  ? messageText(
                      messages,
                      `${props.topicId}.error.${evaluation.code}`,
                    )
                  : null;
              const custom = props.renderField?.(field, (id) =>
                evaluation.status === "error" && evaluation.field === id
                  ? messageText(
                      messages,
                      `${props.topicId}.error.${evaluation.code}`,
                    )
                  : fieldIssue(evaluation, id),
              );
              if (custom !== undefined)
                return <Fragment key={field.id}>{custom}</Fragment>;

              if (field.input === "text") {
                return (
                  <div className="oc-field" key={field.id}>
                    <label className="oc-field-label" htmlFor={field.id}>
                      {messageText(messages, field.labelKey)}
                    </label>
                    <input
                      className="oc-text-input"
                      id={field.id}
                      name={field.id}
                      type="text"
                      value={controller.drafts[field.id] ?? ""}
                      aria-invalid={issue !== null || engineMessage !== null}
                      aria-describedby={
                        issue || engineMessage ? errorId : undefined
                      }
                      onChange={(event) =>
                        controller.setDraft(field.id, event.currentTarget.value)
                      }
                    />
                    {issue || engineMessage ? (
                      <p className="oc-error" id={errorId}>
                        {engineMessage ?? issue}
                      </p>
                    ) : null}
                  </div>
                );
              }
              if (field.input === "choice") {
                return (
                  <div className="oc-field" key={field.id}>
                    <label className="oc-field-label" htmlFor={field.id}>
                      {messageText(messages, field.labelKey)}
                    </label>
                    <div className="oc-field-row">
                      <Select
                        id={field.id}
                        value={controller.drafts[field.id] ?? ""}
                        invalid={issue !== null || engineMessage !== null}
                        describedBy={
                          issue || engineMessage ? errorId : undefined
                        }
                        options={
                          props.choiceOptions
                            ? props.choiceOptions(field)
                            : (field.choices ?? []).map((choice) => ({
                                value: choice.id,
                                label: messageText(messages, choice.labelKey),
                              }))
                        }
                        onChange={(value) =>
                          controller.setDraft(field.id, value)
                        }
                      />
                    </div>
                    {issue || engineMessage ? (
                      <p className="oc-error" id={errorId}>
                        {engineMessage ?? issue}
                      </p>
                    ) : null}
                  </div>
                );
              }

              return (
                <div className="oc-field" key={field.id}>
                  <label className="oc-field-label" htmlFor={field.id}>
                    {messageText(messages, field.labelKey)}
                  </label>
                  <NumberField
                    id={field.id}
                    name={field.id}
                    value={controller.drafts[field.id] ?? ""}
                    locale={props.locale}
                    integer={field.input === "integer"}
                    invalid={issue !== null || engineMessage !== null}
                    describedBy={issue || engineMessage ? errorId : undefined}
                    {...unitAffix(
                      field.unitKey,
                      field.unitKey
                        ? messageText(messages, field.unitKey)
                        : undefined,
                    )}
                    onChange={(draft) => controller.setDraft(field.id, draft)}
                    onToggleSign={
                      field.input === "integer" || field.sign === "nonnegative"
                        ? undefined
                        : () => controller.toggleFieldSign(field.id)
                    }
                    signLabel={ui["ui.field.sign"]}
                  />
                  {issue || engineMessage ? (
                    <p className="oc-error" id={errorId}>
                      {engineMessage ?? issue}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
          {evaluation.status === "error" && evaluation.field === undefined ? (
            <p className="oc-error">
              {messageText(
                messages,
                `${props.topicId}.error.${evaluation.code}`,
              )}
            </p>
          ) : null}
          {props.extra}
        </section>
        <section
          className="oc-calc-results"
          aria-label={ui["ui.section.result"]}
        >
          <div className="oc-answer-wrap">
            {props.renderAnswer ? props.renderAnswer(evaluation) : null}
            {copyText ? (
              <button
                type="button"
                className="oc-copy"
                data-done={copied || undefined}
                onClick={() => {
                  navigator.clipboard.writeText(copyText).then(
                    () => setCopied(true),
                    () => setCopied(false),
                  );
                }}
              >
                <CopyIcon done={copied} />
                {copied ? ui["ui.copy.done"] : ui["ui.copy"]}
              </button>
            ) : null}
          </div>
          {props.renderWorking ? props.renderWorking(evaluation) : null}
          {props.renderVisual ? props.renderVisual(evaluation) : null}
        </section>
      </div>
    </form>
  );
}

function fieldIssue<R, Code extends string>(
  evaluation: Evaluation<R, Code>,
  fieldId: string,
): string | null {
  if (evaluation.status !== "incomplete" && evaluation.status !== "invalid") {
    return null;
  }
  const issue = evaluation.issues.find((item) => item.fieldId === fieldId);
  if (!issue) return null;
  if (issue.state === "incomplete") return ui["ui.field.incomplete"];
  switch (issue.reason) {
    case "grouping":
      return ui["ui.field.invalid.grouping"];
    case "ambiguous-separator":
      return ui["ui.field.invalid.ambiguous-separator"];
    case "too-precise":
      return ui["ui.field.invalid.too-precise"];
    case "too-long":
      return ui["ui.field.invalid.too-long"];
    case "out-of-range":
      return ui["ui.field.invalid.out-of-range"];
    default:
      return ui["ui.field.invalid.invalid-character"];
  }
}
