import type { Lesson, LessonBlock } from "../../content/src/schema";

export type ProsePart =
  | { type: "text"; value: string; start: number }
  | { type: "link"; href: string; start: number };

export function proseParts(text: string): ProsePart[] {
  const parts: ProsePart[] = [];
  const pattern = /https:\/\/[^\s)]+/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    let href = match[0];
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push({
        type: "text",
        value: text.slice(cursor, index),
        start: cursor,
      });
    }
    let trailingPunctuation = "";
    while (href.length > 0 && /[.,;:!?]$/.test(href)) {
      trailingPunctuation = href.slice(-1) + trailingPunctuation;
      href = href.slice(0, -1);
    }
    parts.push({ type: "link", href, start: index });
    if (trailingPunctuation.length > 0) {
      parts.push({
        type: "text",
        value: trailingPunctuation,
        start: index + href.length,
      });
    }
    cursor = index + match[0].length;
  }
  if (cursor < text.length) {
    parts.push({ type: "text", value: text.slice(cursor), start: cursor });
  }
  return parts;
}

export function messageText(
  messages: Readonly<Record<string, string>>,
  key: string,
): string {
  return Object.hasOwn(messages, key) ? (messages[key] ?? key) : key;
}

export function lessonBlocks(lesson: Lesson): readonly LessonBlock[] {
  return lesson.blocks;
}
