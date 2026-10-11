import { variableCss } from "@open-calculators/design/css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@open-calculators/design/ui.css";
import { App } from "./App";
import "./desktop.css";
import { isMac, isTauri } from "./tauri";
import { watchTheme } from "./theme";

const tokens = document.createElement("style");
tokens.textContent = variableCss;
document.head.append(tokens);

document.documentElement.dataset.platform = isMac ? "mac" : "other";
if (isTauri()) document.documentElement.dataset.native = "true";
watchTheme();

const root = document.querySelector("#root");
if (!root) throw new Error("Missing desktop root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
