import type { CalculatorId } from "../../../calculators/src/catalog.generated";
import type { ExamplePresenter } from "../example-presentation";
import type { TopicAdapter } from "../topic";
import {
  type AdapterModuleLoader,
  type ExamplePresenterModuleLoader,
  getTopicAdapter,
  loadTopicAdapterModule,
  loadTopicExamplePresenterModule,
  loadTopicViewModule,
  registerLoadedTopicAdapter,
  type TopicModuleLoader,
} from "./loader-core";

export type { ExamplePresenter } from "../example-presentation";
export {
  getTopicAdapter,
  getTopicView,
  loadTopicAdapterModule,
  loadTopicExamplePresenterModule,
  registerTopicAdapter,
  registerTopicView,
} from "./loader-core";

const viewLoaders = import.meta.glob("./*/view.tsx") as unknown as Record<
  string,
  TopicModuleLoader
>;
const adapterLoaders = import.meta.glob("./*/adapter.ts") as unknown as Record<
  string,
  AdapterModuleLoader
>;
const examplePresenterLoaders = import.meta.glob(
  "./*/examples.ts",
) as unknown as Record<string, ExamplePresenterModuleLoader>;

export function loadTopicView(id: CalculatorId | string) {
  return loadTopicViewModule(id, viewLoaders);
}

export async function loadTopicAdapter(
  id: CalculatorId | string,
): Promise<TopicAdapter<unknown, string> | null> {
  const existing = getTopicAdapter(id);
  if (existing) return existing;

  const adapter = await loadTopicAdapterModule(id, adapterLoaders);
  if (!adapter) return null;
  return registerLoadedTopicAdapter(adapter);
}

export async function loadTopicExamplePresenter(
  id: string,
): Promise<ExamplePresenter> {
  const presenter = await loadTopicExamplePresenterModule(
    id,
    examplePresenterLoaders,
  );
  if (!presenter) {
    throw new Error(
      `No example presenter module found for topic "${id}"; add ${id}/examples.ts exporting "presentExample"`,
    );
  }
  return presenter;
}
