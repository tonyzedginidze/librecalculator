import { lessonImports } from "@open-calculators/content";
import type { Lesson } from "@open-calculators/content/schema";
import {
  type ExamplePresenter,
  loadTopicExamplePresenter,
  loadTopicView,
} from "@open-calculators/dom-ui/topics/loader";
import type { TopicViewProps } from "@open-calculators/dom-ui/view-contract";
import { en } from "@open-calculators/i18n";
import { topicMessageImports } from "@open-calculators/i18n/topics";
import { ui } from "@open-calculators/i18n/ui";
import { type ComponentType, useEffect, useState } from "react";

export type Topic = {
  View: ComponentType<TopicViewProps>;
  lesson: Lesson;
  presenter: ExamplePresenter;
  messages: Record<string, string>;
};

/** Loads a calculator's view, lesson and messages; null while loading. */
export function useTopic(id: string): {
  topic: Topic | null;
  error: string | null;
} {
  const [state, setState] = useState<{ id: string; topic: Topic } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    void Promise.all([
      loadTopicView(id),
      loadTopicExamplePresenter(id),
      lessonImports[id as keyof typeof lessonImports]?.(),
      topicMessageImports[id as keyof typeof topicMessageImports]?.(),
    ])
      .then(([View, presenter, lessonMod, messagesMod]) => {
        if (!active) return;
        if (!View || !lessonMod?.lesson || !messagesMod?.messages) {
          throw new Error(`Incomplete topic modules for "${id}"`);
        }
        setState({
          id,
          topic: {
            View,
            lesson: lessonMod.lesson,
            presenter,
            messages: { ...en, ...ui, ...messagesMod.messages },
          },
        });
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : String(cause));
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { topic: state?.id === id ? state.topic : null, error };
}
