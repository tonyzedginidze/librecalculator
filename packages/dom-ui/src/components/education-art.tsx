import type { ReactNode } from "react";

/** 24x24 stroke icons for education operations; one distinct drawing per operation. */
export const educationOperationPaths: Record<string, ReactNode> = {
  /* Three course bars levelled by a dashed average line. */
  "gpa-average": (
    <>
      <path d="M6 21v-8M12 21V5M18 21v-11" />
      <path d="M3 11.5h18" strokeDasharray="2 2.5" />
    </>
  ),
  /* Two terms overlapping into one record. */
  "gpa-combined": (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  /* A target: the points a goal GPA needs. */
  "gpa-target": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  /* A marked paper with a percent sign. */
  "grade-percent": (
    <>
      <path d="M5 3h9l5 5v13H5z" />
      <path d="M14 3v5h5M9 18l6-7" />
      <circle cx="9.5" cy="12" r="1.25" />
      <circle cx="14.5" cy="17" r="1.25" />
    </>
  ),
  /* One slice lifted out of the course grade. */
  "grade-contribution": (
    <>
      <path d="M11 4a8 8 0 1 0 8 8h-8z" />
      <path d="M14 3a7 7 0 0 1 7 7h-7z" />
    </>
  ),
  /* A points bar with the target mark ahead of the fill. */
  "grade-required-points": (
    <>
      <rect x="3" y="9" width="18" height="6" rx="1.5" />
      <path d="M6 12h6M16 5v14" />
    </>
  ),
  /* The finish flag: the score the final must reach. */
  "final-required": (
    <>
      <path d="M6 21V3.5" />
      <path d="M6 4h12l-3 4 3 4H6" />
    </>
  ),
  /* A trend line projected forward to the end of term. */
  "final-projected": (
    <>
      <path d="M3 18l5-5 4 3" />
      <path d="M12 16l6.5-7.5" strokeDasharray="2 2.5" />
      <circle cx="19.5" cy="7.5" r="1.75" />
    </>
  ),
  /* A stack of coursework pages. */
  "final-current-needed": (
    <>
      <rect x="4" y="7" width="12" height="14" rx="1.5" />
      <path d="M8 3.5h10.5a1.5 1.5 0 0 1 1.5 1.5v12M7.5 12h5M7.5 16h5" />
    </>
  ),
  /* Answer sheet with ticked questions. */
  "test-percentage": (
    <path d="M3.5 7l2 2 3.5-3.5M3.5 16l2 2 3.5-3.5M12.5 8h8M12.5 17h8" />
  ),
  /* A crossed-out answer. */
  "test-missed": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  /* Squares counted up to the pass mark, one more to add. */
  "test-needed": (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <path d="M16.75 14v6M13.75 17h6" />
    </>
  ),
};
