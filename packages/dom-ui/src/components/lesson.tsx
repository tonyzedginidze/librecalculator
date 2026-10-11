import { calculatorCatalog } from "../../../calculators/src/catalog.generated";
import type { Lesson, LessonBlock } from "../../../content/src/schema";
import { ui } from "../../../i18n/src/ui";
import type { ExamplePresenter } from "../example-presentation";
import { messageText, proseParts } from "../lesson-text";
import { NumText } from "./num-text";

export function LessonArticle(props: {
  lesson: Lesson;
  messages: Readonly<Record<string, string>>;
  locale: string;
  fieldOrder?: (operation: string) => readonly string[];
  presenter?: ExamplePresenter;
  relatedHref?: (id: string) => string;
}) {
  return (
    <article className="oc-lesson" id="explanation">
      <h2>{ui["ui.lesson.heading"]}</h2>
      {props.lesson.blocks.map((block) => (
        <LessonBlockView
          key={block.id}
          block={block}
          lesson={props.lesson}
          messages={props.messages}
          locale={props.locale}
          {...(props.presenter ? { presenter: props.presenter } : {})}
          {...(props.relatedHref ? { relatedHref: props.relatedHref } : {})}
        />
      ))}
    </article>
  );
}

function LessonBlockView(props: {
  block: LessonBlock;
  lesson: Lesson;
  messages: Readonly<Record<string, string>>;
  locale: string;
  presenter?: ExamplePresenter;
  relatedHref?: (id: string) => string;
}) {
  const { block, messages } = props;

  switch (block.kind) {
    case "prose":
      return (
        <section>
          {block.titleKey ? (
            <h3>{messageText(messages, block.titleKey)}</h3>
          ) : null}
          <Prose text={messageText(messages, block.bodyKey)} />
        </section>
      );
    case "formula":
      return (
        <section>
          <p className="oc-formula">{messageText(messages, block.bodyKey)}</p>
          <table className="oc-table oc-vars">
            <caption>{ui["ui.lesson.variables"]}</caption>
            <tbody>
              {block.variables.map((variable) => (
                <tr key={variable.symbol}>
                  <th scope="row">{variable.symbol}</th>
                  <td>
                    {messageText(messages, variable.nameKey)}
                    {variable.unitKey
                      ? ` (${messageText(messages, variable.unitKey)})`
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "example": {
      const presentation = props.presenter
        ? props.presenter(
            { operation: block.operation, inputs: block.inputs },
            props.locale,
            messages,
          )
        : null;

      return (
        <section>
          <h3>{messageText(messages, block.titleKey)}</h3>
          {presentation?.ok ? (
            <>
              <table className="oc-table">
                <tbody>
                  {presentation.fields.map((field) => (
                    <tr key={field.id}>
                      <th scope="row">{field.label}</th>
                      <td>
                        <NumText text={field.value} />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">{ui["ui.lesson.expected"]}</th>
                    <td>
                      <NumText text={presentation.answer} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="oc-working">
                {presentation.working.map((step) => (
                  <p key={step}>
                    <NumText text={step} />
                  </p>
                ))}
              </div>
            </>
          ) : (
            <p className="oc-notice">{ui["ui.lesson.missing"]}</p>
          )}
        </section>
      );
    }
    case "faq":
      return (
        <section>
          <h3>{messageText(messages, block.questionKey)}</h3>
          <Prose text={messageText(messages, block.answerKey)} />
        </section>
      );
    case "visual":
      return (
        <section>
          <h3>{ui["ui.visual.caption"]}</h3>
          <p>{messageText(messages, block.visualKey)}</p>
          <p>{messageText(messages, block.alternativeKey)}</p>
        </section>
      );
    case "related": {
      const known = calculatorCatalog.find(
        (item: { id: string; titleKey: string }) =>
          item.id === block.calculatorId,
      );
      return (
        <section>
          <h3>{ui["ui.lesson.related"]}</h3>
          {known && props.relatedHref ? (
            <a href={props.relatedHref(known.id)}>
              {messageText(messages, known.titleKey)}
            </a>
          ) : (
            <p>{ui["ui.lesson.missing"]}</p>
          )}
        </section>
      );
    }
  }
}

function Prose(props: { text: string }) {
  return (
    <p className="oc-prose">
      {proseParts(props.text).map((part) =>
        part.type === "link" ? (
          <a key={`link-${part.start}`} href={part.href}>
            {part.href}
          </a>
        ) : (
          <span key={`text-${part.start}`}>{part.value}</span>
        ),
      )}
    </p>
  );
}
