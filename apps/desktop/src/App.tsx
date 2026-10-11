import { useEffect, useState } from "react";
import { QuickPanel } from "./quick/QuickPanel";
import { DesktopApp } from "./shell/DesktopApp";

export function App() {
  const panel = new URLSearchParams(window.location.search).get("panel");
  const [quick, setQuick] = useState(panel === "quick");
  useEffect(() => {
    const onPop = () => {
      setQuick(
        new URLSearchParams(window.location.search).get("panel") === "quick",
      );
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return quick ? <QuickPanel /> : <DesktopApp />;
}
