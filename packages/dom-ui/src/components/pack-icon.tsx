import type { ReactNode } from "react";

export const packIconPaths: Record<string, ReactNode> = {
  core: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M8 6h8m0 8v4m0-8h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
    </>
  ),
  "math-everyday": (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"
      />
    </>
  ),
  finance: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 18v-7m1.119-8.795a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949zM14 18v-7m4 7v-7M3 22h18M6 18v-7"
      />
    </>
  ),
  health: (
    <>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      <path d="M3.22 13H9.5l.5-1l2 4.5l2-7l1.5 3.5h5.27" />
    </>
  ),
  "date-time": (
    <>
      <path d="M8 2v3m8-3v3" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),
  units: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Zm-6.8-2.8l2-2m-5-1l2-2m-5-1l2-2m7 11l2-2"
      />
    </>
  ),
  geometry: (
    <>
      <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </>
  ),
  statistics: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 16v5m4-6.361V21m4-10.344V21m2-18l-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15m2 3.463V21m4-6.344V21"
      />
    </>
  ),
  cooking: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2 12h20m-2 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m0-4l16-4M8.86 6.78l-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"
      />
    </>
  ),
  construction: (
    <>
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m0-4a6 6 0 0 1 6 6v3M4 15v-3a6 6 0 0 1 6-6" />
      <rect width="20" height="4" x="2" y="15" rx="1" />
    </>
  ),
  physics: (
    <>
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9c-4.54-4.52-9.87-6.54-11.9-4.5c-2.04 2.03-.02 7.36 4.5 11.9c4.54 4.52 9.87 6.54 11.9 4.5" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9c-2.03-2.04-7.36-.02-11.9 4.5c-4.52 4.54-6.54 9.87-4.5 11.9c2.03 2.04 7.36.02 11.9-4.5" />
    </>
  ),
  education: (
    <>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </>
  ),
  settings: (
    <>
      <path d="M14 17H5M19 7h-9" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </>
  ),
};
export function PackIcon(props: { id: string; className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {packIconPaths[props.id] ?? packIconPaths.core}
    </svg>
  );
}
