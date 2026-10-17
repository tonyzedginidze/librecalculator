import "../../../../design/src/finance.css";
import "../../../../design/src/meeting-cost.css";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { FieldDescriptor } from "../../../../calculators/src/contracts";
import {
  type BudgetVisual,
  type ErrorCode,
  MAX_GROUP_PEOPLE,
  MAX_GROUPS,
  type MeetingVisual,
  type Result,
} from "../../../../calculators/src/meeting-cost";
import { formatDecimal } from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { NumberField } from "../../components/number-field";
import {
  CompareBars,
  fillMessage,
  SplitBar,
  StatGrid,
  VizFigure,
  type VizTone,
} from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { renderFinanceWorking } from "../finance-format";
import { financeFormat } from "../finance-topic";
import { adapter, draftOf, moneyArgs, type Row, rowsOf } from "./adapter";
import { Assumptions, CustomNumber, Picker } from "./fields";
import { answerText } from "./format";

const LENGTHS = ["15", "25", "30", "45", "60", "90"];
const REFOCUS = ["0", "5", "10", "15", "25"];
const BUDGETS = ["100", "250", "500", "1000", "5000"];
const OVERHEADS = ["1", "1.25", "1.3", "1.4", "1.5"];
/** Paid hours a year for common full-time weeks, over 52 paid weeks. */
const WEEKS = [
  ["2080", "40"],
  ["1950", "37.5"],
  ["1820", "35"],
] as const;
const TONES: readonly VizTone[] = ["accent", "soft", "ink", "muted"];

type Format = ReturnType<typeof financeFormat>;
type Msg = (key: string) => string;

export default function View(props: TopicViewProps) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const f = financeFormat(messages, locale);
  const m: Msg = (key) => messageText(messages, key);
  const num = (canonical: string, digits?: number) =>
    formatDecimal(
      canonical,
      locale,
      digits === undefined ? undefined : { fractionDigits: digits },
    );

  const draft = (id: string) => controller.drafts[id] ?? "";
  const set = (id: string) => (value: string) => controller.setDraft(id, value);
  const custom = (
    id: string,
    label: string,
    invalid: boolean,
    affix: { prefix?: string; suffix?: string },
  ) => ({
    label: m("meeting-cost.ui.custom"),
    input: (
      <CustomNumber
        id={id}
        label={label}
        value={draft(id)}
        onChange={set(id)}
        locale={locale}
        invalid={invalid}
        {...affix}
      />
    ),
  });
  const minutesOption = (value: string) => ({
    value,
    label:
      value === "0"
        ? m("meeting-cost.ui.refocus-none")
        : fillMessage(m("meeting-cost.ui.preset"), { minutes: num(value) }),
  });

  const field = (
    descriptor: FieldDescriptor,
    errorOf: (id: string) => string | null,
  ): ReactNode => {
    const id = descriptor.id;
    const label = m(descriptor.labelKey);
    const error = errorOf(id);
    switch (id) {
      case "attendees":
        return (
          <AttendeeEditor
            label={label}
            draft={draft(id)}
            onChange={set(id)}
            error={error}
            locale={locale}
            m={m}
          />
        );
      case "minutes":
      case "refocus":
        return (
          <Picker
            id={id}
            label={label}
            value={draft(id)}
            onChange={set(id)}
            error={error}
            options={(id === "minutes" ? LENGTHS : REFOCUS).map(minutesOption)}
            custom={custom(id, label, error !== null, {
              suffix: m("meeting-cost.unit.min"),
            })}
          />
        );
      case "frequency":
        return (
          <Picker
            id={id}
            label={label}
            value={draft(id)}
            onChange={set(id)}
            error={error}
            options={(descriptor.choices ?? []).map((c) => ({
              value: c.id,
              label: m(c.labelKey),
            }))}
          />
        );
      case "budget":
        return (
          <Picker
            id={id}
            label={label}
            value={draft(id)}
            onChange={set(id)}
            error={error}
            options={BUDGETS.map((value) => ({ value, label: f.usd(value) }))}
            custom={custom(id, label, error !== null, { prefix: "$" })}
          />
        );
      case "overhead": {
        const hoursLabel = m("meeting-cost.field.hours");
        const hoursError = errorOf("hours");
        return (
          <Assumptions
            title={m("meeting-cost.ui.assumptions")}
            summary={fillMessage(m("meeting-cost.ui.assumptions-summary"), {
              overhead: fillMessage(m("meeting-cost.ui.overhead-option"), {
                value: num(draft("overhead")),
              }),
              hours: num(draft("hours")),
            })}
            forceOpen={error !== null || hoursError !== null}
          >
            <Picker
              id={id}
              label={label}
              value={draft(id)}
              onChange={set(id)}
              error={error}
              options={OVERHEADS.map((value) => ({
                value,
                label:
                  value === "1"
                    ? m("meeting-cost.ui.overhead-none")
                    : fillMessage(m("meeting-cost.ui.overhead-option"), {
                        value: num(value),
                      }),
              }))}
              custom={custom(id, label, error !== null, {})}
            />
            <p className="oc-quiet oc-meeting-note">
              {m("meeting-cost.ui.overhead-note")}
            </p>
            <Picker
              id="hours"
              label={hoursLabel}
              value={draft("hours")}
              onChange={set("hours")}
              error={hoursError}
              options={WEEKS.map(([value, week]) => ({
                value,
                label: fillMessage(m("meeting-cost.ui.hours-option"), {
                  hours: num(value),
                  week: num(week),
                }),
              }))}
              custom={custom("hours", hoursLabel, hoursError !== null, {
                suffix: m("meeting-cost.unit.h"),
              })}
            />
          </Assumptions>
        );
      }
      case "hours":
        return null;
      default:
        return undefined;
    }
  };

  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId={adapter.id}
      title={title}
      description={description}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      renderField={field}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result, messages, locale) : ""
      }
      renderAnswer={(e) => <Answer e={e} f={f} m={m} num={num} />}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText
                  text={renderFinanceWorking(s, moneyArgs, messages, locale)}
                />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const v = e.outcome.result.visual;
        return v.kind === "meeting-cost" ? (
          <>
            <MeetingFigure v={v} f={f} m={m} num={num} />
            <Ticker v={v} f={f} m={m} num={num} />
          </>
        ) : (
          <BudgetFigure v={v} f={f} m={m} num={num} />
        );
      }}
    />
  );
}

type Shared = {
  f: Format;
  m: Msg;
  num: (canonical: string, digits?: number) => string;
};

/** People × salary rows, kept in the engine's "people x salary;…" draft. */
function AttendeeEditor(props: {
  label: string;
  draft: string;
  onChange: (draft: string) => void;
  error: string | null;
  locale: string;
  m: Msg;
}) {
  const { m } = props;
  const rows = rowsOf(props.draft);
  const set = (next: Row[]) => props.onChange(draftOf(next));
  const update = (index: number, patch: Partial<Row>) =>
    set(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  return (
    <fieldset
      className="oc-field oc-meeting-groups"
      aria-describedby={props.error ? "attendees-error" : undefined}
    >
      <legend className="oc-field-label">{props.label}</legend>
      <div className="oc-meeting-head" aria-hidden="true">
        <span>{m("meeting-cost.field.people")}</span>
        <span />
        <span>{m("meeting-cost.field.salary")}</span>
      </div>
      {rows.map((row, index) => {
        const n = String(index + 1);
        const group = fillMessage(m("meeting-cost.ui.group"), { index: n });
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional
          <div className="oc-meeting-row" key={index}>
            <label className="oc-sr-only" htmlFor={`attendees-people-${n}`}>
              {`${group}: ${m("meeting-cost.field.people")}`}
            </label>
            <div className="oc-meeting-stepper">
              <button
                type="button"
                aria-label={fillMessage(m("meeting-cost.ui.fewer"), {
                  index: n,
                })}
                disabled={!(Number(row.people) > 0)}
                onClick={() =>
                  update(index, {
                    people: String(Math.max(0, Number(row.people) - 1)),
                  })
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 12h12" />
                </svg>
              </button>
              <NumberField
                id={`attendees-people-${n}`}
                name={`attendees-people-${n}`}
                value={row.people}
                locale={props.locale}
                integer
                invalid={props.error !== null}
                onChange={(people) => update(index, { people })}
              />
              <button
                type="button"
                aria-label={fillMessage(m("meeting-cost.ui.more"), {
                  index: n,
                })}
                disabled={Number(row.people) >= MAX_GROUP_PEOPLE}
                onClick={() =>
                  update(index, {
                    people: String((Number(row.people) || 0) + 1),
                  })
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </button>
            </div>
            <span className="oc-meeting-times" aria-hidden="true">
              {m("meeting-cost.ui.times")}
            </span>
            <label className="oc-sr-only" htmlFor={`attendees-salary-${n}`}>
              {`${group}: ${m("meeting-cost.field.salary")}`}
            </label>
            <NumberField
              id={`attendees-salary-${n}`}
              name={`attendees-salary-${n}`}
              value={row.salary}
              locale={props.locale}
              prefix="$"
              invalid={props.error !== null}
              onChange={(salary) =>
                update(index, { salary: salary.replace(/[x;]/g, "") })
              }
            />
            <button
              type="button"
              className="oc-meeting-remove"
              aria-label={fillMessage(m("meeting-cost.ui.remove-group"), {
                index: n,
              })}
              disabled={rows.length === 1}
              onClick={() => set(rows.filter((_, i) => i !== index))}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17" />
              </svg>
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="oc-meeting-add"
        disabled={rows.length >= MAX_GROUPS}
        onClick={() => {
          const last = rows[rows.length - 1];
          set([...rows, { people: "1", salary: last?.salary ?? "" }]);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 6v12M6 12h12" />
        </svg>
        {m("meeting-cost.ui.add-group")}
      </button>
      {props.error ? (
        <p className="oc-error" id="attendees-error">
          {props.error}
        </p>
      ) : null}
    </fieldset>
  );
}

function Answer(props: Shared & { e: Evaluation<Result, ErrorCode> }) {
  const { e, f, m, num } = props;
  if (e.status !== "ok")
    return (
      <div className="oc-answer" aria-live="polite">
        <p className="oc-kicker">{ui["ui.answer.label"]}</p>
        <p className="oc-answer-value">{ui["ui.answer.empty"]}</p>
      </div>
    );
  const r = e.outcome.result;
  const v = r.visual;
  const room = fillMessage(m("meeting-cost.answer.room"), {
    people: num(v.people),
    roomHour: f.usd(v.roomHour),
    roomMinute: f.usd(v.roomMinute),
  });
  let detail: string;
  if (v.kind === "meeting-cost")
    detail =
      v.frequency === "once"
        ? room
        : `${fillMessage(m("meeting-cost.answer.year"), {
            yearly: f.usd(v.yearly),
            count: num(v.meetingsPerYear),
          })}. ${room}`;
  else
    detail =
      v.answer === "0"
        ? fillMessage(m("meeting-cost.answer.under-minute"), {
            roomMinute: f.usd(v.roomMinute),
          })
        : fillMessage(m("meeting-cost.answer.spent"), {
            minutes: num(v.answer),
            spent: f.usd(v.spent),
            budget: f.usd(v.budget),
          });
  return (
    <div className="oc-answer" aria-live="polite">
      <p className="oc-kicker">{m(`meeting-cost.answer.${r.operation}`)}</p>
      <div className="oc-answer-scroll">
        <p className="oc-answer-value">
          <NumText text={renderAnswer(r, f, m, num)} />
        </p>
      </div>
      <p>
        <NumText text={detail} />
      </p>
    </div>
  );
}

function renderAnswer(
  r: Result,
  f: Format,
  m: Msg,
  num: Shared["num"],
): string {
  return fillMessage(m(`meeting-cost.answer.value.${r.operation}`), {
    amount: f.usd(r.answer.value),
    minutes: num(r.answer.value),
  });
}

function groupParts(
  groups: MeetingVisual["groups"],
  f: Format,
  m: Msg,
  num: Shared["num"],
) {
  const seen = new Set<string>();
  return groups.map((g, i) => {
    let label = fillMessage(m("meeting-cost.visual.group"), {
      people: num(g.people),
      salary: f.usd(g.salary),
    });
    if (seen.has(label)) label = `${label} (${num(String(i + 1))})`;
    seen.add(label);
    return {
      label,
      value: Number(g.cost),
      display: f.usd(g.cost),
      tone: TONES[i % TONES.length] ?? "accent",
    };
  });
}

function MeetingFigure(props: Shared & { v: MeetingVisual }) {
  const { v, f, m, num } = props;
  const once = v.frequency === "once";
  const refocus = v.refocus !== "0";
  return (
    <VizFigure
      caption={m("meeting-cost.visual.caption")}
      summary={fillMessage(m("meeting-cost.visual.summary"), {
        answer: f.usd(v.answer),
        meetingPart: f.usd(v.meetingPart),
        refocusPart: f.usd(v.refocusPart),
        yearly: f.usd(v.yearly),
        personHours: num(v.personHours, 1),
      })}
    >
      {v.groups.length > 1 ? (
        <SplitBar
          total={{
            label: m("meeting-cost.visual.per-meeting"),
            display: f.usd(v.answer),
          }}
          parts={groupParts(v.groups, f, m, num)}
        />
      ) : null}
      {refocus ? (
        <SplitBar
          parts={[
            {
              label: m("meeting-cost.visual.meeting"),
              value: Number(v.meetingPart),
              display: f.usd(v.meetingPart),
              tone: "accent",
            },
            {
              label: m("meeting-cost.visual.refocus"),
              value: Number(v.refocusPart),
              display: f.usd(v.refocusPart),
              tone: "muted",
            },
          ]}
        />
      ) : null}
      <StatGrid
        items={[
          ...(once
            ? []
            : [
                {
                  label: m("meeting-cost.visual.monthly"),
                  display: f.usd(v.monthly),
                },
                {
                  label: m("meeting-cost.visual.yearly"),
                  display: f.usd(v.yearly),
                },
              ]),
          {
            label: m("meeting-cost.visual.person-hours"),
            display: num(v.personHours, 1),
          },
          {
            label: m("meeting-cost.visual.fte"),
            display: f.percent(v.fteShare, 1),
          },
        ]}
      />
      <div className="oc-kicker oc-meeting-subhead">
        {m("meeting-cost.visual.savings")}
      </div>
      <CompareBars
        rows={[
          {
            label: m("meeting-cost.visual.minute-saving"),
            value: Number(v.minuteSaving),
            display: f.usd(v.minuteSaving),
            tone: "soft",
          },
          {
            label: m("meeting-cost.visual.five-saving"),
            value: Number(v.fiveMinuteSaving),
            display: f.usd(v.fiveMinuteSaving),
            tone: "accent",
          },
          ...(Number(v.people) > 1
            ? [
                {
                  label: m("meeting-cost.visual.person-saving"),
                  value: Number(v.personSaving),
                  display: f.usd(v.personSaving),
                  tone: "soft" as const,
                },
              ]
            : []),
        ]}
      />
    </VizFigure>
  );
}

function BudgetFigure(props: Shared & { v: BudgetVisual }) {
  const { v, f, m, num } = props;
  return (
    <VizFigure
      caption={m("meeting-cost.visual.budget-caption")}
      summary={fillMessage(m("meeting-cost.visual.budget-summary"), {
        roomMinute: f.usd(v.roomMinute),
        budget: f.usd(v.budget),
        minutes: num(v.answer),
        spent: f.usd(v.spent),
      })}
    >
      {v.groups.length > 1 ? (
        <SplitBar
          total={{
            label: m("meeting-cost.visual.per-minute"),
            display: f.usd(v.roomMinute),
          }}
          parts={groupParts(v.groups, f, m, num)}
        />
      ) : null}
      <StatGrid
        items={[
          {
            label: m("meeting-cost.visual.per-minute"),
            display: f.usd(v.roomMinute),
          },
          {
            label: m("meeting-cost.visual.per-hour"),
            display: f.usd(v.roomHour),
          },
          {
            label: m("meeting-cost.visual.budget"),
            display: f.usd(v.budget),
          },
          {
            label: m("meeting-cost.answer.budget-minutes"),
            display: fillMessage(
              m("meeting-cost.answer.value.budget-minutes"),
              {
                minutes: num(v.answer),
              },
            ),
            emphasis: true,
          },
        ]}
      />
    </VizFigure>
  );
}

/** A running total to share on screen while the meeting happens. */
function Ticker(props: Shared & { v: MeetingVisual }) {
  const { v, f, m } = props;
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(0);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setElapsed(performance.now() - started.current),
      100,
    );
    return () => window.clearInterval(id);
  }, [running]);

  const seconds = Math.floor(elapsed / 1000);
  const clock = [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ]
    .map((part, i) => (i === 0 ? String(part) : String(part).padStart(2, "0")))
    .join(":");
  const spentNumber = (Number(v.roomHour) * elapsed) / 3_600_000;
  const spent = spentNumber.toFixed(2);
  const planned = Number(v.answer);
  const share = planned > 0 ? spentNumber / planned : 0;
  const status =
    elapsed === 0
      ? fillMessage(m("meeting-cost.ticker.intro"), {
          roomMinute: f.usd(v.roomMinute),
        })
      : share <= 1
        ? fillMessage(m("meeting-cost.ticker.planned"), {
            percent: f.percent(String(Math.round(share * 100)), 0),
            answer: f.usd(v.answer),
          })
        : fillMessage(m("meeting-cost.ticker.over"), {
            over: f.usd((spentNumber - planned).toFixed(2)),
            answer: f.usd(v.answer),
          });

  return (
    <section
      className="oc-meeting-ticker"
      ref={panel}
      data-running={running || undefined}
      data-over={share > 1 || undefined}
      aria-labelledby="meeting-ticker-heading"
    >
      <h2 className="oc-kicker" id="meeting-ticker-heading">
        {m("meeting-cost.ticker.heading")}
      </h2>
      <div className="oc-meeting-ticker-figures">
        <div>
          <span className="oc-quiet">{m("meeting-cost.ticker.spent")}</span>
          <strong className="oc-meeting-ticker-money">
            <NumText text={f.usd(spent)} />
          </strong>
        </div>
        <div>
          <span className="oc-quiet">{m("meeting-cost.ticker.elapsed")}</span>
          <strong className="oc-meeting-ticker-clock">
            <NumText text={clock} />
          </strong>
        </div>
      </div>
      <div className="oc-meeting-ticker-track" aria-hidden="true">
        <span style={{ width: `${Math.min(1, share) * 100}%` }} />
      </div>
      <p className="oc-quiet" aria-live="off">
        <NumText text={status} />
      </p>
      <div className="oc-meeting-ticker-actions">
        <button
          type="button"
          className="oc-button oc-button-primary"
          onClick={() => {
            // Resume from the elapsed time already on the clock.
            if (!running) started.current = performance.now() - elapsed;
            setRunning(!running);
          }}
        >
          {running
            ? m("meeting-cost.ticker.pause")
            : elapsed > 0
              ? m("meeting-cost.ticker.resume")
              : m("meeting-cost.ticker.start")}
        </button>
        <button
          type="button"
          className="oc-button"
          disabled={elapsed === 0}
          onClick={() => {
            setRunning(false);
            setElapsed(0);
          }}
        >
          {m("meeting-cost.ticker.reset")}
        </button>
        <button
          type="button"
          className="oc-button"
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else void panel.current?.requestFullscreen?.();
          }}
        >
          {m("meeting-cost.ticker.fullscreen")}
        </button>
      </div>
    </section>
  );
}
