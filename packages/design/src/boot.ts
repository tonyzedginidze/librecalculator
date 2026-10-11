import { tokens } from "./tokens";

/** Runs before paint. Follows the system color scheme; nothing is stored. */
export function bootScript(): string {
  const light = tokens.color.light;
  const dark = tokens.color.dark;
  return `(function(){try{var w=parseFloat(localStorage.getItem("oc.sidebar.w"));if(w>=224&&w<=440)document.documentElement.style.setProperty("--oc-sidebar-w",w+"px");}catch(e){}var q=window.matchMedia("(prefers-color-scheme: dark)");function apply(){var d=q.matches;var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";r.style.backgroundColor=d?${JSON.stringify(dark.canvas)}:${JSON.stringify(light.canvas)};r.style.color=d?${JSON.stringify(dark.ink)}:${JSON.stringify(light.ink)};}apply();q.addEventListener("change",apply);})();`;
}
