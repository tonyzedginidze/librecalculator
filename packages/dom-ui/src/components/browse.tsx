import {
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { plural } from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import {
  type CatalogItem,
  type Category,
  calculatorRoute,
  catalogItems,
  categoryOrder,
  filterItems,
} from "../catalog";
import {
  ActivePill,
  Collapse,
  FlowItem,
  FlowList,
  MotionProvider,
  PillGroup,
} from "../motion";
import { SettingsDialog, useActivePacks } from "../packs";
import { CalculatorArt, CategoryIcon, SearchIcon } from "./art";
import { PackIcon } from "./pack-icon";
import { Chevron } from "./select";

type Nav = {
  /** Link target for a calculator. */
  hrefFor: (id: CatalogItem["id"]) => string;
  /** Link target for a category ("all" is the catalog home). */
  categoryHref: (category: Category | "all") => string;
  /** Handle navigation in place (desktop); links still work without it. */
  onOpen?: (id: CatalogItem["id"]) => void;
  onCategory?: (category: Category | "all") => void;
};

export const webNav: Nav = {
  hrefFor: calculatorRoute,
  categoryHref: (category) =>
    category === "all" ? "/" : `/?category=${category}`,
};

const categoryLabel = (category: Category | "all") =>
  category === "all" ? ui["ui.catalog.all"] : ui[`ui.category.${category}`];

function intercept(handler: (() => void) | undefined) {
  return (event: MouseEvent) => {
    if (!handler || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    handler();
  };
}

function countText(count: number) {
  return plural("en-US", count, {
    one: ui["ui.catalog.count.one"],
    other: ui["ui.catalog.count.other"],
  }).replace("{count}", String(count));
}

export function BrandMark() {
  return (
    <div className="oc-brand-mark-wrap">
      <svg
        className="oc-brand-mark"
        viewBox="0 0 48 48"
        width="34"
        height="34"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Ring 1 (Vertical axis) */}
        <ellipse
          cx="24"
          cy="24"
          rx="8.5"
          ry="19.5"
          stroke="var(--oc-accent)"
          strokeWidth="2.8"
        />
        {/* Ring 2 (-60 deg equilateral orbital plane) */}
        <ellipse
          cx="24"
          cy="24"
          rx="8.5"
          ry="19.5"
          transform="rotate(-60 24 24)"
          stroke="var(--oc-accent)"
          strokeWidth="2.8"
        />
        {/* Ring 3 (+60 deg equilateral orbital plane) */}
        <ellipse
          cx="24"
          cy="24"
          rx="8.5"
          ry="19.5"
          transform="rotate(60 24 24)"
          stroke="var(--oc-accent)"
          strokeWidth="2.8"
        />
        {/* Central precision nucleus */}
        <circle cx="24" cy="24" r="5.2" fill="var(--oc-accent)" />
      </svg>
    </div>
  );
}

const SIDEBAR_KEY = "oc.sidebar.w";
const SIDEBAR_MIN = 224;
const SIDEBAR_MAX = 440;
const SIDEBAR_DEFAULT = 320;

function setSidebarWidth(width: number, save: boolean) {
  const next = Math.round(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, width)));
  document.documentElement.style.setProperty("--oc-sidebar-w", `${next}px`);
  if (!save) return next;
  try {
    localStorage.setItem(SIDEBAR_KEY, String(next));
  } catch {
    // Width just won't be remembered.
  }
  return next;
}

/** Drag, arrow keys, or double-click to resize the sidebar. */
function SidebarResizer() {
  const [width, setWidth] = useState(SIDEBAR_DEFAULT);

  useEffect(() => {
    const current = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--oc-sidebar-w",
      ),
    );
    if (Number.isFinite(current)) setWidth(current);
  }, []);

  const apply = (next: number, save = true) =>
    setWidth(setSidebarWidth(next, save));

  return (
    // biome-ignore lint/a11y/useSemanticElements: draggable splitter, not an <hr>
    <div
      className="oc-side-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label={ui["ui.sidebar.resize"]}
      aria-valuemin={SIDEBAR_MIN}
      aria-valuemax={SIDEBAR_MAX}
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={(event) => {
        event.preventDefault();
        const target = event.currentTarget;
        try {
          target.setPointerCapture(event.pointerId);
        } catch {
          // Capture is an enhancement; listeners below still work.
        }
        document.body.dataset.resizing = "true";
        const move = (moveEvent: PointerEvent) =>
          apply(moveEvent.clientX, false);
        const stop = (upEvent: PointerEvent) => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerup", stop);
          target.removeEventListener("pointercancel", stop);
          delete document.body.dataset.resizing;
          apply(upEvent.clientX);
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerup", stop);
        target.addEventListener("pointercancel", stop);
      }}
      onDoubleClick={() => apply(SIDEBAR_DEFAULT)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 48 : 16;
        if (event.key === "ArrowLeft") apply(width - step);
        else if (event.key === "ArrowRight") apply(width + step);
        else if (event.key === "Home") apply(SIDEBAR_DEFAULT);
        else return;
        event.preventDefault();
      }}
    />
  );
}

const MOBILE_QUERY = "(max-width: 52rem)";

/** True while the viewport uses the phone layout (sidebar becomes a drawer). */
function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return mobile;
}

function MenuIcon(props: { open: boolean }) {
  return (
    <svg
      className="oc-menu-icon"
      data-open={props.open}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

/** Sidebar: brand, search, categories. The selected category expands. */
export function Sidebar(props: {
  nav?: Nav;
  activeCategory?: Category | "all" | undefined;
  activeId?: CatalogItem["id"] | undefined;
  /** Share the search text with a page that filters by it (the home grid). */
  query?: string;
  onQuery?: (query: string) => void;
}) {
  const { nav: baseNav = webNav, activeId } = props;
  const { active, toggle } = useActivePacks();
  const [packSettings, setPackSettings] = useState(false);
  const [ownQuery, setOwnQuery] = useState("");
  const query = props.query ?? ownQuery;
  const setQuery = props.onQuery ?? setOwnQuery;
  const inputRef = useRef<HTMLInputElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; dx: number } | null>(null);
  const mobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerOpen = mobile && menuOpen;
  const activeCategory =
    props.activeCategory ??
    catalogItems.find((item) => item.id === activeId)?.category;
  const searching = query.trim() !== "";
  const visibleItems = catalogItems.filter((item) =>
    active.includes(item.packId),
  );
  const matches = filterItems(visibleItems, query);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key !== "/" || target?.closest("input, textarea, select"))
        return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobile) setMenuOpen(false);
  }, [mobile]);

  // Drawer open: lock the page behind it, close on Escape, return focus after.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!drawerOpen) {
      if (wasOpen.current)
        menuButtonRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      // Escape inside the settings dialog closes only the dialog.
      if (event.key !== "Escape" || document.querySelector("dialog[open]"))
        return;
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const closeMenu = () => setMenuOpen(false);
  // In-place navigation (home grid, desktop) closes the drawer as it acts.
  const nav: Nav = { ...baseNav };
  const { onOpen, onCategory } = baseNav;
  if (onOpen)
    nav.onOpen = (id) => {
      closeMenu();
      onOpen(id);
    };
  if (onCategory)
    nav.onCategory = (category) => {
      closeMenu();
      onCategory(category);
    };

  // Back/forward cache can restore the page with the drawer still open.
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) setMenuOpen(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  const openSearch = () => {
    setMenuOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 320);
  };

  // Swipe the drawer left to close it; it follows the finger until release.
  const onTouchStart = (event: TouchEvent) => {
    if (!drawerOpen) return;
    const touch = event.touches[0];
    if (touch) drag.current = { x: touch.clientX, y: touch.clientY, dx: 0 };
  };
  const onTouchMove = (event: TouchEvent) => {
    const start = drag.current;
    const touch = event.touches[0];
    const aside = asideRef.current;
    if (!start || !touch || !aside) return;
    const dx = Math.min(0, touch.clientX - start.x);
    if (start.dx === 0 && Math.abs(touch.clientY - start.y) > Math.abs(dx)) {
      drag.current = null;
      return;
    }
    start.dx = dx;
    aside.dataset.dragging = "true";
    aside.style.transform = `translate3d(${dx}px, 0, 0)`;
  };
  const onTouchEnd = () => {
    const start = drag.current;
    const aside = asideRef.current;
    drag.current = null;
    if (!start || !aside) return;
    delete aside.dataset.dragging;
    aside.style.transform = "";
    if (start.dx < -aside.offsetWidth * 0.25) setMenuOpen(false);
  };

  const brand = (
    <a
      className="oc-brand"
      href={nav.categoryHref("all")}
      onClick={intercept(nav.onCategory && (() => nav.onCategory?.("all")))}
    >
      <BrandMark />
      <div className="oc-brand-text">
        <span className="oc-brand-name">{ui["ui.app.name"]}</span>
        <span className="oc-brand-sub">{ui["ui.app.tagline"]}</span>
      </div>
    </a>
  );

  return (
    <MotionProvider>
      <header className="oc-mobilebar">
        {brand}
        <div className="oc-mobilebar-actions">
          <button
            type="button"
            className="oc-mobilebar-button"
            aria-label={ui["ui.search.label"]}
            onClick={openSearch}
          >
            <SearchIcon />
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="oc-mobilebar-button"
            aria-label={ui["ui.menu.open"]}
            aria-expanded={drawerOpen}
            aria-controls="oc-sidebar"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon open={drawerOpen} />
          </button>
        </div>
      </header>
      <div
        className="oc-scrim"
        data-open={drawerOpen}
        aria-hidden="true"
        onClick={closeMenu}
      />
      <aside
        ref={asideRef}
        id="oc-sidebar"
        className="oc-sidebar"
        data-open={drawerOpen}
        inert={mobile && !menuOpen ? true : undefined}
        aria-label={mobile ? ui["ui.menu.label"] : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <PillGroup>
          {(group) => (
            <div className="oc-side-scroll">
              <div className="oc-side-head">
                {brand}
                <button
                  ref={closeRef}
                  type="button"
                  className="oc-mobilebar-button oc-side-close"
                  aria-label={ui["ui.menu.close"]}
                  onClick={closeMenu}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <form
                className="oc-side-search"
                onSubmit={(event) => {
                  event.preventDefault();
                  const first = matches[0];
                  if (!searching || !first) return;
                  if (nav.onOpen) nav.onOpen(first.id);
                  else window.location.assign(nav.hrefFor(first.id));
                }}
              >
                <SearchIcon />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  placeholder={ui["ui.search.label"]}
                  aria-label={ui["ui.search.label"]}
                  autoComplete="off"
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
                <kbd title={ui["ui.search.shortcut"]}>/</kbd>
              </form>
              <nav
                className="oc-side-nav"
                aria-label={ui["ui.catalog.heading"]}
              >
                {" "}
                {(["all", ...categoryOrder] as const).map((category, index) => {
                  const inCategory = matches.filter(
                    (item) => category === "all" || item.category === category,
                  );
                  const active = category === activeCategory;
                  const showItems = category !== "all" && (active || searching);
                  if (category !== "all" && inCategory.length === 0)
                    return null;
                  return (
                    <div
                      className="oc-side-group"
                      key={category}
                      data-category={category === "all" ? undefined : category}
                      style={{ "--oc-i": index } as CSSProperties}
                    >
                      <a
                        className="oc-side-link"
                        href={nav.categoryHref(category)}
                        aria-current={active && !activeId ? "page" : undefined}
                        data-active={active}
                        data-expanded={showItems}
                        onClick={intercept(
                          nav.onCategory && (() => nav.onCategory?.(category)),
                        )}
                      >
                        {active ? <ActivePill group={`${group}-cat`} /> : null}
                        <CategoryIcon category={category} />
                        <span>{categoryLabel(category)}</span>
                        <span className="oc-side-count">
                          {category === "all"
                            ? visibleItems.length
                            : visibleItems.filter(
                                (i) => i.category === category,
                              ).length}
                        </span>
                        <span className="oc-side-chevron" aria-hidden="true">
                          {category === "all" ? null : <Chevron />}
                        </span>
                      </a>
                      <Collapse open={showItems}>
                        <ul className="oc-side-items">
                          {inCategory.map((item) => (
                            <li key={item.id}>
                              <a
                                href={nav.hrefFor(item.id)}
                                aria-current={
                                  item.id === activeId ? "page" : undefined
                                }
                                onClick={intercept(
                                  nav.onOpen && (() => nav.onOpen?.(item.id)),
                                )}
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </div>
                  );
                })}
              </nav>
            </div>
          )}
        </PillGroup>
        <div className="oc-side-settings">
          <button
            type="button"
            className="oc-side-link"
            aria-expanded={packSettings}
            onClick={() => setPackSettings((value) => !value)}
          >
            <PackIcon id="settings" />
            <span>{ui["ui.settings.title"]}</span>
          </button>
        </div>
        <SidebarResizer />
      </aside>
      <SettingsDialog
        open={packSettings}
        onClose={() => setPackSettings(false)}
        active={active}
        toggle={toggle}
      />
    </MotionProvider>
  );
}

export function CalculatorCard(props: {
  item: CatalogItem;
  nav?: Nav;
  inactive?: boolean;
  onActivate?: () => void;
}) {
  const { item, nav = webNav } = props;
  if (props.inactive)
    return (
      <div className="oc-tile" data-category={item.category}>
        <div className="oc-tile-art">
          <CalculatorArt id={item.id} />
        </div>
        <div className="oc-tile-body">
          <span className="oc-tile-category">
            {categoryLabel(item.category)}
          </span>
          <h2 className="oc-tile-title">{item.title}</h2>
          <p className="oc-tile-text">{item.description}</p>
          <button type="button" onClick={props.onActivate}>
            {ui["ui.packs.activate"]}
          </button>
        </div>
      </div>
    );
  return (
    <a
      className="oc-tile"
      data-category={item.category}
      href={nav.hrefFor(item.id)}
      onClick={intercept(nav.onOpen && (() => nav.onOpen?.(item.id)))}
    >
      <div className="oc-tile-art">
        <CalculatorArt id={item.id} />
      </div>
      <div className="oc-tile-body">
        <span className="oc-tile-category">{categoryLabel(item.category)}</span>
        <h2 className="oc-tile-title">{item.title}</h2>
        <p className="oc-tile-text">{item.description}</p>
      </div>
    </a>
  );
}

/** Catalog home: top bar and the calculator grid. */
export function CatalogBrowser(props: {
  nav?: Nav;
  initialCategory?: Category | "all";
}) {
  const { nav = webNav } = props;
  const [category, setCategory] = useState<Category | "all">(
    props.initialCategory ?? "all",
  );
  const [query, setQuery] = useState("");
  const { active, toggle } = useActivePacks();

  useEffect(() => {
    if (props.initialCategory) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("category");
    const match = categoryOrder.find((value) => value === requested);
    if (match) setCategory(match);
  }, [props.initialCategory]);

  const results = filterItems(
    query.trim()
      ? catalogItems
      : catalogItems.filter((item) => active.includes(item.packId)),
    query,
    category,
  );
  const select = (next: Category | "all") => {
    setCategory(next);
    try {
      window.history.replaceState(null, "", nav.categoryHref(next));
    } catch {
      // Not critical: the URL just won't reflect the category.
    }
  };
  const browserNav: Nav = { ...nav, onCategory: select };

  return (
    <div className="oc-app">
      <Sidebar
        nav={browserNav}
        activeCategory={category}
        query={query}
        onQuery={setQuery}
      />
      <main className="oc-main" id="calculator">
        <p className="oc-quiet oc-result-count" aria-live="polite">
          {category === "all" ? "" : `${categoryLabel(category)} · `}
          {countText(results.length)}
        </p>
        {results.length === 0 ? (
          <p className="oc-empty">{ui["ui.search.empty"]}</p>
        ) : (
          <MotionProvider>
            <FlowList className="oc-grid">
              {results.map((item) => (
                <FlowItem key={item.id}>
                  <CalculatorCard
                    item={item}
                    nav={browserNav}
                    inactive={!active.includes(item.packId)}
                    onActivate={() => toggle(item.packId)}
                  />
                </FlowItem>
              ))}
            </FlowList>
          </MotionProvider>
        )}
      </main>
    </div>
  );
}
