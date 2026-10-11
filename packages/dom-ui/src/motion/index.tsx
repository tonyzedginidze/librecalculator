import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";

/**
 * Motion primitives, adapted from motion-primitives (ibelick) to this
 * project's plain-CSS design system. Everything honours the visitor's
 * reduced-motion setting and renders its final state on first paint, so
 * server HTML and no-JS visitors never see hidden content.
 */

export const spring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.8,
};

export const ease: Transition = { duration: 0.18, ease: [0.2, 0, 0, 1] };

export function MotionProvider(props: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{props.children}</MotionConfig>;
}

/** A pill that slides between the active item of a group (AnimatedBackground). */
export function ActivePill(props: {
  group: string;
  /** Outlined pill that covers its host's own border (option buttons). */
  ring?: boolean;
  radius?: number;
}) {
  const live = useContext(Live);
  // Plain element until the visitor interacts: nothing can animate at load.
  const className = props.ring ? "oc-pill oc-pill-ring" : "oc-pill";
  const style = { borderRadius: props.radius ?? 4 };
  if (!live)
    return <span className={className} style={style} aria-hidden="true" />;
  return (
    <motion.span
      className={className}
      style={style}
      layoutId={`pill-${props.group}`}
      transition={spring}
      aria-hidden="true"
    />
  );
}

/** Pills stay put until the visitor interacts, so load-time layout shifts never animate. */
const Live = createContext(false);

/** Scopes shared-layout pills to one component instance. */
export function PillGroup(props: { children: (group: string) => ReactNode }) {
  const group = useId();
  const [live, setLive] = useState(false);
  const arm = () => setLive(true);
  return (
    <Live.Provider value={live}>
      <LayoutGroup id={group}>
        <div
          style={{ display: "contents" }}
          onPointerDownCapture={arm}
          onKeyDownCapture={arm}
        >
          {props.children(group)}
        </div>
      </LayoutGroup>
    </Live.Provider>
  );
}

/** Height-animated expand/collapse (Disclosure). Open on first paint. */
export function Collapse(props: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {props.open ? (
        <motion.div
          className={props.className}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={ease}
          style={{ overflow: "hidden" }}
        >
          {props.children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Items that fade/scale in and out as a filtered list changes (AnimatedGroup). */
export function FlowList(props: { className?: string; children: ReactNode }) {
  return (
    <motion.div className={props.className} layout transition={spring}>
      <AnimatePresence initial={false} mode="popLayout">
        {props.children}
      </AnimatePresence>
    </motion.div>
  );
}

export function FlowItem(props: { children: ReactNode }) {
  return (
    <motion.div
      className="oc-grid-cell"
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={ease}
    >
      {props.children}
    </motion.div>
  );
}
