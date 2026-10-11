import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateWebTopics } from "./generate-web-topics";

test("generates sorted routes importing each topic view directly", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-topic-generation-"));
  const webRoot = join(root, "web");
  const domTopicsRoot = join(root, "dom-topics");
  try {
    for (const id of ["second-topic", "first-topic"]) {
      await mkdir(join(domTopicsRoot, id), { recursive: true });
      await writeFile(
        join(domTopicsRoot, id, "view.tsx"),
        "export default function View() {};",
      );
      await writeFile(
        join(domTopicsRoot, id, "adapter.ts"),
        "export const adapter = {};",
      );
      await writeFile(
        join(domTopicsRoot, id, "examples.ts"),
        "export const presentExample = () => ({ ok: false });",
      );
    }
    const outputs = await generateWebTopics(
      [
        { id: "second-topic", slug: "second-calculator" },
        { id: "first-topic", slug: "first-calculator" },
      ],
      webRoot,
      domTopicsRoot,
    );

    expect(outputs.map(({ path }) => path)).toEqual([
      join(webRoot, "src/pages/calculators/first-calculator/index.astro"),
      join(webRoot, "src/pages/calculators/second-calculator/index.astro"),
    ]);
    const outputContent = (index: number) => {
      const output = outputs[index];
      if (!output)
        throw new Error(`Missing expected generated output at index ${index}`);
      return output.content;
    };
    const firstRoute = outputContent(0);
    const secondRoute = outputContent(1);
    expect(firstRoute).toContain(
      'import { presentExample as topicExamplePresenter } from "@open-calculators/dom-ui/topics/first-topic/examples"',
    );
    expect(firstRoute).toContain(
      'import TopicView from "@open-calculators/dom-ui/topics/first-topic/view"',
    );
    expect(firstRoute).toContain('candidate.slug === "first-calculator"');
    expect(secondRoute).toContain(
      'import { presentExample as topicExamplePresenter } from "@open-calculators/dom-ui/topics/second-topic/examples"',
    );
    expect(secondRoute).toContain(
      'import TopicView from "@open-calculators/dom-ui/topics/second-topic/view"',
    );
    expect(firstRoute).not.toContain("getTopicAdapter");
    expect(firstRoute).not.toContain("Loading");
    expect(firstRoute).not.toContain('item.id === "percentage"');
    expect(firstRoute).not.toContain("import.meta.glob");
    expect(firstRoute).toContain("presenter={topicExamplePresenter}");
    expect(firstRoute).not.toContain("engineImports");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("fails generation when a catalog topic lacks either DOM source", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-topic-generation-"));
  try {
    await mkdir(join(root, "dom-topics", "incomplete"), { recursive: true });
    await writeFile(join(root, "dom-topics/incomplete/view.tsx"), "export {};");
    await writeFile(
      join(root, "dom-topics/incomplete/adapter.ts"),
      "export {};",
    );
    await expect(
      generateWebTopics(
        [{ id: "incomplete", slug: "incomplete" }],
        join(root, "web"),
        join(root, "dom-topics"),
      ),
    ).rejects.toThrow("Missing DOM topic examples.ts for incomplete");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects unsafe catalog identifiers before creating outputs", async () => {
  await expect(
    generateWebTopics(
      [{ id: "../other", slug: "unsafe" }],
      "/tmp/web",
      "/tmp/topics",
    ),
  ).rejects.toThrow("Invalid web topic ID or slug");
});
