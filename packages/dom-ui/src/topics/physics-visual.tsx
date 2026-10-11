import type { ReactNode } from "react";
import { formatDecimal } from "../../../i18n/src/en";
import type { NumericVisualContext } from "../components/numeric-topic";
import { Equation, fillMessage, VizFigure } from "../components/viz";
import { messageText } from "../lesson-text";
import { unitAffix } from "../number-input";

/**
 * Physics pack result figure: the formula with the user's numbers (one Equation
 * strip), then an optional small diagram. Every value comes from the engine's
 * labelled rows, so the figure always matches the answer and the working.
 */

export type PhysicsTerm = {
  /** Engine field id; the row label is `<calculator>.field.<field>`. */
  field: string;
  /** Field unit message, "Kilograms (kg)"; the symbol in brackets is shown. */
  unitKey: string;
  /** Optional message wrapping the figure, e.g. "({value})²". */
  wrapKey?: string;
};

export function physicsValues(ctx: NumericVisualContext, id: string) {
  const raw = (labelKey: string) =>
    ctx.result.visual.rows.find((r) => r.labelKey === labelKey)?.value ?? "0";
  const symbol = (unitKey: string) =>
    unitAffix(unitKey, messageText(ctx.messages, unitKey)).suffix ?? "";
  const withUnit = (display: string, unit: string) =>
    unit ? `${display} ${unit}` : display;
  /** Inputs keep their full digits; only the answer uses display precision. */
  const field = (name: string, unitKey: string) =>
    withUnit(
      formatDecimal(raw(`${id}.field.${name}`), ctx.locale),
      symbol(unitKey),
    );
  const answer = withUnit(ctx.show(ctx.result.answer.value), ctx.unit);
  return { raw, symbol, withUnit, field, answer };
}

export function PhysicsFigure(props: {
  ctx: NumericVisualContext;
  id: string;
  terms: readonly [PhysicsTerm, PhysicsTerm];
  /** Operator between the two terms and before the answer. */
  ops: readonly [string, string];
  /** Extra already-formatted values for the summary sentence. */
  vars?: Readonly<Record<string, string>>;
  note?: ReactNode;
  children?: ReactNode;
}) {
  const { ctx, id } = props;
  const v = physicsValues(ctx, id);
  const term = (t: PhysicsTerm) => {
    const display = v.field(t.field, t.unitKey);
    return {
      label: messageText(ctx.messages, `${id}.field.${t.field}`),
      display: t.wrapKey
        ? fillMessage(messageText(ctx.messages, t.wrapKey), { value: display })
        : display,
    };
  };
  const [a, b] = props.terms;
  const vars = {
    [a.field]: v.field(a.field, a.unitKey),
    [b.field]: v.field(b.field, b.unitKey),
    answer: v.answer,
    ...props.vars,
  };
  return (
    <VizFigure
      caption={messageText(ctx.messages, `${id}.visual.caption`)}
      summary={fillMessage(
        messageText(ctx.messages, `${id}.visual.summary`),
        vars,
      )}
      note={props.note}
    >
      <Equation
        items={[
          term(a),
          { op: props.ops[0] },
          term(b),
          { op: props.ops[1] },
          {
            label: messageText(ctx.messages, `${id}.visual.answer`),
            display: v.answer,
            emphasis: true,
          },
        ]}
      />
      {props.children}
    </VizFigure>
  );
}

/** Shared look for the small physics diagrams (kit colours, mono figures). */
export const physicsSvg = {
  style: {
    display: "block",
    width: "100%",
    maxWidth: "26rem",
    height: "auto",
    justifySelf: "center",
    overflow: "visible",
  },
  label: {
    fontFamily: "var(--oc-font-mono)",
    fontSize: 13,
    fontWeight: 600,
  },
} as const;
