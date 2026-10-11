import type { ComponentType } from "react";
import type { CalculatorId } from "../../../calculators/src/catalog.generated";
import type { ExamplePresenter } from "../example-presentation";
import type { TopicAdapter } from "../topic";
import type { TopicViewProps } from "../view-contract";

export type TopicModule = {
  default: ComponentType<TopicViewProps>;
};
export type TopicModuleLoader = () => Promise<TopicModule>;
export type AdapterModuleLoader = () => Promise<unknown>;
export type ExamplePresenterModuleLoader = () => Promise<unknown>;

const viewRegistry = new Map<string, ComponentType<TopicViewProps>>();
const adapterRegistry = new Map<string, TopicAdapter<unknown, string>>();

export function registerTopicView(
  id: string,
  view: ComponentType<TopicViewProps>,
): void {
  viewRegistry.set(id, view);
}

export function registerTopicAdapter(
  id: string,
  adapter: TopicAdapter<unknown, string>,
): void {
  adapterRegistry.set(id, adapter);
}

export function getTopicView(
  id: CalculatorId | string,
): ComponentType<TopicViewProps> | null {
  return viewRegistry.get(id) ?? null;
}

export async function loadTopicViewModule(
  id: CalculatorId | string,
  loaders: Readonly<Record<string, TopicModuleLoader>>,
): Promise<ComponentType<TopicViewProps> | null> {
  const existing = viewRegistry.get(id);
  if (existing) return existing;

  const loader = loaders[`./${id}/view.tsx`];
  if (!loader) return null;
  try {
    const component = (await loader()).default;
    if (component) {
      viewRegistry.set(id, component);
      return component;
    }
  } catch {
    // Preserve the existing null result for optional view loads.
  }
  return null;
}

export function getTopicAdapter(
  id: CalculatorId | string,
): TopicAdapter<unknown, string> | null {
  return adapterRegistry.get(id) ?? null;
}

export function registerLoadedTopicAdapter(
  adapter: TopicAdapter<unknown, string>,
): TopicAdapter<unknown, string> {
  adapterRegistry.set(adapter.id, adapter);
  return adapter;
}

export async function loadTopicAdapterModule(
  id: string,
  loaders: Readonly<Record<string, AdapterModuleLoader>>,
): Promise<TopicAdapter<unknown, string> | null> {
  const key = `./${id}/adapter.ts`;
  const loader = loaders[key];
  if (!loader) return null;

  let loaded: unknown;
  try {
    loaded = await loader();
  } catch (error) {
    throw new Error(
      `Unable to load topic adapter module for "${id}" (${key})`,
      { cause: error },
    );
  }
  if (!loaded || typeof loaded !== "object" || !("adapter" in loaded)) {
    throw new Error(
      `Topic adapter module for "${id}" must export a named "adapter" value`,
    );
  }

  const adapter = loaded.adapter;
  if (!isTopicAdapter(adapter)) {
    throw new Error(
      `Topic adapter module for "${id}" exports an invalid "adapter" value`,
    );
  }
  if (adapter.id !== id) {
    throw new Error(
      `Topic adapter module for "${id}" exports adapter for "${adapter.id}"`,
    );
  }
  return adapter;
}

export async function loadTopicExamplePresenterModule(
  id: string,
  loaders: Readonly<Record<string, ExamplePresenterModuleLoader>>,
): Promise<ExamplePresenter | null> {
  const key = `./${id}/examples.ts`;
  const loader = loaders[key];
  if (!loader) return null;

  let loaded: unknown;
  try {
    loaded = await loader();
  } catch (error) {
    throw new Error(
      `Unable to load example presenter module for topic "${id}" (${key})`,
      { cause: error },
    );
  }
  if (!loaded || typeof loaded !== "object" || !("presentExample" in loaded)) {
    throw new Error(
      `Example presenter module for topic "${id}" must export a named "presentExample" function`,
    );
  }
  if (!isExamplePresenter(loaded.presentExample)) {
    throw new Error(
      `Example presenter module for topic "${id}" exports an invalid "presentExample" value`,
    );
  }
  return loaded.presentExample;
}

function isTopicAdapter(
  value: unknown,
): value is TopicAdapter<unknown, string> {
  return (
    !!value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string" &&
    "descriptors" in value &&
    Array.isArray(value.descriptors) &&
    "parseField" in value &&
    typeof value.parseField === "function" &&
    "calculate" in value &&
    typeof value.calculate === "function"
  );
}

function isExamplePresenter(value: unknown): value is ExamplePresenter {
  return typeof value === "function";
}
