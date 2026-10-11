import type { CSSProperties, ReactNode } from "react";
import type { WorkingStep } from "../../../calculators/src/contracts";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import { CalculatorPanel } from "../components/calculator";
import { NumText } from "../components/num-text";
import { CountGrid, Equation, fillMessage } from "../components/viz";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";
import { useCalculator } from "../use-calculator";
import type { TopicViewProps } from "../view-contract";

type ConstructionResult = {
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
};

export type ConstructionVisualContext<R> = {
  result: R;
  /** Formats a canonical decimal at the given precision (default: answer precision). */
  show: (value: string, digits?: number) => string;
  msg: (key: string, vars?: Readonly<Record<string, string>>) => string;
  locale: string;
};

/**
 * Shared page for the construction pack: one answer at a fixed display precision,
 * full-precision working, and a pack-specific diagram from the same result.
 */
export function ConstructionTopic<
  R extends ConstructionResult,
  E extends string,
>({
  adapter,
  digits,
  unit,
  visual,
  ...props
}: TopicViewProps & {
  adapter: TopicAdapter<R, E>;
  digits: number;
  /** Unit text placed after the answer, chosen for the displayed value. */
  unit: (value: string, msg: ConstructionVisualContext<R>["msg"]) => string;
  visual: (context: ConstructionVisualContext<R>) => ReactNode;
}) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator<R, E>({ adapter, locale });
  const msg = (key: string, vars?: Readonly<Record<string, string>>) =>
    vars
      ? fillMessage(messageText(messages, key), vars)
      : messageText(messages, key);
  const show = (value: string, d = digits) =>
    formatDecimal(value, locale, { fractionDigits: d });
  const answerText = (value: string) => `${show(value)} ${unit(value, msg)}`;
  return (
    <CalculatorPanel<R, E>
      topicId={adapter.id}
      title={title}
      description={description}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: messageText(messages, d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result.answer.value) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <div className="oc-answer-scroll">
            <p className="oc-answer-value">
              {e.status === "ok" ? (
                <NumText text={answerText(e.outcome.result.answer.value)} />
              ) : (
                ui["ui.answer.empty"]
              )}
            </p>
          </div>
          {e.status === "ok" &&
          isRoundedForDisplay(e.outcome.result.answer.value, digits) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText text={renderWorkingStep(s, { locale, messages })} />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) =>
        e.status === "ok"
          ? visual({ result: e.outcome.result, show, msg, locale })
          : null
      }
    />
  );
}

const MAX_CELLS = 120;

/**
 * Whole items to buy: a grid with one cell per item and the last one part-filled by
 * the share actually needed. Large counts fall back to a needed → buy strip.
 */
export function PurchaseCount(props: {
  exact: string;
  answer: string;
  exactDisplay: string;
  answerDisplay: string;
  countText: string;
  label: string;
  neededLabel: string;
  buyLabel: string;
}) {
  const total = Number(props.answer);
  const exact = Number(props.exact);
  if (!Number.isFinite(total) || total > MAX_CELLS)
    return (
      <Equation
        items={[
          { label: props.neededLabel, display: props.exactDisplay },
          { op: "→" },
          {
            label: props.buyLabel,
            display: props.answerDisplay,
            emphasis: true,
          },
        ]}
      />
    );
  const filled = Math.floor(exact);
  return (
    <CountGrid
      total={total}
      filled={filled}
      partial={exact - filled}
      columns={total <= 12 ? total : total <= 40 ? 10 : 15}
      display={props.countText}
      label={props.label}
    />
  );
}

/* Drawing helpers for the pack's custom diagrams (kit look: accent strokes,
   soft fills, line for quiet detail, mono figures). */
export const draw = {
  accent: "var(--oc-accent)",
  soft: "var(--oc-accent-soft)",
  surface: "var(--oc-surface)",
  line: "var(--oc-line)",
  ink: "var(--oc-ink)",
  muted: "var(--oc-muted)",
};

export const figText: CSSProperties = {
  fontFamily: "var(--oc-font-mono)",
  fontSize: 15,
  fontVariantNumeric: "tabular-nums",
};

export function DiagramSvg(props: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${props.width} ${props.height}`}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        maxWidth: `${props.width * 1.2}px`,
        height: "auto",
        margin: "0 auto",
        overflow: "visible",
      }}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {props.children}
    </svg>
  );
}
