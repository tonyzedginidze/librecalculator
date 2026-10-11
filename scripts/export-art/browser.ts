// These functions run in the browser via agent-browser eval. Keep them
// self-contained: serialization must not depend on module imports or closures.
type SceneRequest = { id: string; route: string; category: string };
type Scene = {
  id: string;
  category: string;
  sourceUrl: string;
  tileUrl: string;
  sourceBounds: { x: number; y: number; width: number; height: number };
  colors: Record<string, string>;
  fonts: Record<string, string>;
  background: Record<string, string>;
  viewBox: string;
  text: string[];
};
type StoredScene = {
  svg: SVGSVGElement;
  parent: HTMLElement;
  inlineStyles: (string | null)[];
  metadata: Scene;
  computed: Record<string, string>[];
};
declare global {
  interface Window {
    ocArtExport: {
      scenes: Map<string, StoredScene>;
      strokeBoundsSupported: boolean;
      theme: "light" | "dark";
      restore: () => void;
      hideContent: (overlay: HTMLElement) => void;
    };
  }
}

export async function captureScenes(
  items: SceneRequest[],
  theme: "light" | "dark",
) {
  window.ocArtExport?.restore();
  if (document.querySelector("astro-island[ssr]"))
    throw new Error("Astro islands are not fully hydrated; refusing SSR art");
  document.documentElement.dataset.theme = theme;
  await document.fonts.ready;
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  if (innerWidth !== 320 || innerHeight !== 180 || devicePixelRatio !== 1)
    throw new Error("Expected a 320x180 viewport at device scale 1");
  const properties = Array.from(
    new Set([
      "color",
      "fill",
      "stroke",
      "stroke-width",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-dasharray",
      "fill-opacity",
      "stroke-opacity",
      "opacity",
      "font-family",
      "font-size",
      "font-style",
      "font-weight",
      "font-stretch",
      "font-variant",
      "font-feature-settings",
      "font-variation-settings",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "text-anchor",
      "dominant-baseline",
      ...Array.from(getComputedStyle(document.documentElement)).filter((name) =>
        name.startsWith("font-"),
      ),
    ]),
  );
  const fonts = properties.filter(
    (name) =>
      name.startsWith("font-") ||
      name.endsWith("spacing") ||
      name === "line-height",
  );
  const backgrounds = [
    "background-color",
    "background-image",
    "background-size",
    "background-position",
    "background-repeat",
    "background-origin",
    "background-clip",
    "background-attachment",
  ];
  const values = (style: CSSStyleDeclaration, names: string[]) =>
    Object.fromEntries(
      names.map((name) => [name, style.getPropertyValue(name)]),
    );
  const scenes = new Map<string, StoredScene>();
  for (const item of items) {
    const tiles = document.querySelectorAll<HTMLAnchorElement>(
      `.oc-tile[href=${JSON.stringify(item.route)}]`,
    );
    if (tiles.length !== 1)
      throw new Error(`${item.id}: expected one hydrated tile`);
    const tile = tiles[0];
    const art = tile?.querySelector<HTMLElement>(".oc-tile-art");
    const svg = art?.querySelector<SVGSVGElement>("svg.oc-art");
    if (!tile || !art || !svg) throw new Error(`${item.id}: missing tile SVG`);
    if (tile.dataset.category !== item.category)
      throw new Error(`${item.id}: category mismatch`);
    if (svg.getAttribute("viewBox") !== "0 0 320 180")
      throw new Error(`${item.id}: unexpected native SVG dimensions`);
    const style = getComputedStyle(svg);
    const colors = values(
      style,
      Array.from(style).filter((name) => name.startsWith("--oc-")),
    );
    if (!colors["--oc-accent"] || !colors["--oc-ink"])
      throw new Error(`${item.id}: missing computed app tokens`);
    // Math deliberately uses the root accent; other categories have hue tokens.
    const categoryAccent = colors[`--oc-${item.category}`];
    if (categoryAccent && colors["--oc-accent"] !== categoryAccent)
      throw new Error(`${item.id}: category accent was not inherited`);
    const bounds = svg.getBoundingClientRect();
    const metadata: Scene = {
      id: item.id,
      category: item.category,
      sourceUrl: location.href,
      tileUrl: tile.href,
      sourceBounds: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      },
      colors,
      fonts: values(style, fonts),
      background: values(getComputedStyle(art), backgrounds),
      viewBox: svg.getAttribute("viewBox") ?? "",
      text: Array.from(
        svg.querySelectorAll("text"),
        (element) => element.textContent ?? "",
      ),
    };
    const elements = [svg, ...svg.querySelectorAll("*")];
    scenes.set(item.id, {
      svg,
      parent: art,
      inlineStyles: elements.map((element) => element.getAttribute("style")),
      metadata,
      computed: elements.map((element) =>
        values(getComputedStyle(element), properties),
      ),
    });
  }
  // Probe whether this browser actually honors getBBox({stroke:true}); some
  // Chromium versions accept the argument but silently return fill-only bounds.
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  probe.innerHTML =
    '<rect x="20" y="20" width="20" height="20" stroke="black" stroke-width="10"/>';
  document.body.append(probe);
  const rect = probe.firstElementChild as SVGGraphicsElement;
  const strokeBox = (rect.getBBox as (options: { stroke: boolean }) => DOMRect)(
    { stroke: true },
  );
  const strokeBoundsSupported = strokeBox.width > rect.getBBox().width;
  probe.remove();
  const hiddenContent = new Map<HTMLElement, string>();
  const restore = () => {
    const overlay = document.querySelector<HTMLElement>("#oc-art-export");
    const scene = scenes.get(overlay?.dataset.exportId ?? "");
    if (scene) {
      scene.parent.append(scene.svg);
      [scene.svg, ...scene.svg.querySelectorAll("*")].forEach(
        (element, index) => {
          const style = scene.inlineStyles[index];
          if (style === null || style === undefined)
            element.removeAttribute("style");
          else element.setAttribute("style", style);
        },
      );
    }
    overlay?.remove();
    for (const [element, display] of hiddenContent)
      element.style.display = display;
    hiddenContent.clear();
  };
  window.ocArtExport = {
    scenes,
    strokeBoundsSupported,
    theme,
    restore,
    hideContent: (overlay: HTMLElement) => {
      for (const child of document.body.children) {
        if (child === overlay) continue;
        const element = child as HTMLElement;
        hiddenContent.set(element, element.style.display);
        element.style.display = "none";
      }
    },
  };
  return Array.from(scenes.values(), (scene) => scene.metadata);
}

export async function showScene(id: string) {
  const state = window.ocArtExport;
  const scene = state.scenes.get(id);
  if (!scene) throw new Error(`${id}: no extracted scene`);
  state.restore();
  const overlay = document.createElement("div");
  overlay.id = "oc-art-export";
  overlay.dataset.category = scene.metadata.category;
  overlay.dataset.exportId = id;
  overlay.style.cssText =
    "position:fixed;left:0;top:0;width:320px;height:180px;z-index:2147483647;overflow:hidden;visibility:visible;isolation:isolate;pointer-events:none";
  for (const [name, value] of Object.entries({
    ...scene.metadata.colors,
    ...scene.metadata.fonts,
    ...scene.metadata.background,
  }))
    overlay.style.setProperty(name, value);
  // Move the actual SVG: duplicate IDs in a clone can resolve gradients/masks
  // against hidden originals. Restore it before the next scene or theme.
  const svg = scene.svg;
  svg.style.cssText +=
    ";width:320px;height:180px;display:block;transform:none;transition:none;animation:none;visibility:visible";
  const elements = [svg, ...svg.querySelectorAll("*")];
  // Pin inherited properties from each actual element, including text spans.
  // This preserves rendered content even when a selector depended on ancestors.
  elements.forEach((element, index) => {
    const computed = scene.computed[index];
    if (!computed) throw new Error(`${id}: SVG structure changed`);
    for (const [name, value] of Object.entries(computed))
      (element as SVGElement).style.setProperty(name, value);
  });
  overlay.append(svg);
  document.body.append(overlay);
  // Remove other paint layers, rather than inheritable visibility changes.
  // Restore their display values before collecting the next theme's styles.
  state.hideContent(overlay);
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  await document.fonts.ready;
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  if (document.documentElement.dataset.theme !== state.theme)
    throw new Error(`${id}: theme changed during capture`);
  const computed = getComputedStyle(svg);
  for (const [name, value] of Object.entries(scene.metadata.colors))
    if (computed.getPropertyValue(name) !== value)
      throw new Error(`${id}: token parity mismatch for ${name}`);
  elements.forEach((element, index) => {
    const style = getComputedStyle(element);
    for (const [name, value] of Object.entries(scene.computed[index] ?? {}))
      if (style.getPropertyValue(name) !== value)
        throw new Error(`${id}: rendered property mismatch for ${name}`);
  });
  const bounds = svg.getBoundingClientRect();
  if (
    innerWidth !== 320 ||
    innerHeight !== 180 ||
    devicePixelRatio !== 1 ||
    bounds.x !== 0 ||
    bounds.y !== 0 ||
    bounds.width !== 320 ||
    bounds.height !== 180
  )
    throw new Error(`${id}: invalid capture geometry`);
  const box = (rect: DOMRect | SVGRect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });
  const fillBounds = box(svg.getBBox());
  if (fillBounds.width <= 0 || fillBounds.height <= 0)
    throw new Error(`${id}: empty SVG bounds`);
  const strokeBounds = state.strokeBoundsSupported
    ? box(
        (svg.getBBox as (options: { stroke: boolean }) => DOMRect)({
          stroke: true,
        }),
      )
    : null;
  return {
    viewportBounds: box(bounds),
    fillBounds,
    strokeBounds,
    strokeBoundsSupported: state.strokeBoundsSupported,
    boundsUnits: "SVG user units (native pixels)",
  };
}
