import type { CalculatorId } from "@open-calculators/calculators";
import {
  type CatalogItem,
  type Category,
  catalogItems,
  categoryOrder,
  filterItems,
} from "@open-calculators/dom-ui/catalog";
import {
  BrandMark,
  CalculatorCard,
  CategoryIcon,
  LessonArticle,
} from "@open-calculators/dom-ui/components";
import { SettingsDialog, useActivePacks } from "@open-calculators/dom-ui/packs";
import { ui } from "@open-calculators/i18n/ui";
import { useEffect, useRef, useState } from "react";
import {
  isMac,
  onCalculatorSelected,
  onOpenSettings,
  setCalculatorMenu,
} from "../tauri";
import { useTopic } from "../use-topic";
import { Settings } from "./Settings";
import { VideoPane } from "./VideoPane";

type Pane = "calculator" | "lesson" | "video" | "settings";

const tabLabel = {
  calculator: ui["ui.pane.calculator"],
  lesson: ui["ui.pane.lesson"],
  video: ui["ui.pane.video"],
} as const;
const LAST = "oc.last";
const find = (id: string | null | undefined) =>
  catalogItems.find((item) => item.id === id);
const short = (title: string) => title.replace(/ calculator$/i, "");
const categoryName = (category: Category) => ui[`ui.category.${category}`];

function hasStartingCalculator(): boolean {
  try {
    return (
      find(new URLSearchParams(location.search).get("calculator")) !==
        undefined || find(localStorage.getItem(LAST)) !== undefined
    );
  } catch {
    return false;
  }
}

function initialId(): CalculatorId {
  const fromUrl = find(new URLSearchParams(location.search).get("calculator"));
  if (fromUrl) return fromUrl.id;
  try {
    const saved = find(localStorage.getItem(LAST));
    if (saved) return saved.id;
  } catch {}
  return (catalogItems[0] as CatalogItem).id;
}

export function DesktopApp() {
  const { active, toggle } = useActivePacks();
  const [selectedId, setSelectedId] = useState<CalculatorId>(initialId);
  const [pane, setPane] = useState<Pane>("calculator");
  const [query, setQuery] = useState("");
  // null shows the selected calculator; otherwise a card grid of that category.
  const [browse, setBrowse] = useState<Category | "all" | null>(() =>
    initialId() && hasStartingCalculator() ? null : "all",
  );
  const [expanded, setExpanded] = useState<Category | null>(
    () => find(initialId())?.category ?? null,
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const item = find(selectedId) as CatalogItem;

  const openCategory = (category: Category) => {
    if (expanded === category && browse === category) {
      setExpanded(null);
      return;
    }
    setExpanded(category);
    setBrowse(category);
    setPane((current) => (current === "settings" ? "calculator" : current));
  };

  const open = (id: string) => {
    const next = find(id);
    if (!next || !active.includes(next.packId)) return;
    setSelectedId(next.id);
    setExpanded(next.category);
    setBrowse(null);
    setPane((current) =>
      current === "lesson" || current === "video" ? current : "calculator",
    );
    try {
      localStorage.setItem(LAST, next.id);
    } catch {}
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: rebind native callbacks when activation changes
  useEffect(() => {
    void setCalculatorMenu(
      catalogItems
        .filter((entry) => active.includes(entry.packId))
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          category: categoryName(entry.category),
        })),
    );
    const stops = [
      onCalculatorSelected((id) => {
        open(id);
        setPane("calculator");
      }),
      onOpenSettings(() => setPane("settings")),
    ];
    return () => {
      for (const stop of stops) stop();
    };
  }, [active]);

  useEffect(() => {
    document.title = item.title;
  }, [item]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = isMac ? event.metaKey : event.ctrlKey;
      if (mod && (event.key === "k" || event.key === "f")) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (mod && event.key === ",") {
        event.preventDefault();
        setPane("settings");
      } else if (mod && event.key === "1") {
        event.preventDefault();
        setBrowse(null);
        setPane("calculator");
      } else if (mod && event.key === "2") {
        event.preventDefault();
        setBrowse(null);
        setPane("lesson");
      } else if (mod && event.key === "3") {
        event.preventDefault();
        setBrowse(null);
        setPane("video");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const available = query.trim()
    ? catalogItems
    : catalogItems.filter((entry) => active.includes(entry.packId));
  const results = filterItems(
    catalogItems.filter((entry) => active.includes(entry.packId)),
    query,
  );

  const gridItems = filterItems(available, query, browse ?? "all");

  const nav = {
    hrefFor: (id: CalculatorId) => `/?calculator=${id}`,
    categoryHref: (category: Category | "all") =>
      category === "all" ? "/" : `/?category=${category}`,
    onOpen: (id: CalculatorId) => {
      open(id);
      setPane("calculator");
    },
  };

  return (
    <div className="dk-shell">
      <SettingsDialog
        open={pane === "settings"}
        onClose={() => setPane("calculator")}
        active={active}
        toggle={toggle}
      >
        <Settings />
      </SettingsDialog>
      <aside className="dk-side">
        <div className="dk-drag" data-tauri-drag-region />
        <div className="dk-brand" data-tauri-drag-region>
          <BrandMark />
          <div className="oc-brand-text">
            <span className="oc-brand-name">{ui["ui.app.name"]}</span>
            <span className="oc-brand-sub">{ui["ui.app.tagline"]}</span>
          </div>
        </div>
        <div className="dk-search">
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder={ui["ui.search.short"]}
            aria-label={ui["ui.search.label"]}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              if (event.currentTarget.value.trim() !== "") {
                setBrowse((current) => current ?? "all");
                setPane((current) =>
                  current === "settings" ? "calculator" : current,
                );
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const first = results[0];
                if (first) nav.onOpen(first.id);
                searchRef.current?.blur();
              } else if (event.key === "Escape") {
                setQuery("");
                searchRef.current?.blur();
                return;
              } else return;
              event.preventDefault();
            }}
          />
          <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </div>
        <nav className="dk-list" aria-label={ui["ui.catalog.heading"]}>
          <button
            type="button"
            className="dk-cat dk-all"
            data-active={browse === "all" && pane !== "settings"}
            onClick={() => {
              setBrowse("all");
              setPane((current) =>
                current === "settings" ? "calculator" : current,
              );
            }}
          >
            <CategoryIcon category="all" />
            <span>{ui["ui.catalog.all"]}</span>
            <small>
              {
                catalogItems.filter((entry) => active.includes(entry.packId))
                  .length
              }
            </small>
          </button>
          {categoryOrder.map((category) => {
            const items = results.filter(
              (entry) => entry.category === category,
            );
            if (items.length === 0) return null;
            const isOpen = query.trim() !== "" || expanded === category;
            return (
              <div key={category} data-category={category}>
                <button
                  type="button"
                  className="dk-cat"
                  aria-expanded={isOpen}
                  data-active={browse === category && pane !== "settings"}
                  onClick={() => openCategory(category)}
                >
                  <CategoryIcon category={category} />
                  <span>{categoryName(category)}</span>
                  <svg
                    className="dk-chevron"
                    viewBox="0 0 16 16"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3.5L10.5 8 6 12.5" />
                  </svg>
                </button>
                <div className="dk-fold" data-open={isOpen}>
                  <div>
                    {items.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className="dk-item"
                        tabIndex={isOpen ? 0 : -1}
                        data-active={
                          pane !== "settings" &&
                          browse === null &&
                          entry.id === selectedId
                        }
                        onClick={() => nav.onOpen(entry.id)}
                      >
                        {short(entry.title)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {results.length === 0 ? (
            <p className="dk-empty">{ui["ui.search.empty"]}</p>
          ) : null}
        </nav>
        <footer>
          <button
            type="button"
            className="dk-item"
            data-active={pane === "settings"}
            onClick={() => setPane("settings")}
          >
            <GearIcon />
            {ui["ui.settings.title"]}
            <kbd>{isMac ? "⌘," : "Ctrl ,"}</kbd>
          </button>
        </footer>
      </aside>

      <div className="dk-main">
        <header className="dk-bar" data-tauri-drag-region>
          <div className="dk-title" data-tauri-drag-region>
            {pane === "settings" ? (
              <strong>{ui["ui.settings.title"]}</strong>
            ) : browse ? (
              <>
                <strong>
                  {browse === "all"
                    ? ui["ui.catalog.all"]
                    : categoryName(browse)}
                </strong>
                <span>{gridItems.length}</span>
              </>
            ) : (
              <>
                <strong>{item.title}</strong>
                <span>{categoryName(item.category)}</span>
              </>
            )}
          </div>
          {pane !== "settings" && !browse ? (
            <div className="dk-segment" role="tablist">
              {(["calculator", "lesson", "video"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={pane === value}
                  onClick={() => setPane(value)}
                >
                  {tabLabel[value]}
                </button>
              ))}
            </div>
          ) : null}
        </header>
        <main className="dk-content" data-category={item.category}>
          {pane === "settings" ? null : browse ? (
            gridItems.length === 0 ? (
              <p className="oc-empty dk-pad">{ui["ui.search.empty"]}</p>
            ) : (
              <div className="dk-grid oc-grid">
                {gridItems.map((entry) => (
                  <CalculatorCard
                    key={entry.id}
                    item={entry}
                    nav={nav}
                    inactive={!active.includes(entry.packId)}
                    onActivate={() => toggle(entry.packId)}
                  />
                ))}
              </div>
            )
          ) : pane === "video" ? (
            <VideoPane id={selectedId} />
          ) : active.includes(item.packId) ? (
            <CalculatorPane id={selectedId} lesson={pane === "lesson"} />
          ) : (
            <div className="dk-pad">
              <p>{ui["ui.packs.inactive"]}</p>
              <button type="button" onClick={() => toggle(item.packId)}>
                {ui["ui.packs.activate"]}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CalculatorPane(props: { id: CalculatorId; lesson: boolean }) {
  const { topic, error } = useTopic(props.id);
  const item = find(props.id) as CatalogItem;
  if (error) return <p className="oc-error dk-pad">{error}</p>;
  if (!topic) return <p className="oc-quiet dk-pad">{ui["ui.loading"]}</p>;
  return props.lesson ? (
    <div className="dk-pad dk-lesson">
      <LessonArticle
        lesson={topic.lesson}
        messages={topic.messages}
        locale="en-US"
        presenter={topic.presenter}
      />
    </div>
  ) : (
    <div className="dk-pad dk-tool">
      <topic.View
        id={props.id}
        title={item.title}
        description={item.description}
        messages={topic.messages}
        locale="en-US"
      />
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="2.2" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
